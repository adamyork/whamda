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

var FUNC_STR = '){';
var LAMDA_STR = ')=>{';

function log() {
    var str = '';
    _.each(arguments, function(argument, i) {
        if (i === 0) {
            argument = chalk.green(argument);
        } else {
            argument = chalk.white(argument);
        }
        str += argument;
    });
    console.log(str);
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
    var timeStart = Date.now();
    log(WHAMDA_LOG_PREFIX);
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
        log('normalizing input for ', file);
        log(WHAMDA_DELIMITER);

        log('safely wrapping closures');
        minified = safelyWrap(minified);
        log(WHAMDA_DELIMITER);

        log('replacing scoped nested functions');
        minified = whamda(minified, SCOPED_NESTED_REGEX, mapScopedNested, mapNew, 1, generateNestedArgs);
        log(WHAMDA_DELIMITER);

        log('replacing named functions');
        minified = whamda(minified, NAMED_SIG_REGEX, mapNamed, mapNew, 0, generateNamedArgs);
        log(WHAMDA_DELIMITER);

        log('replacing scoped functions');
        minified = whamda(minified, SCOPED_SIG_REGEX, mapScoped, mapNew, 0, generateNamedArgs);
        log(WHAMDA_DELIMITER);

        log('replacing property functions');
        minified = whamda(minified, PROP_SIG_REGEX, mapProp, mapNew, 0, generateNamedArgs);
        log(WHAMDA_DELIMITER);

        log('replacing anon function');
        minified = whamda(minified, ANON_SIG_REGEX, mapAnon);
        log(WHAMDA_DELIMITER);

        log('file complete');
        log(WHAMDA_DELIMITER);

        fs.writeFile(outputDirectory + '/' + file, minified, function(err) {
            if (err) {
                return log(err);
            }
        });
    });
    log(WHAMDA_LOG_PREFIX + 'finished in ', (Date.now() - timeStart) / 1000 + 'ms');
}

function whamda(input, regex, transform, newObjectTransform, signatureOffset, argsGenerator) {
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
    log('found ' + signatures.length + ' functions to replace');
    _.each(signatures, function(signature) {
        var index = buffer.indexOf(signature);
        var left = buffer.slice(0, index);
        var right = buffer.substring(index + signature.length, buffer.length);
        var end = scan(right, '{', '}', 1);
        var expression;
        if (end >= right.length) {
            //TODO: This branch is necessary because scan has failed us. 
            //Investigate why scan sometimes does not find the correct end.
            //Likely a regex issue.
            expression = signature + right.substring(0, right.lastIndexOf('}') + 1);
        } else {
            expression = signature + right.substring(0, end);
        }
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
    var proto = name + '.prototype=Function.apply(0).prototype,' + name;
    state.name = name;
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace('=function', '=');
    state.expression = state.expression.replace(FUNC_STR, LAMDA_STR);
    state.expression = state.expression.replace(LAMDA_STR, LAMDA_STR + argumentsObject);
    state.expression = state.expression + ',whamz=(' + proto + ')';
    state.proto = ',whamz=(' + state.name + '.prototype=Function.apply(0).prototype,' + state.name + ')';
    return state;
}

function mapNamed(state) {
    var name = state.expression.split('function')[1].split('(')[0].trim();
    var proto = name + '.prototype=Function.apply(0).prototype;';
    state.name = name;
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace('function', 'var');
    state.expression = state.expression.replace(state.args, '=' + state.args + '=>');
    state.expression = state.expression.replace(LAMDA_STR, LAMDA_STR + argumentsObject);
    state.expression = state.expression + ';' + proto;
    state.proto = ';' + state.name + '.prototype=Function.apply(0).prototype;';
    return state;
}

function mapScoped(state) {
    var name = state.expression.split('var')[1].split('=')[0].trim();
    var proto = name + '.prototype=Function.apply(0).prototype,' + name;
    state.name = name;
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace('function', '');
    state.expression = state.expression.replace(state.args, state.args + '=>');
    state.expression = state.expression.replace(LAMDA_STR, LAMDA_STR + argumentsObject);
    state.expression = state.expression + ',whamz=(' + proto + ')';
    state.proto = ',whamz=(' + state.name + '.prototype=Function.apply(0).prototype,' + state.name + ')';
    return state;
}

function mapProp(state) {
    var name = state.signature.split('=')[0];
    var proto = name + '.prototype=Function.apply(0).prototype,' + name;
    state.name = name;
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace('function', '');
    state.expression = state.expression.replace(state.args, state.args + '=>');
    state.expression = state.expression.replace(LAMDA_STR, LAMDA_STR + argumentsObject);
    state.expression = state.expression + ',whamz=(' + proto + ')';
    state.proto = ',whamz=(' + state.name + '.prototype=Function.apply(0).prototype,' + state.name + ')';
    return state;
}

function mapAnon(state) {
    var argumentsObject = generateArgumentsObject(state);
    state.expression = state.expression.replace(state.args, state.args + '=>');
    state.expression = state.expression.replace(LAMDA_STR, LAMDA_STR + argumentsObject);
    var left = '((obj)=>{obj.prototype = Function.apply(0).prototype;return obj;})(';
    state.expression = state.expression.replace('function', left);
    state.expression = state.expression + ')';
    return state;
}

function findAssignments(name, state, matches) {
    //TODO: Possibly rethink this, or break this regex out into multiple expressions.
    //It is bad , there are other symbols that need to be excluded.
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
    while ((capture = regex.exec(state.input))) {
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
    var matches = [];
    var expressionScope = findScope(state.input.indexOf(state.expression), state.input);
    for (var i = 0; i < collection.length; i++) {
        var reference = collection[i][0].split('=')[0];
        var regex = new RegExp('new ' + reference + '(?![.])', 'g');
        var capture;
        while ((capture = regex.exec(state.input))) {
            var isValid = isValidNewCapture(capture);
            var inString = isInString(capture);
            var invocationScope = findScope(capture.index, state.input);
            if (!inString && isValid) {
                if (expressionScope === invocationScope || expressionScope.indexOf(invocationScope) !== -1) {
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
    //TODO: This function is very problematic. For indices at the end of the file , the entire document prior, or after
    //may need to be scanned, one character at a time. For large files, this greatly adds to the total time
    //to process.
    var standard = /function[^\{]+\{/;
    var lamda = /\([^\)]*\)=>\{/;
    var pos = index;
    var next = '';
    var skip = 0;
    var start, end;
    var state = {
        standard: standard,
        lamda: lamda,
        pos: pos,
        next: next,
        skip: skip,
        start: start,
        end: end,
        input: input,
        index: index
    };
    state = manageScopeStart(state);
    state.next = '';
    state.skip = 0;
    state.pos = state.index;
    state = manageScopeEnd(state);
    return input.slice(state.start, state.end);
}

function manageScopeStart(state) {
    while (state.pos >= 0) {
        state.pos--;
        if (state.input[state.pos] === '}') {
            state.skip++;
        } else if (state.input[state.pos] === '{' && state.skip !== 0) {
            state.skip--;
        } else {
            state.next = state.input[state.pos] + state.next;
            if (state.standard.test(state.next) || state.lamda.test(state.next)) {
                state.start = state.pos;
                break;
            }
        }
    }
    return state;
}

function manageScopeEnd(state) {
    while (state.pos < state.input.length) {
        state.pos++;
        if (state.input[state.pos] === '{') {
            state.skip++;
        } else if (state.input[state.pos] === '}' && state.skip !== 0) {
            state.skip--;
        } else {
            state.next += state.input[state.pos];
            if (state.input[state.pos] === '}') {
                state.end = state.pos;
                break;
            }
        }
    }
    return state;
}

function isInString(capture) {
    //TODO: This function is very problematic. For indices at the end of the file , the entire document prior, or after
    //may need to be scanned, one character at a time. For large files, this greatly adds to the total time
    //to process.
    var singleQuotesOpen = false;
    var doubleQuotesOpen = false;
    var singleQuotesClosed = false;
    var doubleQuotesClosed = false;
    var regexOpen = false;
    var regexClosed = false;
    var pos = capture.index;
    var next;
    var state = {
        singleQuotesOpen: singleQuotesOpen,
        doubleQuotesOpen: doubleQuotesOpen,
        singleQuotesClosed: singleQuotesClosed,
        doubleQuotesClosed: doubleQuotesClosed,
        regexOpen: regexOpen,
        regexClosed: regexClosed,
        pos: pos,
        next: next,
        capture: capture
    };
    state = manageStringStart(state);
    pos = capture.index;
    state = manageStringEnd(state);
    return (state.singleQuotesOpen || state.doubleQuotesOpen) &&
        (state.singleQuotesClosed || state.doubleQuotesClosed) &&
        (state.regexOpen || state.regexClosed);
}

function manageStringStart(state) {
    while (state.pos >= 0) {
        state.next = state.capture.input[state.pos];
        if (state.next === '/' && !state.doubleQuotesOpen && !state.singleQuotesOpen) {
            state.regexOpen = !state.regexOpen;
        }
        if (state.next === '\'' && !state.doubleQuotesOpen && !state.regexOpen) {
            state.singleQuotesOpen = !state.singleQuotesOpen;
        }
        if (state.next === '"' && !state.singleQuotesOpen && !state.regexOpen) {
            state.doubleQuotesOpen = !state.doubleQuotesOpen;
        }
        state.pos--;
    }
    return state;
}

function manageStringEnd(state) {
    while (state.pos < state.capture.input.length) {
        state.next = state.capture.input[state.pos];
        if (state.next === '/' && !state.doubleQuotesClosed && !state.singleQuotesClosed) {
            state.regexClosed = !state.regexClosed;
        }
        if (state.next === '\'' && !state.doubleQuotesClosed && !state.regexClosed) {
            state.singleQuotesClosed = !state.singleQuotesClosed;
        }
        if (state.next === '"' && !state.singleQuotesClosed && !state.regexClosed) {
            state.doubleQuotesClosed = !state.doubleQuotesClosed;
        }
        state.pos++;
    }
    return state;
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

function mapNew(state) {
    state.expression = state.expression.slice(0, state.expression.indexOf(state.proto));
    var assignments = findAssignments(state.name, state);
    var invocations = findNewInvocations(assignments, state);
    for (var i = 0; i < invocations.length; i++) {
        var invocation = invocations[i];
        var invocationName = invocation[0].split('new ')[1];
        var args = '()';
        if (state.input[invocation.index + invocation[0].length] === '(') {
            var right = state.input.substring(invocation.index + invocation[0].length, state.input.length);
            var end = scan(right, '(', ')');
            args = right.substring(0, end - 1);
        }
        var pattern = ')=>{';
        var signature = state.expression.slice(
            0, state.expression.indexOf(
                pattern) +
            pattern.length);
        var lambda = buildLamda(
            invocationName, args, state
        );
        var inputLeft = state.input.slice(0, invocation.index);
        var argsLen = (args === '()') ? 0 : args.length;
        var inputRight = state.input.slice(invocation.index + invocation[0].length + argsLen, state.input.length);
        state.input = inputLeft + lambda + inputRight;
    }
    return state;
}

function buildLamda(name, args, state) {
    var signature = state.signature.replace('function', '');
    signature = signature.replace(FUNC_STR, LAMDA_STR);
    var signatureArgs = state.argsGenerator(signature);
    var pattern = '=>{';
    var body = state.expression.slice(state.expression.indexOf(pattern) + pattern.length, state.expression.length -
        1);
    body = body.replace('this', 'psuedoNew');
    var invocationArgs = args.slice(1, args.length - 1).split(',');
    invocationArgs.unshift(name);
    invocationArgs =
        invocationArgs.join(',');
    if (invocationArgs[invocationArgs.length - 1] === ',') {
        invocationArgs = invocationArgs.slice(0, invocationArgs.length - 1);
    }
    var lambda = '((' + signatureArgs + ')=>{var psuedoNew = Object.create(func.prototype);' + body +
        ';return psuedoNew;})(' + invocationArgs + ')';
    return lambda;
}

function generateNestedArgs(signature) {
    var signatureArgs = signature.split('=')[1];
    signatureArgs = signatureArgs.slice(1, signatureArgs.length - 1).split(',');
    signatureArgs.unshift('func');
    signatureArgs = signatureArgs.join(',');
    if (signatureArgs[signatureArgs.length - 1] === ',') {
        signatureArgs = signatureArgs.slice(0, signatureArgs.length - 1);
    }
    return signatureArgs;
}

function generateNamedArgs(signature) {
    var signatureArgs = signature.split(LAMDA_STR)[0];
    signatureArgs = signatureArgs.slice(signatureArgs.indexOf('(') + 1, signatureArgs.length).split(',');
    signatureArgs.unshift('func');
    signatureArgs = signatureArgs.join(',');
    if (signatureArgs[signatureArgs.length - 1] === ',') {
        signatureArgs = signatureArgs.slice(0, signatureArgs.length - 1);
    }
    return signatureArgs;
}

function isValidNewCapture(capture) {
    //TODO: This function really shouldnt be here. 
    //Another function needed because the intial regex has failed us.
    var sample = capture.input.slice(capture.index + capture[0].length, capture.index + capture[0].length + 1);
    var regex = /[A-Za-z0-9]/g;
    var isNotValid = regex.test(sample);
    return !isNotValid;
}