# whamda
node module for javascript obfuscation. exploitation of the lambda, arrow functions in ECMA 6.

To use
- download whamda
- include whamda
- call whamda process([list-of-files,seperated-by-comma],'output-directory')

````javascript
var whamda = require('whamda.js');
whamda.process(['file1.js', 'file2.js', 'file3.js', 'file4.js'], 'output');
````

See the [example](../master/example) directory for a working sample and all of my test cases.


##What

Whamda is a node.js module that will replace traditional function references in a file with arrow functions.

````javascript
((obj) => {
    obj.prototype = Function.apply(0).prototype;
    return obj;
})(() => {
    var arguments = [];
    var o = (o, t) => {
        var arguments = [o, t];
        return e = !0, l = o && t, {}
    };
    o.prototype = Function.apply(0).prototype;
    var t = !1,
        n = () => {
            var arguments = [];
            t = !0
        },
        whamz = (n.prototype = Function.apply(0).prototype, n);
    n();
    var e = !1,
        l = !1,
        i = {};
    i.prop1 = i.prop2 = i.prop3 = o("hello", "world");
    var s = i && i.prop1 && i.prop2 && i.prop3 && t && e && l;
    console.log("IIFE style Function with internal Functions of various types", s)
})(this)
````
##How

The strategy is fairly primitive and rather brute force.It involves
- normalizing the input through the use of uglify.js
- evaluating the document as a string through the use of a series of regular expressions to capture functions
- string interpolation and concatentation to replace the contents of the capture with an arrow function equivalent
- write processed file to disk

##Why

There is absolutely no good reason to use whamda other than the novelity of seeing your code in pure arrow function form. Much like 
[garble](https://www.github.com/adamyork/garble "garble home"), the result of the whamda process of a source file , is often considerabley larger than the source. This is really because of one main reason, the guaranteed uniqueness of an arrow function. Simply, you cannot call *'new'* on an arrow function.

Because of this, extreme lengths to recursively search the documents to find new invocations of arrow functions, and replace them with yet... MORE ARROW FUNCTIONS. 

##When

I continue to sample popular javascript libraries for testing, and by no means is anything here *'production ready'*. I have whamda'd several popular javascript libraries and have included working examples of each in the examples directory. However, there are many that cause issues. Namely the largest of the libraries , angular , jquery , etc. I am not entirely certain the reasons, however creating test cases to work through the bugs has proved too time intensive.

At some point I will publish this to npm, but for now you will need to grab the library from here.

There are a handful of less than optimal functions in whamda, mostly dealing with scope and context matches , that leverage while loops and are recursively called. In very large documents with lots of 'new' function invocations, the computation time is exponential , ever growing<sup>growing</sup> with the size of the file.

If you have any suggestions for improvements , I would love to hear them.

HAVE FUN WHAMDA STYLE !