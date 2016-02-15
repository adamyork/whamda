/*!
 * whamda
 * Copyright(c) 2015 Adam York
 * MIT Licensed
 */

'use strict';

var fs = require('fs');
var _ = require('underscore-node');
var uglifyJs = require('uglify-js');
var chalk = require('chalk');

module.exports = create();

var NAMED_SIG_REGEX = /function [^\(\)]+\([^\)]*\){/g;
var SCOPED_SIG_REGEX = /var [^=\)]+[\s]*=[\s]*function\([^\)]*\)[\s]*{/g;
var SCOPED_NESTED_REGEX = /,[A-Za-z0-9]+=function\([^\)]*\)\{/g;
var PROP_SIG_REGEX = /[A-Za-z0-9\.]+=function\([^\)]*\)\{/g;
var ANON_SIG_REGEX = /function\([^\)]*\){/g;

var WHAMDA_LOG_PREFIX = chalk.magenta('whamda') + chalk.blue('! ');
var WHAMDA_DELIMITER = chalk.grey('________________________________________________________________');

function log() {
    var str = '';
    _.each(arguments, function(argument, i) {
        if (i === 0) {
            argument = chalk.green(argument);
        } else {
            argument = chalk.white(argument);
        }
        str += '\n' + argument;
    });
    //console.log(WHAMDA_LOG_PREFIX + str);
}

function output() {
    var str = '';
    _.each(arguments, function(argument, i) {
        if (i === 0) {
            argument = chalk.green(argument);
        } else {
            argument = chalk.white(argument);
        }
        str += '\n' + argument;
    });
    console.log(WHAMDA_LOG_PREFIX + str);
}

function create() {
    return {
        process: process
    };
}

function process(list, outputDirectory) {
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }
    var minified;
    _.each(list, function(file) {
        var result;
        var options = {
            mangle: {
                topLevel: true,
            }
        };

        try {
            result = uglifyJs.minify(file, options);
            minified = result.code;
        } catch (err) {
            log('ERROR normalizing input : ' + file, err);
            return;
        }

        log('normalizing input', minified + '\n' + WHAMDA_DELIMITER);

        output('safely wrapping closures\n' + WHAMDA_DELIMITER);
        minified = safelyWrap(minified);

        output('replacing scoped nested functions\n' + WHAMDA_DELIMITER);
        minified = whamda(minified, SCOPED_NESTED_REGEX, mapScopedNested, mapNewFromNested, 1,
            generateNestedArgs);

        // output('replacing named functions\n' + WHAMDA_DELIMITER);
        // minified = whamda(minified, NAMED_SIG_REGEX, mapNamed, mapNewFromNested, 0,
        //     generateNamedArgs);

        // output('replacing scoped functions\n' + WHAMDA_DELIMITER);
        // minified = whamda(minified, SCOPED_SIG_REGEX, mapScoped, mapNewFromNested, 0,
        //     generateNamedArgs);

        // output('replacing property functions\n' + WHAMDA_DELIMITER);
        // minified = whamda(minified, PROP_SIG_REGEX, mapProp, mapNewFromNested, 0, generateNamedArgs);

        // output('replacing anon function\n' + WHAMDA_DELIMITER);
        // minified = whamda(minified, ANON_SIG_REGEX, mapAnon);

        output('finished');
        fs.writeFile(outputDirectory + '/' + file, minified, function(err) {
            if (err) {
                return log(err);
            }
        });
    });
}

function whamda(input, regex, transform, newObjectTransform, signatureOffset, argsGenerator) {
    log(input);
    var buffer = input;
    var signatures = [];
    var captures;
    while ((captures = regex.exec(buffer))) {
        var sig = captures[0];
        if (signatureOffset) {
            sig = sig.slice(signatureOffset, sig.length);
        }
        signatures.push(sig);
    }
    log('signatures', signatures);
    _.each(signatures, function(signature) {
        var index = buffer.indexOf(signature);
        var left = buffer.slice(0, index);
        var right = buffer.substring(index + signature.length, buffer.length);
        var end = scan(right, '{', '}', 1);
        var expression = signature + right.substring(0, end);
        var state = getDefaultState(buffer, signature, expression, index, transform, newObjectTransform,
            argsGenerator);
        var rebuilt = rebuild(state);
        buffer = rebuilt.input;
        var expressionIndex = buffer.indexOf(expression);
        var expressionLeft = buffer.slice(0, expressionIndex);
        var expressionRight = buffer.slice(expressionIndex + expression.length, buffer.length);
        buffer = expressionLeft + rebuilt.expression + expressionRight;
        rebuilt.input = buffer;
        buffer = handleObjectCreation(rebuilt).input;
    });
    return buffer;
}

function getDefaultState(input, signature, expression, index, transform, newObjectTransform, argsGenerator) {
    return {
        input: input,
        signature: signature,
        args: null,
        name: null,
        expression: expression,
        proto: '',
        index: index,
        transform: transform,
        newObjectTransform: newObjectTransform,
        argsGenerator: argsGenerator
    };
}

function scan(input, open, close, offset, quoteState) { //jshint ignore:line
    var i;
    offset = offset || 0;
    var count = offset;
    quoteState = quoteState || {
        doubleQuotes: false,
        singleQuotes: false
    };
    for (i = 0; i < input.length; i++) {
        var next = input[i];
        quoteState = manageQuoteState(input[i], quoteState);
        if (quoteState.doubleQuotes || quoteState.singleQuotes) {
            continue;
        }
        if (next === open) {
            count++;
        } else if (next === close) {
            count--;
        }
        if (count === 0) {
            break;
        }
    }
    if (quoteState.doubleQuotes || quoteState.singleQuotes) {
        return scan(input, open, close, offset, quoteState);
    }
    return i + 2 - offset;
}

function manageQuoteState(chr, state) {
    if (chr === '"' && !state.singleQuotes) {
        if (state.doubleQuotes === true) {
            state.doubleQuotes = false;
        } else {
            state.doubleQuotes = true;
        }
    }
    if (chr === '\'' && !state.doubleQuotes) {
        if (state.singleQuotes === true) {
            state.singleQuotes = false;
        } else {
            state.singleQuotes = true;
        }
    }
    return state;
}

function rebuild(state) {
    var args = '(' + state.signature.split('(')[1].split(')')[0] + ')';
    state.args = args;
    return state.transform(state);
}

function handleObjectCreation(state) {
    if (state.newObjectTransform) {
        return state.newObjectTransform(state);
    }
    return state;
}

function generateArgumentsObject(state) {
    var args = state.args.split('(')[1].split(')')[0];
    var str = 'var arguments=[' + args + '];';
    return str;
}

function mapScopedNested(state) {
    var name = state.expression.split('=')[0].trim();
    var proto = name + '.prototype=Function.apply(0).prototype';
    state.name = name;
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace('=function', '=');
    state.expression = state.expression.replace('){', ')=>{');
    state.expression = state.expression.replace(')=>{', ')=>{' + argumentsObject);
    state.expression = state.expression + ',whamz=(' + proto + ')';
    state.proto = ',whamz=(' + state.name + '.prototype=Function.apply(0).prototype)';
    return state;
}

function mapNamed(state) {
    var name = state.expression.split('function')[1].split('(')[0].trim();
    var proto = name + '.prototype=Function.apply(0).prototype;';
    state.name = name;
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace('function', 'var');
    state.expression = state.expression.replace(state.args, '=' + state.args + '=>');
    state.expression = state.expression.replace(')=>{', ')=>{' + argumentsObject);
    state.expression = state.expression + ';' + proto;
    state.proto = ';' + state.name + '.prototype=Function.apply(0).prototype;';
    return state;
}

function mapScoped(state) {
    var name = state.expression.split('var')[1].split('=')[0].trim();
    var proto = name + '.prototype=Function.apply(0).prototype';
    state.name = name;
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace('function', '');
    state.expression = state.expression.replace(state.args, state.args + '=>');
    state.expression = state.expression.replace(')=>{', ')=>{' + argumentsObject);
    state.expression = state.expression + ',whamz=(' + proto + ')';
    state.proto = ',whamz=(' + state.name + '.prototype=Function.apply(0).prototype)';
    return state;
}

function mapProp(state) {
    var name = state.signature.split('=')[0];
    var proto = name + '.prototype=Function.apply(0).prototype';
    state.name = name;
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace('function', '');
    state.expression = state.expression.replace(state.args,
        state.args + '=>');
    state.expression = state.expression.replace(')=>{', ')=>{' + argumentsObject);
    state.expression =
        state.expression + ',whamz=(' + proto + ')';
    state.proto = ',whamz=(' + state.name +
        '.prototype=Function.apply(0).prototype)';
    return state;
}

function mapAnon(state) {
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace(state.args, state.args + '=>');
    state.expression = state.expression.replace(')=>{', ')=>{' + argumentsObject);
    var left =
        '((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(';
    state.expression = state.expression.replace('function', left);
    state.expression = state.expression + ')';
    return state;
}

function findAssignments(name, state, matches) {
    //This is bad , there are other symbols that need to be excluded.
    var regex = new RegExp('[A-Za-z0-9._$]+=' + name.trim() + '(?![A-Za-z0-9.(?|&[\\+\\-\\^\\*])', 'g');
    var capture;
    matches = matches || [];
    if (matches.length === 0) {
        var self = [];
        self[0] = name + '=' + name;
        self['index'] = state.index;
        self['input'] = state.input;
        matches.push(self);
    }
    if (state.expression.indexOf('root._ = previousUnderscore') !== -1) {
        log('found it !!!!!\n\n\n\n');
    }
    log('regex ', regex);
    //log('state.input ', state.input);
    while ((capture = regex.exec(state.input))) {
        log('capture', capture[0]);
        var added = _.find(matches, function(match) {
            return match.index === capture.index;
        });
        if (!added) {
            var assignee = capture[0].split('=')[0].trim();
            matches.push(capture);
            matches = findAssignments(assignee, state, matches);
        }
    }
    matches = _.uniq(matches, function(match) {
        return match.index;
    });
    return matches;
}

function findNewInvocations(collection, state) {
    //log('collection', collection);
    var matches = [];
    for (var i = 0; i < collection.length; i++) {
        var reference = collection[i][0].split('=')[0];
        var regex = new RegExp('new ' + reference + '(?![.])', 'g');
        var capture;
        while ((capture = regex.exec(state.input))) {
            if (state.expression.indexOf('[object Boolean]') !== -1) {
                log('found it !!\n\n\n\n');
                log(state.input);
                log('_______________________\n');
            }
            log('doing regex', regex);
            //log('state.expression', state.expression);
            var isValid = isValidNewCapture(capture);
            var inString = isInString(capture);
            var expressionScope = findScope(state.input.indexOf(state.expression), state.input);
            var invocationScope = findScope(capture.index, state.input);
            //log('expressionScope', expressionScope);
            //log('---------------------------------');
            //log('invocationScope', invocationScope);
            if (!inString && isValid) {
                if (expressionScope === invocationScope || expressionScope.indexOf(invocationScope) !== -1) {
                    //log('scopes match adding');
                    matches.push(capture);
                }
            }
        }
    }
    matches = _.uniq(matches, function(match) {
        return match.index;
    });
    matches = _.sortBy(matches, function(match) {
        return match.index;
    }).reverse();
    return matches;
}

function findScope(index, input) {
    var standard = /function[^\{]+\{/;
    var lamda = /\([^\)]*\)=>\{/;
    var pos = index;
    var next = '';
    var skip = 0;
    var start, end;
    while (pos >= 0) {
        //log('spam', next);
        pos--;
        if (input[pos] === '}') {
            skip++;
        } else if (input[pos] === '{' && skip !== 0) {
            skip--;
        } else {
            next = input[pos] + next;
            if (standard.test(next) || lamda.test(next)) {
                // log('standard.test(next)', standard.test(next));
                // log('lamda.test(next)', lamda.test(next));
                // log('spam', next);
                start = pos;
                break;
            }
        }
    }
    next = '';
    skip = 0;
    pos = index;
    while (pos < input.length) {
        pos++;
        if (input[pos] === '{') {
            skip++;
        } else if (input[pos] === '}' && skip !== 0) {
            skip--;
        } else {
            next += input[pos];
            if (input[pos] === '}') {
                end = pos;
                break;
            }
        }
    }
    return input.slice(start, end);
}

function isInString(capture) {
    var singleQuotesOpen = false;
    var doubleQuotesOpen = false;
    var singleQuotesClosed = false;
    var doubleQuotesClosed = false;
    var pos = capture.index;
    var next;
    while (pos >= 0) {
        next = capture.input[pos];
        if (next === '\'') {
            singleQuotesOpen = !singleQuotesOpen;
        }
        if (next === '"') {
            doubleQuotesOpen = !doubleQuotesOpen;
        }
        pos--;
    }
    pos = capture.index;
    while (pos < capture.input.length) {
        next = capture.input[pos];
        if (next === '\'') {
            singleQuotesClosed = !singleQuotesClosed;
        }
        if (next === '"') {
            doubleQuotesClosed = !doubleQuotesClosed;
        }
        pos++;
    }
    return (singleQuotesOpen || doubleQuotesOpen) && (singleQuotesClosed || doubleQuotesClosed);
}

function safelyWrap(input) {
    var CALL_REGEX = /(\}\.call)/g;
    var TERMINATOR_REGEX = /(\.call\(this.*?\),function)/g;
    var ALT_TERMINATOR_REGEX = /(.+=function)/g;
    var matches = [];
    var capture;
    while ((capture = CALL_REGEX.exec(input))) {
        matches.push(capture[0]);
    }
    if (matches.length === 0) {
        return input;
    }
    log('found ' + matches.length + ' to safely wrap');
    _.each(matches, function(expression) {
        var start = input.indexOf(expression);
        var str = '';
        for (var i = start; i >= 0; i--) {
            str = input[i] + str;
            var match = TERMINATOR_REGEX.exec(str);
            var altMatch = ALT_TERMINATOR_REGEX.exec(str);
            var offset;
            if (match) {
                offset = i + match[0].length - 'function'.length;
            }
            if (match) {
                input = input.substring(0, offset) + '(' + input.substring(offset, input.length);
                input = input.replace('}.call(', '}).call(');
                break;
            }
            if (altMatch) {
                var scope = findScope(start, input);
                var originalScope = scope;
                scope = scope.replace('function', '(function');
                input = input.replace(originalScope, scope);
                input = input.replace('}.call(', '}).call(');
                break;
            }
        }
    });
    return input;
}

function mapNewFromNested(state) {
    state.expression = state.expression.slice(0, state.expression.indexOf(state.proto));
    //log('modified', state.expression);
    var assignments = findAssignments(state.name, state);
    var mappedA = _.map(assignments, function(g) {
        return g[0];
    });
    //log('aaaaamapped', mappedA);
    //log('assignments', assignments);
    var invocations = findNewInvocations(assignments, state);
    //log('invocations', invocations);
    var mapped = _.map(invocations, function(g) {
        return g.index;
    });
    //log('mapped', mapped);
    //log('invocations', invocations);
    for (var i = 0; i < invocations.length; i++) {
        var invocation = invocations[i];
        //log('before inside ', state.input);
        //log('inside ', invocation[0]);
        var invocationName = invocation[0].split('new ')[1];
        var args = '()';
        if (state.input[invocation.index + invocation[0].length] === '(') {
            var right = state.input.substring(invocation.index + invocation[0].length,
                state.input.length);
            //log('right', right);
            var end = scan(right, '(', ')');
            // log('end', end);
            args = right.substring(0, end - 1);
            //log('args', args);
        }
        var pattern = ')=>{';
        var signature = state.expression.slice(0, state.expression.indexOf(pattern) +
            pattern.length);
        var lambda = buildLamda(invocationName, args, state);
        var inputLeft = state.input.slice(0, invocation.index);

        var argsLen = (args === '()') ? 0 : args.length;

        var inputRight = state.input.slice(invocation.index + invocation[0].length +
            argsLen, state.input.length);
        // log('inputLeft ', inputLeft);
        // log('______________________');
        // log('invocation[0]', invocation[0]);
        // log('invocation.index', invocation.index);
        // log('inputRight ', inputRight);
        // log('______________________');
        // log('lambda', lambda);
        // log('______________________');
        state.input = inputLeft + lambda + inputRight;
        //log('state.input ', state.input);
    }
    return state;
}

function buildLamda(name, args, state) {
    //log('name', name);
    //log('args', args);
    //log('expression', state.expression);
    var signature = state.signature.replace('function', '');
    //log('build lambda sig is', signature);
    signature = signature.replace('){', ')=>{');
    var signatureArgs = state.argsGenerator(signature);
    //log('signatureArgs2', signatureArgs);
    var pattern = '=>{';
    var body = state.expression.slice(state.expression.indexOf(pattern) + pattern.length, state.expression.length -
        1);
    //log('body', body);
    //log('body name', state.name);
    body = body.replace('this', 'psuedoNew');
    //log('body after repleace', body);
    var invocationArgs = args.slice(1, args.length - 1).split(',');
    invocationArgs.unshift(name);
    invocationArgs = invocationArgs.join(',');
    if (invocationArgs[invocationArgs.length - 1] === ',') {
        invocationArgs = invocationArgs.slice(0, invocationArgs.length - 1);
    }
    //log('invocationArgs', invocationArgs);
    var lambda = '((' + signatureArgs + ')=>{var psuedoNew = Object.create(func.prototype);' + body +
        ';return psuedoNew;})(' + invocationArgs + ')';
    return lambda;
}

function generateNestedArgs(signature) {
    //log('sig', signature.split('='));
    var signatureArgs = signature.split('=')[1];
    //log('signatureArgs1', signatureArgs);
    signatureArgs = signatureArgs.slice(1, signatureArgs.length - 1).split(',');
    signatureArgs.unshift('func');
    signatureArgs = signatureArgs.join(',');
    if (signatureArgs[signatureArgs.length - 1] === ',') {
        signatureArgs = signatureArgs.slice(0, signatureArgs.length - 1);
    }
    return signatureArgs;
}

function generateNamedArgs(signature) {
    //log('named', signature);
    //log('sig', signature.split(')=>{'));
    var signatureArgs = signature.split(')=>{')[0];
    //log('signatureArgs1', signatureArgs);
    signatureArgs = signatureArgs.slice(signatureArgs.indexOf('(') + 1, signatureArgs.length).split(',');
    signatureArgs.unshift('func');
    signatureArgs = signatureArgs.join(',');
    //log('joined', signatureArgs);
    if (signatureArgs[signatureArgs.length - 1] === ',') {
        signatureArgs = signatureArgs.slice(0, signatureArgs.length - 1);
    }
    return signatureArgs;
}

function isValidNewCapture(capture) {
    var sample = capture.input.slice(capture.index + capture[0].length, capture.index + capture[0].length + 1);
    var regex = /[A-Za-z0-9]/g;
    var isNotValid = regex.test(sample);
    return !isNotValid;
}