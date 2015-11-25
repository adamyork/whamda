/*!
 * whamda
 * Copyright(c) 2015 Adam York
 * MIT Licensed
//  */
function helloWorld() {
    console.log('hello world');
}
helloWorld();

function helloWorldArgue(likes, dislikes) {
    console.log('well i like', likes);
    console.log('well i dont like', dislikes);
}

var helloWorldImVar = function() {
    console.log('stuff');
};
helloWorldImVar();
var helloWorldMeToo = function(thing, differentThing) {
    console.log('more stuff');
};
var obj = {};
obj.functionOnObject = obj.aliasFunctionOnObject = function() {
    console.log('do a thing');
};
obj.functionOnObject();
(function(a, b, c) {
    console.log('applied closured');
}.call(this));
(function() {
    console.log('invoked closured');
})(this);
(function() {
    var insideAClosure = function() {
        console.log('im inside a closure');
    };
    insideAClosure();

    function createThing(likes, dislikes) {
        console.log('well i like', likes);
        console.log('well i dont like', dislikes);
    }
    var smog = {};
    smog.blah = smog.bleh = smog.yuck = createThing(-1);
})(this);

(function() {
    var tmp = {};

    function doSomething(arg) {
        console.log(arg);
    }
    tmp.something = doSomething(1);
}.call(this));
(function() {
    function noop() {}
    var tmp = {};
    tmp.reduce = noop(1);
}).call(this);

function testNoopWithAssignment(a, b) {
    var q = 2;
}

function testNoopWithAssignments(a, b) {
    var q = 2;
    console.log(2);
}

function testNested(a, b) {
    var q = 2;
    (function(s) {
        console.log(s);
    })('hi');
    var x = function() {
        console.log('other stuff');
    };
}
testNested();
(function() {
    function named() {
        console.log('named');
    }
    var q = named;
    named();
    q();
}.call(this));
(function() {
    var root = this;
    var previousUnderscore = root._;
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;
    var
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;
    var
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create;
    var Ctor = function() {};
    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }
}.call(this));
(function() {
    var y = this,
        x = (Array.isArray, function(a, b) {
            console.log(a + b);
            console.log('hello');
        });
    y.x = x;
}.call(this));

(function() {
    var a = this,
        b = (Array.isArray, function(a, b) {
            console.log(a + b);
            console.log('hello');
        });
    a.b = b;
}.call(this));

// (function(str) {
//     var _ = {};
//     var cb = function() {};
//     var predicate = function() {};
//     _.each = function() {};
//     _.filter = _.select = function(obj, predicate, context) {
//         var results = [];
//         predicate = cb(predicate, context);
//         _.each(obj, function(value, index, list) {
//             if (predicate(value, index, list)) results.push(value);
//         });
//         return results;
//     };
//     console.log(str);
// }.call(this, 'bleh'));