var util = require('util'),
    assert = require('assert'),
    PM_PRNG = require('../pm_prng'),
    log = util.log, inspect = util.inspect;

describe('PMPRNG', function(){

    it('should return the same series of numbers', function(){
        var rnd = PM_PRNG.create( 16 );
        var vals = [];
        
        for( var i=0;i<1000;i++ ){
            vals.push( rnd.nextInt() );
        }

        rnd = PM_PRNG.create( 16 );
        // var rnd2 = PM_PRNG.create( 17 );
        for( var i=0;i<1000;i++ ){
            assert.equal( vals[i], rnd.nextInt() );
            // assert.notEqual( vals[i], rnd2.nextInt() );
        }
    });

    it('should return an integer within a range', function(){
        var rnd = PM_PRNG.create( 42 );
        var val, min = Number.MAX_VALUE, max = Number.MIN_VALUE;

        for( var i=0;i<10000;i++ ){
            val = rnd.nextIntRange( 0, 1000 );
            min = Math.min( val, min );
            max = Math.max( val, max );
            assert( val >= 0 );
            assert( val <= 1000 );
        }

        assert.equal( min, 0 );
        assert.equal( max, 1000 );
    });

    it('should return a double within a range', function(){
        var rnd = PM_PRNG.create( 46 );
        var val, min = Number.MAX_VALUE, max = Number.MIN_VALUE;

        for( var i=0;i<10000;i++ ){
            val = rnd.nextDoubleRange( 1.3, 6.2 );
            min = Math.min( val, min );
            max = Math.max( val, max );
            assert( val >= 1.3 );
            assert( val <= 6.2 );
        }

        assert.equal( min.toFixed(3), 1.3 );
        assert.equal( max.toFixed(3), 6.2 );
    });

    /*
         from http://www.firstpr.com.au/dsp/rand31/#History-implementation
            
            Value           Number of results after seed of 1
            
             16807          1
         282475249          2
        1622650073          3
         984943658          4
        1144108930          5
         470211272          6
         101027544          7
        1457850878          8
        1458777923          9
        2007237709         10
        
         925166085       9998
        1484786315       9999
        1043618065      10000
        1589873406      10001
        2010798668      10002
        
        1227283347    1000000
        1808217256    2000000
        1140279430    3000000
         851767375    4000000
        1885818104    5000000
        
         168075678   99000000
        1209575029  100000000
         941596188  101000000

        1207672015 2147483643
        1475608308 2147483644
        1407677000 2147483645
        1          2147483646  <<< Starting the sequence again with the original seed.
        16807      2147483647
    */
    it('should produce expected results', function(){
        var rnd = PM_PRNG.create();
        var i = (1 << 31) - 1;
        var k = 0;

        //iterations/second (balanced for ~2,13 ghz pentium mobile)
        var j = 1e+6 * 4;
        var start = Date.now();

        while (i) {
            if (k >= 1 && k <= 10) {
                switch (k) {
                    case 1: 
                    assert.equal( rnd.seed, 16807); break;
                    
                    case 2:
                    assert.equal( rnd.seed, 282475249 ); break;
                    
                    case 3:
                    assert.equal( rnd.seed, 1622650073 ); break;
                    
                    case 4:
                    assert.equal( rnd.seed, 984943658 ); break;
                    
                    case 5:
                    assert.equal( rnd.seed, 1144108930 ); break;
                    
                    case 6:
                    assert.equal( rnd.seed, 470211272 ); break;
                    
                    case 7:
                    assert.equal( rnd.seed, 101027544 ); break;
                    
                    case 8:
                    assert.equal( rnd.seed, 1457850878 ); break;
                    
                    case 9:
                    assert.equal( rnd.seed, 1458777923 ); break;
                    
                    case 10:
                    assert.equal( rnd.seed, 2007237709 ); break;
                }
            }
            else if (k >= 9998 && k <= 10002) {
                switch (k) {
                    case 9998:
                    assert.equal( rnd.seed, 925166085 ); break;
                    
                    case 9999:
                    assert.equal( rnd.seed, 1484786315 ); break;
                    
                    case 10000:
                    assert.equal( rnd.seed, 1043618065 ); break;
                    
                    case 10001:
                    assert.equal( rnd.seed, 1589873406 ); break;
                    
                    case 10002:
                    assert.equal( rnd.seed, 2010798668 ); break;
                }
            }
            else
            if (k === 1000000) {
                assert.equal( rnd.seed, 1227283347 );
            }
            else
            if (k === 2000000) {
                assert.equal( rnd.seed, 1808217256 );
            }
            else
            if (k === 3000000) {
                assert.equal( rnd.seed, 1140279430 );
            }
            else
            if (k === 4000000) {
                assert.equal( rnd.seed, 851767375 );
            }
            else
            if (k === 5000000) {
                assert.equal( rnd.seed, 1885818104 );
            }
            else
            if (k === 99000000) {
                assert.equal( rnd.seed, 168075678 );
            }
            else
            if (k === 100000000) {
                assert.equal( rnd.seed, 1209575029 );
            }
            else
            if (k === 101000000) {
                assert.equal( rnd.seed, 941596188 );
            }
            else
            if (k === 2147483643) {
                assert.equal( rnd.seed, 1207672015 );
            }
            else
            if (k === 2147483644) {
                assert.equal( rnd.seed, 1475608308 );
            }
            else
            if (k === 2147483645) {
                assert.equal( rnd.seed, 1407677000 );
            }
            else
            if (k === 2147483646) {
                assert.equal( rnd.seed, 1 );
                
                // t.stop();
                log("total time " + ( (Date.now() - startTime) / 1000 / 60  ) +  " minutes.");
            }

            rnd.nextInt();
                
            k++;
            i--;
            j--;
                
            if (j === 0) break;
        }

        log( (Date.now()-start) + "ms, iteration " + k);
    });


});