/*!
 * whamda
 * Copyright(c) 2015 Adam York
 * MIT Licensed
 */

'use strict';

var fs = require('fs');
var _ = require('underscore-node');
var uglifyJs = require('uglify-js');

module.exports = create();

var NAMED_SIG_REGEX = /function [^\(\)]+\([^\)]*\){/g;
var SCOPED_SIG_REGEX = /var [^=\)]+[\s]*=[\s]*function\([^\)]*\)[\s]*{/g;
var ANON_SIG_REGEX = /function\([^\)]*\){/g;

function create() {
    return {
        process: process
    };
}

function process(list, outputDirectory) {
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }
    _.each(list, function(file) {
        var result;
        var options = {
            mangle: {
                topLevel: true,
            }
        };
        var minified;
        try {
            result = uglifyJs.minify(file, options);
            minified = result.code;
        } catch (err) {
            console.log('ERROR normalizing input : ' + file, err);
            return;
        }

        console.log('minified', minified);

        minified = safelyWrap(minified);
        minified = whamda(minified, NAMED_SIG_REGEX, mapNamed, mapNewFromNamed);
        minified = whamda(minified, SCOPED_SIG_REGEX, mapScoped, mapNewFromScoped);
        minified = whamda(minified, ANON_SIG_REGEX, mapAnon);

        fs.writeFile(outputDirectory + '/' + file, minified, function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

function whamda(input, regex, transform, newObjectTransform) {
    var signatures = [];
    var captures;
    while ((captures = regex.exec(input))) {
        signatures.push(captures[0]);
    }
    console.log('signatures', signatures);
    _.each(signatures, function(signature) {
        var index = input.indexOf(signature);
        var left = input.slice(0, index);
        var right = input.substring(index + signature.length, input.length);
        var end = scan(right, '{', '}');
        var expression = signature + right.substring(0, end);
        var state = {
            input: input,
            signature: signature,
            args: null,
            name: null,
            expression: expression,
            transform: transform,
            newObjectTransform: newObjectTransform
        };
        var rebuilt = rebuild(state);
        input = rebuilt.input;
        input = input.replace(expression, rebuilt.expression);
        rebuilt.input = input;
        input = handleObjectCreation(rebuilt).input;
    });
    return input;
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
        console.log('new object transform declared');
        return state.newObjectTransform(state);
    }
    return state;
}

function mapNamed(state) {
    var name = state.expression.split('function')[1].split('(')[0];
    console.log('map named for', state.expression);
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
    console.log('mapNewFromNamed', state.expression);
    console.log('mapNewFromNamed name', state.name);
    var scope = getContainingScope(state);
    return state;
}

function mapNewFromScoped(state) {
    console.log('mapNewFromScoped', state.expression);
    console.log('mapNewFromScoped name', state.name);
    return state;
}

function manageNewReferences(name, expression, input) {
    console.log('manageNew for ', expression);
    var regex = new RegExp('new' + name + '[(]*', 'g');
    var matches = [];
    var capture;
    while ((capture = regex.exec(input))) {
        matches.push(capture[0]);
    }
    _.each(matches, function(signature) {
        console.log('signature', signature);
        var index = input.indexOf(signature);
        var right = input.substring(index + signature.length, input.length);
        var end = scan(right, '(', ')');
        var invocation = signature + right.substring(0, end);
        console.log('invocation', invocation);
        console.log('expression', expression);
        var args = invocation.split('(')[1].split(')')[0];
        var declaration = expression.replace('var ' + name.trim() + '=', '');
        var open = declaration.indexOf('{');
        var close = declaration.lastIndexOf('}');
        var decLeft = declaration.substring(0, open);
        console.log('decLeft', decLeft);
        var decArgs = declaration.split('(')[1].split(')')[0].split(',');
        var originalDecArgs = decArgs.join(',');
        var psuedoUniqueName = name.trim() + Math.round(Math.random() * 100000000);
        decArgs.push(psuedoUniqueName);
        var decArgsReplaced = decArgs.join(',');
        decLeft = decLeft.replace(originalDecArgs, decArgsReplaced);
        var decRight = declaration.substring(open + 1, close);
        decRight = decRight.replace(/this/g, 'psuedoNew');
        var instance = 'var psuedoNew = Object.create(' + psuedoUniqueName + '.prototype);';
        var rtrn = ';return psuedoNew;';
        var replaced = '(' + decLeft + '{' + instance + decRight + rtrn + '}' + ')(' + args + ',' + name + ')';
        console.log('replaced', replaced);
        //input = input.replace(invocation, replaced);
    });
    return input;
}

function getContainingScope(state) {
    console.log('finding containing scope for', state.expression);
    var index = state.input.indexOf(state.expression);
    console.log('located at ', index);
    console.log(state.input);
}