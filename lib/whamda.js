/*!
 * whamda
 * Copyright(c) 2015 Adam York
 * MIT Licensed
 */

'use strict';

var fs = require('fs');
var _ = require('underscore-node');
var UglifyJS = require('uglify-js');

module.exports = create();

var NAMED_SIG_REGEX = /function [^\(]+\([^\)]*\){/g;
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
        var result = UglifyJS.minify(file, {
            mangle: {
                topLevel: true,
            }
        }).code;

        console.log('minified', result);

        result = safelyWrap(result);
        result = whamda(result, NAMED_SIG_REGEX, mapNamed);
        result = whamda(result, SCOPED_SIG_REGEX, mapScoped);
        result = whamda(result, ANON_SIG_REGEX, mapAnon);

        fs.writeFile(outputDirectory + '/' + file, result, function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

function whamda(input, regex, transform) {
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
        var rebuilt = rebuild(signature, expression, transform, input);
        input = input.replace(expression, rebuilt);
    });
    return input;
}

function scan(input, open, close) {
    var i;
    var count = 1;
    for (i = 0; i < input.length; i++) {
        var next = input[i];
        if (next === open) {
            count++;
        } else if (next === close) {
            count--;
        }
        if (count === 0) {
            break;
        }
    }
    return i + 1;
}

function rebuild(signature, expression, transform, input) {
    var args = '(' + signature.split('(')[1].split(')')[0] + ')';
    return transform(expression, args, input);
}

function mapNamed(expression, args) {
    var name = expression.split('function')[1].split('(')[0];
    var proto = name + '.prototype=Object.prototype;';
    expression = expression.replace('function', 'var');
    expression = expression.replace(args, '=' + args + '=>');
    return expression + ';' + proto;
}

function mapScoped(expression, args) {
    var name = expression.split('var')[1].split('=')[0].trim();
    var proto = name + '.prototype=Object.prototype';
    expression = expression.replace('function', '');
    expression = expression.replace(args, args + '=>');
    return expression + ',whamz=(' + proto + ')';
}

function mapAnon(expression, args, input) {
    expression = expression.replace(args, args + '=>');
    var left = '((obj)=>{obj.prototype = Function.prototype;return obj;})(';
    expression = expression.replace('function', left);
    return expression + ')';
}

function safelyWrap(input) {
    var CALL_REGEX = /(\}\.call)/g;
    var TERMINATOR_REGEX = /(\.call\(this.*?\),function)/g;
    var matches = [];
    var capture;
    while ((capture = CALL_REGEX.exec(input))) {
        matches.push(capture[0]);
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