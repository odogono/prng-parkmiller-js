/**
 * A utility class for converting a color value into different components.
 *
 * This class is licensed under Creative Commons Attribution 3.0 License:  
 * http://creativecommons.org/licenses/by/3.0/
 * Essentially you are free to use this class in any way you want, but anywhere
 * you list credits for a work which uses this class you need to also acknowledge
 * this classes author.
 *
 * @author Noel Billig (http://www.dncompute.com)
 * @author Alexander Veenendaal (http://opendoorgonorth.com/)
 */
(function (definition) {

    // RequireJS/CommonJS/<script> adapter taken from https://raw.github.com/kriskowal/q/master/q.js by Kris Kowal
    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the ColourValue API and when
    // executed as a simple <script>, it creates a ColourValue global instead.

    // RequireJS
    if (typeof define === "function") {
        define(definition);

    // CommonJS
    } else if (typeof exports === "object") {
        definition(void 0, exports);

    // <script>
    } else {
        definition(void 0, ColourValue = {});
    }

})(function (require, exports) {

/**
 *  @return a generic object with the following values:
 *      h:Number - a number from 0 to 360 representing the hue of the color
 *      s:Number - a number from 0 to 1 representing the saturation
 *      v:Number - a number from 0 to 1 representing the "value" (brightness) of the color
 */
exports.RGBToHSV = function(r, g, b) {
    var max = Math.max(r, g);
    max = Math.max(max,b);
    
    var min = Math.min(r, g);
    min = Math.min(min,b);
    
    var h;
    var s = (max !== 0 ? (max - min) / max : 0);      
    var v = max / 255;

    if (s == 0) {
        
        h = null;
        
    } else {
        
        var delta = max - min;
        
        if (r == max) {
            h = (g-b) / delta;
        } else if (g == max) {
            h = 2 + (b-r)/delta;
        } else if (b == max) {
            h = 4.0 + (r-g)/delta;
        }
        
        h *= 60;
        
        if (h < 0) {
            h += 360;
        }
    }

    return {
        h:h, 
        s:s, 
        v:v
    };
}
    
    
exports.HSVToRGB = function(h, s, v) {
    var result = exports.create();
    
    if (s === 0) {
        if (!h) {
            result.r = v;
            result.g = v;
            result.b = v;
            return result;
        } else {
            return null; // error
        }
    } else {
        
        if (h == 360) {
            h = 0;
        }
        h /= 60;
        
        var i = Math.floor(h);
        var f = h - i;
        var p = v * (1 - s);
        var q = v * (1 - (s*f));
        var t = v * (1 - (s * (1-f)));
        var temp = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i];
        
        return {
            r: temp[0],
            g: temp[1],
            b: temp[2]
        };
    }
}

var ColourValue = function(){
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 255;
}
    

    
ColourValue.prototype.invert = function() {
    this.r = 255-this.r;
    this.g = 255-this.g;
    this.b = 255-this.b;
}
 
    
ColourValue.prototype.setHex = function(hexStr){
    var val = parseInt(hexStr,16);
    this.setRGB( val );
}

ColourValue.prototype.getHex = function() {
    return this.toInteger().toString(16);
}
    

ColourValue.prototype.setRGB = function(r,g,b,a) {
    // TODO : complete alpha processing
    if( typeof g === 'undefined' && typeof b === 'undefined' ){
        this.r = (r>>16);
        this.g = (r >> 8 ^ this.r << 8);
        this.b = (r ^ (this.r << 16 | this.g << 8));
    } else {
        this.r = Math.max(0,Math.min(r,255));
        this.g = Math.max(0,Math.min(g,255));
        this.b = Math.max(0,Math.min(b,255));
    }
    if( typeof a !== 'undefined' ){
        this.a = a;
    }
};  

ColourValue.prototype.clone = function(){
    return exports.create( this.r, this.g, this.b );
}
ColourValue.prototype.toInteger = function(){
    // TODO : complete alpha processing
    return (this.r<<16 | this.g<<8 | this.b);
}

ColourValue.prototype.toString = function(){
    var result = Number( this.toInteger() ).toString(16).toUpperCase();
    while (result.length < 6) {
        result = "0" + result;
    }
    return '#' + result;
}

/**
*  h:Number - A number from 0 t 360
*  s:Number - a number from 0 to 1
*  v:Number - a number from 0 to 1
*/
ColourValue.prototype.setHSV = function(r,g,b) {
    var rgb = exports.HSVToRGB( h,s,b );
    this.setRGB( rgb.r, rgb.g, rgb.b );
}

/**
 *  Returns a generic object with the following values:
 *  h:Number - a number from 0 to 360 representing the hue of the color
 *  s:Number - a number from 0 to 1 representing the saturation
 *  v:Number - a number from 0 to 1 representing the "value" (brightness) of the color
 */
ColourValue.prototype.toHSV = function(){
    return exports.RGBToHSV( this.r, this.g, this.b );
}

exports.create = function(r,g,b,a){
    var result = new ColourValue();
    result.setRGB(r,g,b,a);
    return result;
}

    
});