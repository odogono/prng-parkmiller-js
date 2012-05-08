/**
 *
 * This class is licensed under Creative Commons Attribution 3.0 License:  
 * http://creativecommons.org/licenses/by/3.0/
 * Essentially you are free to use this class in any way you want, but anywhere
 * you list credits for a work which uses this class you need to also acknowledge
 * this classes author.
 *
 * @author Noel Billig (http://www.dncompute.com)
 * @author Alexander Veenendaal (http://opendoorgonorth.com/)
 *
 * Based on http://www.dncompute.com/blog/2007/03/19/seed-based-pseudorandom-number-generator-in-actionscript.html
 */ 
(function (definition) {

    // RequireJS/CommonJS/<script> adapter taken from https://raw.github.com/kriskowal/q/master/q.js by Kris Kowal
    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the RandomSquiggle API and when
    // executed as a simple <script>, it creates a RandomSquiggle global instead.

    // RequireJS
    if (typeof define === "function") {
        define(definition);

    // CommonJS
    } else if (typeof exports === "object") {
        definition(void 0, exports);

    // <script>
    } else {
        definition(void 0, RandomSquiggle = {});
    }

})(function (require, exports) {



var RandomSquiggle = function(){
};


RandomSquiggle.prototype.generate = function(seed){
    if( typeof seed !== "undefined" ){
        random.seed = seed;
    }
    
    this.context.fillStyle = '#FFFFFF';
    this.context.fillRect( 0,0, this.width, this.height );

    this.margin = 50;

    //The turtle represents the tip of our drawing pen
    this.turtle = {
        x:this.width/2,  //X,Y is the turtle position
        y:this.height/2,
        theta:0,    //Theta,radius is the turtle velocity in polar coordiantes
        radius:1,
        colour:ColourValue.create( random.nextInt() ),//randomColour(),
        alpha:50,
        thickness:1
    };

    this.context.lineWidth = 1;
    this.context.strokeStyle = this.turtle.colour.toString();
    
    this.colourRateChange = random.nextDoubleRange(0,10);

    
    //Theta range is essentially how fast the turtle turns
    this.thetaRange = this.random.nextIntRange(0,180);
    this.randomizeThetaRange = this.random.nextBoolean();
}



/**
 *  @param degrees Number in degrees
 *  @return Number in radians
 */
var degreesToRadians = function(degrees) {
  return (degrees / 180) * Math.PI;
}



/**
 *  @param radians Number in radians
 *  @return Number in degrees
 */
var radiansToDegrees = function(radians) {
  return (radians * 180) / Math.PI;
}


/**
 *  @param x Number
 *  @param y Number
 *  @return Object A vector with two properties, r and theta.
 */
 var cartesianToPolar = function(x,y) {
    var result = {}; 
    result.r = Math.sqrt( Math.pow(x,2)+Math.pow(y,2) );

    var theta = Math.atan2(y,x);
    result.theta = radiansToDegrees( theta );
    
    result.toString = function() { return "[Vector r="+result.r+" theta="+result.theta+"]"; };
    return result;
};



/**
 *  @param r Number Length of the vector
 *  @param theta Number The angle of the vector
 *  @return Object A vector with two properties, x and y.
 */
var polarToCartesian = function(r,theta) {
    var thetaInRadians = degreesToRadians(theta);
    
    var result = {};
    result.x = r*Math.cos( thetaInRadians );
    result.y = r*Math.sin( thetaInRadians );
    result.toString = function() { return "[Vector x="+result.x+" y="+result.y+"]"; };
    return result;
};


RandomSquiggle.prototype.draw = function(){
    
    var self = this,
        turtle = this.turtle,
        random = this.random,
        thetaRange = this.thetaRange,
        velocity,
        rgb, colourRateChange = this.colourRateChange;

    this.context.beginPath();
    this.context.moveTo(this.turtle.x,this.turtle.y);
    
    //Adjust Alpha
    turtle.alpha += random.nextDoubleRange(-10,7);
    turtle.alpha = Math.max( 5, Math.min( 100, turtle.alpha ) );
    
    //Adjust Thickness
    turtle.thickness += random.nextDoubleRange(-1,1);
    turtle.thickness = Math.max( 1, Math.min( turtle.thickness, 5 ));
    
    //Adjust Color
    rgb = turtle.colour.clone();

    rgb.r += random.nextDoubleRange(-this.colourRateChange,this.colourRateChange);
    rgb.g += random.nextDoubleRange(-this.colourRateChange,this.colourRateChange);
    rgb.b += random.nextDoubleRange(-this.colourRateChange,this.colourRateChange);
    turtle.colour.setRGB(rgb.r,rgb.g,rgb.b,turtle.alpha);
    
    //Change LineStyle
    this.context.lineWidth = turtle.thickness;
    this.context.strokeStyle = turtle.colour.toString();
    
    //Reposition Turtle
    if (this.randomizeThetaRange) thetaRange = random.nextDoubleRange(0,180);
    turtle.radius = random.nextIntRange(1,10);
    turtle.theta += random.nextIntRange(-thetaRange,thetaRange);
    velocity = polarToCartesian(turtle.radius,turtle.theta);
    turtle.x += velocity.x;
    turtle.y += velocity.y;
    
    this.context.lineTo( this.turtle.x, this.turtle.y );
    this.context.stroke();  
    
    //If we're out of bounds, redirect the turtle back towards the center
    if (
        (this.turtle.x > (this.width-this.margin)) ||
        (this.turtle.x < this.margin) ||
        (this.turtle.y > (this.height-this.margin)) ||
        (this.turtle.y < this.margin) 
        ) {
        directToCenter = cartesianToPolar(-turtle.x+(this.width/2),-turtle.y+(this.height/2));
        turtle.theta = directToCenter.theta;
    }
}


exports.create = function( canvas, random ){
    var result = new RandomSquiggle();
    result.context = canvas.getContext('2d');
    result.random = random;
    result.width = canvas.width;
    result.height = canvas.height;
    return result;
};

});