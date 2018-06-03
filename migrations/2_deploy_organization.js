//this migration file is used only for testing purpose
var constants = require('../test/constants');
var ERC827TokenMock = artifacts.require("./ERC827TokenMock.sol");
const GenesisProtocolLite = artifacts.require("./GenesisProtocolLite.sol");

//Deploy test organization with the following schemes:
//schemeRegistrar, upgradeScheme,globalConstraintRegistrar,simpleICO,contributionReward.
module.exports = async function(deployer) {
    deployer.deploy(ERC827TokenMock,0,0).then(async function(){
      var stakingToken = await ERC827TokenMock.deployed();
      await deployer.deploy(GenesisProtocolLite,stakingToken.address);
  })
};
