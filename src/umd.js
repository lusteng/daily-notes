// umd规范： 兼容amd、commonJs、浏览器window绑定对象规范 
(function( root, window, document, factory, undefined) {
    if( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( function() {
            root.XXX = factory(window, document);
            return root.XXX;
        } );
    } else if( typeof exports === 'object' ) {
        // Node. Does not work with strict CommonJS.
        module.exports = factory(window, document);
    } else {
        // Browser globals.
        window.XXX = factory(window, document);
    }
}(this, window, document, function(window, document){
    'use strict';
    //do something
}));