const helpers = require('./helpers');

var RealMathTester = artifacts.require("./RealMathTester.sol");
let realMathTester;
const REAL_FBITS = 40;
const testPower = async function(nom,den,exp){
  var result = await realMathTester.power(nom,den,exp);
  result = (result.shrn(REAL_FBITS)/1) + (result.maskn(REAL_FBITS)/Math.pow(2,REAL_FBITS));
  if (exp === 0) {
    assert.equal(result,1);
  } else {
    assert.equal(Math.pow(result,1/exp).toFixed(3),nom/den);
  }
};

const testFraction = async function(nom,den){
  var result = await realMathTester.fraction(nom,den);
  result = (result.shrn(REAL_FBITS)/1) + (result.maskn(REAL_FBITS)/Math.pow(2,REAL_FBITS));
  assert.equal(result.toFixed(2),nom/den);
};

contract('RealMath', function() {
    it("power", async () => {
        realMathTester = await RealMathTester.new();
        for (var i = 0; i < 176 ;i++){
          await testPower(1700,1000,i);
        }
        await testPower(2000,1000,128);
        await testPower(15000,1000,Math.floor(172/4));
        try {
          await testPower(2000,1000,177);
          assert(false, " 2 power 177 will overflow");
        } catch (error) {
          helpers.assertVMException(error);
        }
    });

    it("fraction", async () => {
        realMathTester = await RealMathTester.new();
        await testFraction(2000,1000);
        await testFraction(1700,1000);
        await testFraction(web3.utils.toWei('100000000', "ether"),1);
        await testFraction(web3.utils.toWei('100000000', "ether"),web3.utils.toWei('100000000', "ether"));
    });
});
