/*!
 * whamda
 * Copyright(c) 2015 Adam York
 * MIT Licensed
 */
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