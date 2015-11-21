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

var NAMED_SIG_REGEX = new RegExp('function [^{]+{', 'g');
var SCOPED_SIG_REGEX = new RegExp('var[^!{|(]+function[\(]+[^!{]+', 'g'); // jshint ignore:line
var ANON_SIG_REGEX = new RegExp('[\(][^!{]*[\)]{|function[\(][^!{]*[\)]{'); // jshint ignore:line

var NAMED_FULL_REGEX = new RegExp('function [^{]+{[^!}]*}?', 'g');
var SCOPED_FULL_REGEX = new RegExp('var[^!{|(]+function[(]+[^!{]+[^!}]+}?', 'g'); // jshint ignore:line

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
                toplevel: false
            }
        }).code;

        console.log('minified: ', result);
        console.log('processing named__________________________________________________________');
        result = replaceInline(result, NAMED_SIG_REGEX, NAMED_FULL_REGEX, '(', 'var ', '=', ';');
        console.log('processing scoped__________________________________________________________');
        //result = replaceInline(result, SCOPED_SIG_REGEX, SCOPED_FULL_REGEX, '=', 'var ', '=', '');
        console.log('processing closure__________________________________________________________');
        //result = replaceInlineClosure(result);

        fs.writeFile(outputDirectory + '/' + file, result, function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

function replaceInline(input, singatureRegex, fullRegex, nameSplitChar, precedingChar, assignmentChar, trailingChar) {
    var signatureCaptures;
    var expressionCaptures;

    var signatures = [];
    var expressions = [];

    while ((signatureCaptures = singatureRegex.exec(input))) {
        signatures.push(signatureCaptures[0]);
    }
    while ((expressionCaptures = fullRegex.exec(input))) {
        expressions.push(expressionCaptures[0]);
    }

    console.log('signatures: ', signatures);
    console.log('expressions: ', expressions);

    _.each(signatures, function(signature, index) {
        var expression = expressions[index];
        console.log('signature', signature);
        console.log('expression', expression);
        var name = signature.split(nameSplitChar)[0].split(' ')[1] || '';
        var args = signature.split('(')[1].split(')')[0];
        expression = normalizeExpression(input, signature, expression);
        var body = expression.substring(expression.indexOf('{') + 1, expression.lastIndexOf('}'));
        console.log('body', body);
        input = input.replace(expression, precedingChar + name + assignmentChar + '(' + args + ')=>{' + body +
            '}' +
            trailingChar);
    });
    return input;
}

function replaceInlineClosure(input) {
    var expressions = input.split('function');
    console.log('allexpressions', expressions);
    expressions = _.map(expressions, function(expression) {
        console.log('+++++processing expression', expression);
        var capture = ANON_SIG_REGEX.exec(expression);
        if (capture) {
            console.log('signautre detected: ', capture);
            var signature = capture[0];
            var args = signature.substring(0, signature.length - 1);
            console.log('args', args);
            var arrowSignature = '(' + args + '=>';
            expression = expression.replace(args, arrowSignature);
            console.log('assigned arguments', expression);
            var sub = expression.substring(expression.indexOf(arrowSignature + '{') + arrowSignature.length + 1,
                expression.length);
            console.log('the sub', sub);
            var end = findExpressionEnd(sub, '{', '}');
            console.log(end);
            var left = expression.slice(0, (expression.length - sub.length) + end);
            console.log('left', left);
            var right = expression.slice((expression.length - sub.length) + end, expression.length);
            console.log('right', right);
            var concat = left + ')' + right;
            console.log('concat', concat);
            // var closingExpRegex = new RegExp('(}\\()', 'g');
            // var closingParenRegex = new RegExp('(}\\))', 'g');
            // var expCapture = closingExpRegex.exec(expression);
            // var parenCapture = closingParenRegex.exec(expression);
            // var closing;
            // if (expCapture) {
            //     //console.log('branch1');
            //     closing = expCapture.index;
            // } else if (parenCapture) {
            //     //console.log('branch2');
            //     closing = parenCapture.index;
            // } else {
            //     //console.log('branch3');
            //     closing = expression.lastIndexOf('}');
            // }
            // var sub = expression.slice(0, closing + 1) + ')' + expression.slice(closing + 1);
            // //console.log('with closing paren added', sub);
            return concat;
        } else {
            return expression;
        }
    });

    return expressions.join('');
}

function normalizeExpression(input, signature, expression) {
    if (!expression) {
        expression = signature + '}';
    }
    if (expression === signature) {
        var sub = input.substring(input.indexOf(expression) + expression.length, input.length);
        var end = findExpressionEnd(sub, '{', '}');
        //console.log('sub', sub);
        //console.log('after scan', expression);
        //console.log('input', input.indexOf(expression));
        expression = input.substring(input.indexOf(expression), input.indexOf(expression) + end + expression.length);
        //console.log('after scan +1', expression);
    }
    return expression;
}

function findExpressionEnd(input, open, close) {
    var openParens = 1;
    var i;
    for (i = 0; i < input.length; i++) {
        var next = input[i];
        if (next === open) {
            openParens++;
        } else if (next === close) {
            openParens--;
        }
        if (openParens === 0) {
            break;
        }
    }
    console.log('found i', i);
    return i + 1;
}