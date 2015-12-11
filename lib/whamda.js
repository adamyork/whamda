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

        log('safely wrapping closures\n' + WHAMDA_DELIMITER);
        minified = safelyWrap(minified);

        log('replacing named functions\n' + WHAMDA_DELIMITER);
        minified = whamda(minified, NAMED_SIG_REGEX, mapNamed, mapNewFromNamed);

        log('replacing scoped functions\n' + WHAMDA_DELIMITER);
        minified = whamda(minified, SCOPED_SIG_REGEX, mapScoped, mapNewFromScoped);

        log('replacing property functions\n' + WHAMDA_DELIMITER);
        minified = whamda(minified, PROP_SIG_REGEX, mapProp, mapNewFromScoped);

        log('replacing anon function\n' + WHAMDA_DELIMITER);
        minified = whamda(minified, ANON_SIG_REGEX, mapAnon);
        fs.writeFile(outputDirectory + '/' + file, minified, function(err) {
            if (err) {
                return log(err);
            }
        });
    });
}

function whamda(input, regex, transform, newObjectTransform) {
    var buffer = input;
    var signatures = [];
    var captures;
    while ((captures = regex.exec(buffer))) {
        signatures.push(captures[0]);
    }
    _.each(signatures, function(signature) {
        var index = buffer.indexOf(signature);
        var left = buffer.slice(0, index);
        var right = buffer.substring(index + signature.length, buffer.length);
        var end = scan(right, '{', '}');
        var expression = signature + right.substring(0, end);
        var state = getDefaultState(buffer, signature, expression, transform, newObjectTransform);
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

function getDefaultState(input, signature, expression, transform, newObjectTransform) {
    return {
        input: input,
        signature: signature,
        args: null,
        name: null,
        expression: expression,
        transform: transform,
        newObjectTransform: newObjectTransform
    };
}

function scan(input, open, close, quoteState) { //jshint ignore:line
    var i;
    var count = 1;
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
        return scan(input, open, close, quoteState);
    }
    return i + 1;
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

function mapNamed(state) {
    var name = state.expression.split('function')[1].split('(')[0];
    var proto = name + '.prototype=Function.prototype;';
    state.expression = state.expression.replace('function', 'var');
    state.expression = state.expression.replace(state.args, '=' + state.args + '=>');
    state.expression = state.expression + ';' + proto;
    state.name = name;
    return state;
}

function mapScoped(state) {
    var name = state.expression.split('var')[1].split('=')[0].trim();
    var proto = name + '.prototype=Function.prototype';
    state.expression = state.expression.replace('function', '');
    state.expression = state.expression.replace(state.args, state.args + '=>');
    state.expression = state.expression + ',whamz=(' + proto + ')';
    state.name = name;
    return state;
}

function mapProp(state) {
    var name = state.signature.split('=')[0];
    var proto = name + '.prototype=Function.prototype';
    state.expression = state.expression.replace('function', '');
    state.expression = state.expression.replace(state.args, state.args + '=>');
    state.expression = state.expression + ',whamz=(' + proto + ')';
    state.name = name;
    return state;
}

function mapAnon(state) {
    state.expression = state.expression.replace(state.args, state.args + '=>');
    var left = '((obj)=>{obj.prototype = Function.prototype;return obj;})(';
    state.expression = state.expression.replace('function', left);
    state.expression = state.expression + ')';
    return state;
}

function safelyWrap(input) {
    var CALL_REGEX = /(\}\.call)/g;
    var TERMINATOR_REGEX = /(\.call\(this.*?\),function)/g;
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
            if (match) {
                var offset = i + match[0].length - 'function'.length;
                input = input.substring(0, offset) + '(' + input.substring(offset, input.length);
                input = input.replace('}.call(', '}).call(');
                break;
            }
        }
    });
    return input;
}

function mapNewFromNamed(state) {
    //log('mapNewFromNamed', state.expression);
    //log('mapNewFromNamed name', state.name);
    var scope = getWithContainingScope(state);
    //log('containg scope ' + scope);
    state = manageNewReferences(state, scope);
    return state;
}

function mapNewFromScoped(state) {
    //log('mapNewFromScoped', state.expression);
    //log('mapNewFromScoped name', state.name);
    var scope = getWithContainingScope(state);
    //log('containg scope ' + scope);
    state = manageNewReferences(state, scope);
    return state;
}

function getWithContainingScope(state) {
    var index = state.input.indexOf(state.expression);
    var standard = /function[^\{]+\{/g;
    var lamda = /\([^\)]*\)=>/g;
    var scopeState = {
        input: state.input,
        skip: false,
        concatSub: false,
        standard: standard,
        lamda: lamda,
        substr: '',
        str: '',
        complete: false,
        match: ''
    };
    var i;
    for (i = index - 1; i >= 0; i--) {
        var chr = state.input[i];
        scopeState = manageScopeStateExpression(chr, i, scopeState);
        scopeState = manageScopeStateSubString(chr, i, scopeState);
        if (scopeState.complete) {
            break;
        }
    }
    var right = state.input.substring(i + scopeState.match.length, state.input.length);
    var end = scan(right, '{', '}');
    var enclosed = right.substring(0, end);
    var innerIndex = state.input.indexOf(enclosed);
    return state.input.substring(i, innerIndex + enclosed.length);
}

function manageScopeStateExpression(chr, index, state) {
    if (chr === '}') {
        state.skip = true;
    } else if (chr === '{' && state.skip) {
        if (state.input[index - 1] !== ')' && state.input[index - 1] !== '>') {
            state.skip = false;
        } else {
            state.concatSub = true;
        }
    }
    return state;
}

function manageScopeStateSubString(chr, index, state) {
    var matchStandard;
    var matchLambda;
    if (state.concatSub) {
        state.substr = chr + state.substr;
        matchStandard = state.standard.test(state.substr);
        matchLambda = state.lamda.test(state.substr);
        if (matchStandard || matchLambda) {
            state.substr = '';
            state.concatSub = false;
            state.skip = false;
        }
    } else if (!state.skip) {
        state.str = chr + state.str;
        var match;
        matchStandard = state.standard.test(state.str);
        matchLambda = state.lamda.test(state.str);
        if (matchStandard) {
            match = /function[^\{]+\{/.exec(state.str);
            state.complete = true;
            state.match = match[0];
        }
        if (matchLambda) {
            match = /\([^\)]*\)=>/.exec(state.str);
            state.complete = true;
            state.match = match[0];
        }
    }
    return state;
}

function manageNewReferences(state, scope) {
    log('manageNew for ', state.expression, state.name);
    var name = state.name.trim();
    var escaped = name.replace('.', '\\.');
    var regex = new RegExp('new ' + escaped + '[\(]+', 'g');
    var matches = [];
    var capture;
    while ((capture = regex.exec(state.input))) {
        matches.push(capture[0]);
    }
    log('matches', matches);
    _.each(matches, function(signature) {
        log('signature', signature);
        var index = state.input.indexOf(signature);
        var right = state.input.substring(index + signature.length, state.input.length);
        log('right', right);
        var invocation;
        if (right[0] === ';') {
            invocation = signature;
        } else {
            var end = scan(right, '(', ')');
            invocation = signature + right.substring(0, end);
        }
        log('invocation', invocation);
        log('expression', state.expression);
        var args = invocation.split('(')[1];
        if (args) {
            args = args.split(')')[0];
        } else {
            args = '';
        }
        var declaration = state.expression.replace('var ' + name + '=', '');
        var open = declaration.indexOf('{');
        var close = declaration.lastIndexOf('}');
        log('declaration', declaration);
        var decArgs = declaration.split('(')[1];
        if (decArgs === '') {
            decArgs = declaration.split('(')[2].split(')')[0].split(',');
        } else {
            decArgs = decArgs.split(')')[0].split(',');
        }
        log('decArgs first', decArgs);
        if (decArgs[0] === '') {
            decArgs.shift();
        }
        log('decArgs second', decArgs);
        var originalDecArgs = decArgs.join(',');
        var psuedoUniqueName;
        if (name.indexOf('.') !== -1) {
            psuedoUniqueName = name.replace(/\./g, '') + Math.round(Math.random() * 100000000);
        } else {
            psuedoUniqueName = name + Math.round(Math.random() * 100000000);
        }
        decArgs.push(psuedoUniqueName);
        log('originalDecArgs', originalDecArgs);
        log('decArgs', decArgs);
        var decArgsReplaced = decArgs.join(',');
        var decRight = declaration.substring(open + 1, close);
        log('decRight', decRight);
        decRight = decRight.replace(/this/g, 'psuedoNew');
        var instance = 'var psuedoNew = Object.create(' + psuedoUniqueName + '.prototype);';
        var rtrn = ';return psuedoNew;';
        var argsStr = (args === '') ? name : args + ',' + name;
        var replaced = '((' + decArgsReplaced + ')=>{' + instance + decRight + rtrn + '}' + ')(' + argsStr +
            ')';
        log('replaced', replaced);
        var replacedState = getDefaultState(state.input, signature, invocation);
        var replacedScope = getWithContainingScope(replacedState);
        log('scope', scope);
        log('replacedScope', replacedScope);
        if (replacedScope === scope) {
            state.input = state.input.replace(invocation, replaced);
        }
    });
    return state;
}