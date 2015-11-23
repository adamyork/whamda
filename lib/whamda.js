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
                topLevel: true
            }
        }).code;

        console.log('minified', result);

        result = whamda(result, NAMED_SIG_REGEX, mapNamed);
        result = whamda(result, SCOPED_SIG_REGEX, mapScoped);
        result = result.replace(/"/g, '\\"');
        result = result.replace(/'/g, '\\"');
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
    var useEscape = scaneLeftFor('"', expression, input);
    var quote = (useEscape) ? '\\#' : '"';
    console.log('input', input);
    console.log('use escape', useEscape);
    expression = expression.replace(args, args + '=>');
    console.log('arggggggs!', args);
    console.log('expression before', expression);
    var arr = args.split('(')[1].split(')')[0].split(',').reverse();
    expression = expression.replace('function', '(');
    expression = '],' + quote + expression + ')' + args + quote + ')';
    //console.log(arr);
    //console.log(arr.length);
    _.each(arr, function(argument, i) {
        if (argument !== '') {
            expression = (i === arr.length - 1) ? 'Object.keys({' + argument + ':null})[0]' + expression : ',' +
                'Object.keys({' + argument + ':null})[0]' +
                expression;
        }
    });
    expression = 'new Function([' + expression;
    console.log('expression after', expression);
    return expression;
}

function scaneLeftFor(chr, expression, input) {
    var start = input.indexOf(expression);
    console.log('start', start);
    var hasChr = false;
    var prev = 'as';
    for (var i = start; i >= 0; i--) {
        var curr = input[i];
        prev[1] = curr;
        console.log(prev);
        if (i === chr || prev === '\\"' + chr) {
            hasChr = true;
            break;
        }
        prev[0] = curr;
    }
    return hasChr;
}