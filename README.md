Implementation of the Park Miller (1988) "minimal standard" linear congruential pseudo-random number generator.

For a full explanation visit: http://www.firstpr.com.au/dsp/rand31/

The generator uses a modulus constant (m) of 2^31 - 1 which is a Mersenne Prime number and a full-period-multiplier of 16807.

Output is a 31 bit unsigned integer. The range of values output is 1 to 2,147,483,646 (2^31-1) and the seed must be in this range too.

Ported from actionscript original code by Michael Baczynski at http://lab.polygonal.de/?p=162