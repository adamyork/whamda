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
var SCOPED_SIG_REGEX = new RegExp('var[^!{]+function[\(]+[^!{]+', 'g'); // jshint ignore:line

var NAMED_FULL_REGEX = new RegExp('function [^{]+{[^!}]+}?', 'g');
var SCOPED_FULL_REGEX = new RegExp('var[^!{]+function[(]+[^!{]+[^!}]+}?', 'g'); // jshint ignore:line

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
                toplevel: true
            }
        }).code;

        result = replaceInline(result, NAMED_SIG_REGEX, NAMED_FULL_REGEX, '(', 'var ', '=', ';');
        result = replaceInline(result, SCOPED_SIG_REGEX, SCOPED_FULL_REGEX, '=', 'var ', '=', '');

        //console.log(result);

        result = replaceInlineClosure(result);

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

    _.each(signatures, function(signature, index) {
        var expression = expressions[index];
        var name = signature.split(nameSplitChar)[0].split(' ')[1] || '';
        var args = signature.split('(')[1].split(')')[0];
        var body = expression.substring(expression.indexOf('{') + 1, expression.lastIndexOf('}'));
        input = input.replace(expression, precedingChar + name + assignmentChar + '(' + args + ')=>{' + body + '}' +
            trailingChar);
    });
    return input;
}

function replaceInlineClosure(input) {
    var expressions = input.split('function');
    var signatureExpression = new RegExp('[\(][^!{]*[\)]{'); // jshint ignore:line
    console.log(expressions);
    expressions = _.map(expressions, function(expression) {
        var capture = signatureExpression.exec(expression);
        if (capture) {
            var args = signatureExpression.exec(expression)[0];
            args = args.substring(0, args.length - 1);
            expression = expression.replace(args, '(' + args + '=>');
            var closing = expression.lastIndexOf('}');
            return expression.slice(0, closing + 1) + ')' + expression.slice(closing + 1);
        }
        return expression;
    });
    return expressions.join('');
}