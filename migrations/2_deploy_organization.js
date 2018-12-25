//this migration file is used only for testing purpose
var ERC827TokenMock = artifacts.require("./ERC827TokenMock.sol");
const GenesisProtocol = artifacts.require("./GenesisProtocol.sol");
var constants = require('../test/constants');

let accounts;
module.exports = async function(deployer) {
    await web3.eth.getAccounts(function(err,res) { accounts = res; });
    deployer.deploy(ERC827TokenMock,accounts[0],0).then(async function(){
      var stakingToken = await ERC827TokenMock.deployed();
      await deployer.deploy(GenesisProtocol,stakingToken.address,{gas: constants.GAS_LIMIT});
  });
};
