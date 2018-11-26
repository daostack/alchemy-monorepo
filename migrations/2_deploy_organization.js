//this migration file is used only for testing purpose
var ERC827TokenMock = artifacts.require("./ERC827TokenMock.sol");
const GenesisProtocol = artifacts.require("./GenesisProtocol.sol");
var constants = require('../test/constants');
const helpers = require('../test/helpers');

//Deploy test organization with the following schemes:
//schemeRegistrar, upgradeScheme,globalConstraintRegistrar,simpleICO,contributionReward.
module.exports = async function(deployer) {
    deployer.deploy(ERC827TokenMock,helpers.NULL_ADDRESS,0).then(async function(){
      var stakingToken = await ERC827TokenMock.deployed();
      await deployer.deploy(GenesisProtocol,stakingToken.address,{gas: constants.GAS_LIMIT});
  });
};
