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

        //console.log(result);

        var signatureExpressions = new RegExp(
            'function [^{]+{|var[^]+function[\(][\)]|var[^]+function[\(][^!{]+', 'g');
        var fullExpressions = new RegExp(
            'function [^{]+{[^!}]+}?|var[^]+function[\(][\)][^!}]+}?|var[^]+function[\(][^!}]+}?', 'g');
        var signatureCaptures;
        var expressionCaptures;

        var signatures = [];
        var expressions = [];

        while ((signatureCaptures = signatureExpressions.exec(result))) {
            signatures.push(signatureCaptures[0]);
        }
        while ((expressionCaptures = fullExpressions.exec(result))) {
            expressions.push(expressionCaptures[0]);
        }

        console.log(signatures);
        console.log(expressions);

        _.each(signatures, function(signature, index) {
            var expression = expressions[index];
            var name = signature.split('(')[0].split(' ')[1];
            if (signature.indexOf('var') !== -1) {
                name = signature.split('=')[0].split(' ')[1];
            }
            var args = signature.split('(')[1].split(')')[0];
            if (!expression) {
                console.log('sig', signature);
            }
            var body = expression.substring(expression.indexOf('{') + 1, expression.lastIndexOf('}'));
            if (signature.indexOf('var') !== -1) {
                result = result.replace(expression, 'var ' + name + '=(' + args + ')=>{' + body + '}');
            } else {
                result = result.replace(expression, 'var ' + name + '=(' + args + ')=>{' + body + '};');
            }
        });

        fs.writeFile(outputDirectory + '/' + file, result, function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}