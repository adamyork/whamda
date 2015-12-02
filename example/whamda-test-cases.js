/*!
 * whamda
 * Copyright(c) 2015 Adam York
 * MIT Licensed
//  */

// function addTestOutput(name, result) {
//     var table = document.getElementsByClassName('table-tests')[0];
//     console.log('table', table);
//     var row = table.insertRow(-1);
//     var nameCell = row.insertCell(-1);
//     var resultCell = row.insertCell(-1);
//     nameCell.innerHTML = name;
//     resultCell.innerHTML = (result) ? '<p style="color:green;text-align:center">&#10004;</p>' :
//         '<p style="color:red;text-align:center">&#10008;</p>';
// }

// function helloWorld() {
//     addTestOutput('Simple named Function', true);
// }
// helloWorld();

// function helloWorldArg(arg1, arg2) {
//     var result = (arg1 && arg2);
//     addTestOutput('Simple named Function with arguments', result);
// }
// helloWorldArg('hello', 'world');

// var helloWorldScoped = function() {
//     addTestOutput('Simple scoped Function', true);
// };
// helloWorldScoped();

// var helloWorldScopedArg = function(arg1, arg2) {
//     var result = (arg1 && arg2);
//     addTestOutput('Simple scoped Function with arguments', result);
// };
// helloWorldScopedArg('hello', 'world');

// var obj = {};
// obj.functionOnObject = obj.aliasFunctionOnObject = function() {
//     var result = (obj && obj.functionOnObject && obj.aliasFunctionOnObject);
//     addTestOutput('Scoped Function in assignment chain. Hoisted.', result);
// };
// obj.functionOnObject();

// (function() {
//     addTestOutput('IIFE style Function', this);
// })(this);

// (function(a, b, c) {
//     var result = (a && b && c);
//     addTestOutput('IIFE style Function with arguments', result);
// }.call(this, 'hellow', 'world', 'hello'));

// (function() {
//     var internalsCalled = false;
//     var internals = function() {
//         internalsCalled = true;
//     };
//     internals();
//     var hcreateCalled = false;
//     var argsPresent = false;

//     function hcreate(arg1, arg2) {
//         hcreateCalled = true;
//         argsPresent = (arg1 && arg2);
//         return {};
//     }
//     var tmp = {};
//     tmp.prop1 = tmp.prop2 = tmp.prop3 = hcreate('hello', 'world');
//     var result = (tmp && tmp.prop1 && tmp.prop2 && tmp.prop3 && internalsCalled && hcreateCalled && argsPresent);
//     addTestOutput('IIFE style Function with internal Functions of various types', result);
// })(this);

// (function() {
//     var tmp = {};
//     var called = false;
//     var argsPresent = false;

//     function helloWorldNamed(arg) {
//         argsPresent = !!arg;
//         called = true;
//         return {};
//     }
//     tmp.helloWorldNamed = helloWorldNamed(1);
//     var result = (tmp && tmp.helloWorldNamed && called && argsPresent);
//     addTestOutput('IIFE style Function with internal Functions of various types, called unsafely', result);
// }.call(this));

// function testNested(a, b) {
//     var q = 2;
//     var called1 = false;
//     var called2 = false;
//     var argsPresent = false;
//     (function(s) {
//         called1 = true;
//         argsPresent = (true && s === 'hello');
//     })('hello');
//     var x = function() {
//         called2 = true;
//     };
//     x();
//     var result = (q && q === 2 && called1 && called2 && argsPresent);
//     addTestOutput('Named function with Internal IIFE', result);
// }
// testNested();

// (function() {
//     var callCount = 0;

//     function named() {
//         callCount++;
//     }
//     var q = named;
//     named();
//     q();
//     var result = (named && q === named && callCount === 2);
//     addTestOutput('IFFE with internal ivocation and assignemnt', result);
// }.call(this));

// (function() {
//     var called = false;
//     var argsPresent = false;
//     var y = this,
//         x = (Array.isArray, function(a, b) {
//             called = true;
//             argsPresent = (a && b && a === 'hello' && b === 'world');
//         });
//     y.x = x;
//     y.x('hello', 'world');
//     var result = (y && x && typeof x === 'function' && y.x === x && called && argsPresent);
//     addTestOutput('IFFE with hoisted private members and Anonymous function assignment', result);
// }.call(this));

// (function() {
//     var called = false;
//     var argsPresent = false;
//     var z = /\\|'|\r/g;
//     var g = {};
//     g.anything = function(arg) {
//         called = true;
//         argsPresent = (arg && arg === 'hello');
//         arg.replace(function(match) {
//             match.slice(match, 0).replace(z, arg);
//         });
//     };
//     g.anything('hello');
//     var result = (z && g && g.anything && typeof g.anything === 'function' && called && argsPresent);
//     addTestOutput('IFFE with complex quotation. I.E. the regex is non terminating', result);
// }.call(this));

// (function() {
//     addTestOutput('IFFE immediately following complex quotation is parsed', true);
// }.call(this));
(function() {
    function HelloWorldType(msg, test) {
        this.msg = msg;
        console.log('hello world', this.msg);
    }

    HelloWorldType.prototype.prop1 = 'value1';

    var tmp = new HelloWorldType('hello world', 'hello');

    console.log(tmp);

    var named = function() {
        function HelloWorldType(msg) {
            this.msg = msg;
            console.log('hello world named', this.msg);
        }
        HelloWorldType.prototype.prop2 = 'value2';
        var tmp = new HelloWorldType('hello world', 'hello');
        console.log(tmp);
    };
    named();

    // var result = (HelloWorldType && HelloWorldType.prototype.prop1 === 'value1' && tmp && tmp.prop1 === 'value1' &&
    //     tmp.msg === 'hello world');
    // addTestOutput('Class contstruction , new instantiation replacement', result);

}.call(this));