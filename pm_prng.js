/**
 * Implementation of the Park Miller (1988) "minimal standard" linear 
 * congruential pseudo-random number generator.
 * 
 * For a full explanation visit: http://www.firstpr.com.au/dsp/rand31/
 * 
 * The generator uses a modulus constant (m) of 2^31 - 1 which is a
 * Mersenne Prime number and a full-period-multiplier of 16807.
 * Output is a 31 bit unsigned integer. The range of values output is
 * 1 to 2,147,483,646 (2^31-1) and the seed must be in this range too.
 * 
 * David G. Carta's optimisation which needs only 32 bit integer math,
 * and no division is actually *slower* in flash (both AS2 & AS3) so
 * it's better to use the double-precision floating point version.
 * 
 * @author Michael Baczynski, www.polygonal.de
 * @author Alexander Veenendaal, opendoorgonorth.com
 */
(function (definition) {

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the PM_PRNG API and when
    // executed as a simple <script>, it creates a PM_PRNG global instead.

    // RequireJS
    if (typeof define === "function") {
        define(definition);

    // CommonJS
    } else if (typeof exports === "object") {
        definition(void 0, exports);

    // <script>
    } else {
        definition(void 0, PM_PRNG = {});
    }

})(function (require, exports) {

var PM_PRNG = function(){
    this.seed = 1;
}

/**
 * provides the next pseudorandom number
 * as an unsigned integer (31 bits)
 */
PM_PRNG.prototype.nextInt = function(){
    return this.gen();
}

/**
 * provides the next pseudorandom number
 * as a float between nearly 0 and nearly 1.0.
 */
PM_PRNG.prototype.nextDouble = function() {
    return (this.gen() / 2147483647);
}

/**
 * provides the next pseudorandom number
 * as a boolean
*/
PM_PRNG.prototype.nextBoolean = function(){
    return (this.gen() % 2) === 0;
}

/**
 * provides the next pseudorandom number
 * as an unsigned integer (31 bits) betweeen
 * a given range.
 */
PM_PRNG.prototype.nextIntRange = function(min, max){
    // min -= .4999;
    // max += .4999;
    return Math.round(min + ((max - min) * this.nextDouble()));
}

/**
 * provides the next pseudorandom number
 * as a float between a given range.
 */
PM_PRNG.prototype.nextDoubleRange = function(min, max){
    return min + ((max - min) * this.nextDouble());
}

PM_PRNG.prototype.gen = function(){
    //integer version 1, for max int 2^46 - 1 or larger.
    return this.seed = (this.seed * 16807) % 2147483647;

    /**
     * integer version 2, for max int 2^31 - 1 (slowest)
     */
    // var test = 16807 * (this.seed % 127773 >> 0) - 2836 * (this.seed / 127773 >> 0);
    // return this.seed = (test > 0 ? test : test + 2147483647);

    /**
     * david g. carta's optimisation is 15% slower than integer version 1
     */
    // var hi = 16807 * (this.seed >> 16);
    // var lo = 16807 * (this.seed & 0xFFFF) + ((hi & 0x7FFF) << 16) + (hi >> 15);
    // return this.seed = (lo > 0x7FFFFFFF ? lo - 0x7FFFFFFF : lo);
}


exports.create = function(seed){
    var result = new PM_PRNG();
    result.seed = (typeof seed === "undefined") ? 1 : seed;
    return result;
}

});