/*!
 * whamda
 * Copyright(c) 2015 Adam York
 * MIT Licensed
//  */
function addTestOutput(name, result) {
    var table = document.getElementsByClassName('table-tests')[0];
    var row = table.insertRow(-1);
    var nameCell = row.insertCell(-1);
    var resultCell = row.insertCell(-1);
    nameCell.innerHTML = name;
    resultCell.innerHTML = (result) ? '<p style="color:green;text-align:center">&#10004;</p>' :
        '<p style="color:red;text-align:center">&#10008;</p>';
}

function helloWorld() {
    addTestOutput('Simple named Function', true);
}
helloWorld();

function helloWorldArg(arg1, arg2) {
    var result = (arg1 && arg2);
    addTestOutput('Simple named Function with arguments', result);
}
helloWorldArg('hello', 'world');

var helloWorldScoped = function() {
    addTestOutput('Simple scoped Function', true);
};
helloWorldScoped();

var helloWorldScopedArg = function(arg1, arg2) {
    var result = (arg1 && arg2);
    addTestOutput('Simple scoped Function with arguments', result);
};
helloWorldScopedArg('hello', 'world');
var obj = {};
obj.functionOnObject = obj.aliasFunctionOnObject = function() {
    var result = (obj && obj.functionOnObject && obj.aliasFunctionOnObject);
    addTestOutput('Scoped Function in assignment chain. Hoisted.', result);
};
obj.functionOnObject();
(function() {
    addTestOutput('IIFE style Function', this);
})(this);

(function(a, b, c) {
    var result = (a && b && c);
    addTestOutput('IIFE style Function with arguments', result);
}.call(this, 'hellow', 'world', 'hello'));
(function() {
    var internalsCalled = false;
    var internals = function() {
        internalsCalled = true;
    };
    internals();
    var hcreateCalled = false;
    var argsPresent = false;

    function hcreate(arg1, arg2) {
        hcreateCalled = true;
        argsPresent = (arg1 && arg2);
        return {};
    }
    var tmp = {};
    tmp.prop1 = tmp.prop2 = tmp.prop3 = hcreate('hello', 'world');
    var result = (tmp && tmp.prop1 && tmp.prop2 && tmp.prop3 && internalsCalled && hcreateCalled && argsPresent);
    addTestOutput('IIFE style Function with internal Functions of various types', result);
})(this);

(function() {
    var tmp = {};
    var called = false;
    var argsPresent = false;

    function helloWorldNamed(arg) {
        argsPresent = !!arg;
        called = true;
        return {};
    }
    tmp.helloWorldNamed = helloWorldNamed(1);
    var result = (tmp && tmp.helloWorldNamed && called && argsPresent);
    addTestOutput('IIFE style Function with internal Functions of various types, called unsafely', result);
}.call(this));

function testNested(a, b) {
    var q = 2;
    var called1 = false;
    var called2 = false;
    var argsPresent = false;
    (function(s) {
        called1 = true;
        argsPresent = (true && s === 'hello');
    })('hello');
    var x = function() {
        called2 = true;
    };
    x();
    var result = (q && q === 2 && called1 && called2 && argsPresent);
    addTestOutput('Named function with Internal IIFE', result);
}
testNested();
(function() {
    var callCount = 0;

    function named() {
        callCount++;
    }
    var q = named;
    named();
    q();
    var result = (named && q === named && callCount === 2);
    addTestOutput('IFFE with internal ivocation and assignemnt', result);
}.call(this));
(function() {
    var called = false;
    var argsPresent = false;
    var y = this,
        x = (Array.isArray, function(a, b) {
            called = true;
            argsPresent = (a && b && a === 'hello' && b === 'world');
        });
    y.x = x;
    y.x('hello', 'world');
    var result = (y && x && typeof x === 'function' && y.x === x && called && argsPresent);
    addTestOutput('IFFE with hoisted private members and Anonymous function assignment', result);
}.call(this));
(function() {
    var called = false;
    var argsPresent = false;
    var z = /\\|'|\r/g;
    var g = {};
    g.anything = function(arg) {
        called = true;
        argsPresent = (arg && arg === 'hello');
        arg.replace(function(match) {
            match.slice(match, 0).replace(z, arg);
        });
    };
    g.anything('hello');
    var result = (z && g && g.anything && typeof g.anything === 'function' && called && argsPresent);
    addTestOutput('IFFE with complex quotation. I.E. the regex is non terminating', result);
}.call(this));
(function() {
    addTestOutput('IFFE immediately following complex quotation is parsed', true);
}.call(this));
(function() {
    function HelloWorldType(msg, test) {
        this.msg = msg;
    }
    HelloWorldType.prototype.prop1 = 'value1';
    var tmp = new HelloWorldType('hello world', 'hello');

    var named = function() {
        function HelloWorldType(msg) {
            this.msg = msg;
        }
        HelloWorldType.prototype.prop2 = 'value2';
        var tmp = new HelloWorldType('hello world');
    };
    named();

    var named2 = {};
    var type2Called = false;
    named2.HelloWorldType = function(msg, msg2, msg3) {
        type2Called = (msg2 === 'test2') ? true : false;
    };

    var tmp3 = new named2.HelloWorldType('test', 'test2', 'test3');

    function Custom() {}
    var named3 = function() {
        var s = new Custom; //jshint ignore:line
        return s;
    }.call(this);
    var result = (HelloWorldType && HelloWorldType.prototype.prop1 === 'value1' && tmp && tmp.prop1 ===
        'value1' &&
        tmp.msg === 'hello world' && type2Called && named3 instanceof Custom && !(tmp3 instanceof HelloWorldType)
    );
    addTestOutput('Class contstruction , new instantiation replacement', result);
}.call(this));
(function() {
    var called;

    function NamedFunctionClass(msg) {
        called = (msg === 'hello') ? true : false;
    }
    var T = NamedFunctionClass;
    var z = new T('hello');
    var called2;
    var Q = function() {
        called2 = true;
    };
    var G = Q;
    var F = G;
    var fWithArg = new F('anArgument');
    var P = F;
    //TODO: This should be replaced and are not
    //var pWithStringArg = new P('true');
    //var pWithBooleArg = new P(true);
    var y = new G('hworld');
    var result = (z instanceof T && T === NamedFunctionClass && called && called2);
    addTestOutput('Class contstruction , new instantiation by reference replacement', result);
}.call(this));
(function() {
    var _ = {};
    var hasAnArgumentsObject = false;
    _.scoped = function(arg1, arg2) {
        hasAnArgumentsObject = arguments !== null;
        console.log(arguments);
        return '';
    };
    var f = function() {};
    _.scoped(f, this);
    var result = (hasAnArgumentsObject);
    addTestOutput('Replaced functions have arguments object', result);
}.call(this));