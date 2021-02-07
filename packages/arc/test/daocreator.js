const helpers = require('./helpers');

const DAOToken = artifacts.require("./DAOToken.sol");
const Reputation = artifacts.require("./Reputation.sol");
const DaoCreator = artifacts.require("./DaoCreator.sol");
const Avatar = artifacts.require("./Avatar.sol");
const Controller = artifacts.require("./Controller.sol");
const ERC20Mock = artifacts.require('./test/ERC20Mock.sol');
const UniversalSchemeMock = artifacts.require('./test/UniversalSchemeMock.sol');
const ControllerCreator = artifacts.require("./ControllerCreator.sol");
const DAOTracker = artifacts.require("./DAOTracker.sol");

const zeroBytes32 = helpers.NULL_HASH;
var avatar,token,reputation,daoCreator,controllerCreator;
const setup = async function (accounts,founderToken,founderReputation,cap=0) {
  controllerCreator = await ControllerCreator.new();
  var daoTracker = await DAOTracker.new();
  daoCreator = await DaoCreator.new(controllerCreator.address,daoTracker.address);
  var tx = await daoCreator.forgeOrg("testOrg","TEST","TST",[accounts[0]],[founderToken],[founderReputation],cap);
  assert.equal(tx.logs.length, 1);
  assert.equal(tx.logs[0].event, "NewOrg");
  var avatarAddress = tx.logs[0].args._avatar;
  avatar = await Avatar.at(avatarAddress);
  var tokenAddress = await avatar.nativeToken();
  token = await DAOToken.at(tokenAddress);
  var reputationAddress = await avatar.nativeReputation();
  reputation = await Reputation.at(reputationAddress);
};

contract('DaoCreator', function(accounts) {

    it("forgeOrg check avatar", async function() {
        await setup(accounts,10,10);
        assert.equal(await avatar.orgName(),"testOrg");
    });

    it("forgeOrg check reputations and tokens to founders", async function() {
        await setup(accounts,10,10);
        var founderBalance = await token.balanceOf(accounts[0]);
        assert.equal(founderBalance,10);
        var founderReputation = await reputation.balanceOf(accounts[0]);
        assert.equal(founderReputation,10);
    });


    it("forgeOrg check transfer ownership", async function() {
        //check the forgeOrg transfer ownership to avatar ,reputation and token
        //to the controller contract
        var amountToMint = 10;
        await setup(accounts,amountToMint,amountToMint);
        var controllerAddress,controller;
        controllerAddress = await avatar.owner();
        controller = await Controller.at(controllerAddress);

        var controllerAvatarAddress = await controller.avatar();
        assert.equal(controllerAvatarAddress,avatar.address);
        var tokenAddress = await avatar.nativeToken();
        var token = await DAOToken.at(tokenAddress);
        controllerAddress = await token.owner();
        controller = await Controller.at(controllerAddress);
        var controllerTokenAddress = await controller.nativeToken();
        assert.equal(controllerTokenAddress,tokenAddress);

        var reputationAddress = await avatar.nativeReputation();
        var reputation = await Reputation.at(reputationAddress);
        controllerAddress = await reputation.owner();
        controller = await Controller.at(controllerAddress);
        var controllerReputationAddress = await controller.nativeReputation();
        assert.equal(controllerReputationAddress,reputationAddress);
    });

    it("setSchemes to none UniversalScheme", async function() {
        var amountToMint = 10;
        await setup(accounts,amountToMint,amountToMint);
        var tx = await daoCreator.setSchemes(avatar.address,[accounts[1]],[zeroBytes32],["0x0000000F"],"metaData");
        assert.equal(tx.logs.length, 1);
        assert.equal(tx.logs[0].event, "InitialSchemesSet");
        assert.equal(tx.logs[0].args._avatar, avatar.address);
      });

    it("setSchemes to UniversalScheme", async function() {
        var amountToMint = 10;
        await setup(accounts,amountToMint,amountToMint);
        var universalSchemeMock = await UniversalSchemeMock.new();
        var tx = await daoCreator.setSchemes(avatar.address,[universalSchemeMock.address],[zeroBytes32],["0x8000000F"],"metaData");
        assert.equal(tx.logs.length, 1);
        assert.equal(tx.logs[0].event, "InitialSchemesSet");
        assert.equal(tx.logs[0].args._avatar, avatar.address);
    });

    it("setSchemes from account that does not hold the lock", async function() {
        var amountToMint = 10;
        await setup(accounts,amountToMint,amountToMint);
        try {
         await daoCreator.setSchemes(avatar.address,[accounts[1]],[zeroBytes32],["0x0000000F"],"metaData",{ from: accounts[1]});
         assert(false,"should fail because accounts[1] does not hold the lock");
        }
        catch(ex){
          helpers.assertVMException(ex);
        }
    });

    it("setSchemes increase approval for scheme and register org in scheme", async function() {
        var amountToMint = 10;
        await setup(accounts,amountToMint,amountToMint);
        var standardTokenMock = await ERC20Mock.new(avatar.address, 100);
        var universalSchemeMock = await UniversalSchemeMock.new();
        var allowance = await standardTokenMock.allowance(avatar.address,universalSchemeMock.address);
        assert.equal(allowance,0);
        await daoCreator.setSchemes(avatar.address,[universalSchemeMock.address],[zeroBytes32],["0x8000000F"],"metaData");
        allowance = await standardTokenMock.allowance(avatar.address,universalSchemeMock.address);
        assert.equal(allowance,0);
    });

    it("setSchemes increase approval for scheme without fee", async function() {
        var amountToMint = 10;
        await setup(accounts,amountToMint,amountToMint);
        var standardTokenMock = await ERC20Mock.new(accounts[0], 100);
        var allowance = await standardTokenMock.allowance(avatar.address,accounts[1]);
        assert.equal(allowance,0);

        await daoCreator.setSchemes(avatar.address,[accounts[1]],[zeroBytes32],["0x0000000F"],"metaData");
        allowance = await standardTokenMock.allowance(avatar.address,accounts[1]);
        assert.equal(allowance,0);
    });

    it("setSchemes check register", async function() {
        var amountToMint = 10;
        var controllerAddress,controller;
        await setup(accounts,amountToMint,amountToMint);
        await daoCreator.setSchemes(avatar.address,[accounts[1]],[zeroBytes32],["0x0000000F"],"metaData");
        controllerAddress = await avatar.owner();
        controller = await Controller.at(controllerAddress);
        var isSchemeRegistered = await controller.isSchemeRegistered(accounts[1],avatar.address);
        assert.equal(isSchemeRegistered,true);
    });

    it("setSchemes check unregisterSelf", async function() {
        var amountToMint = 10;
        var controllerAddress,controller;
        await setup(accounts,amountToMint,amountToMint);
        controllerAddress = await avatar.owner();
        controller = await Controller.at(controllerAddress);
        var isSchemeRegistered = await controller.isSchemeRegistered(daoCreator.address,avatar.address);
        assert.equal(isSchemeRegistered,true);
        await daoCreator.setSchemes(avatar.address,[accounts[1]],[zeroBytes32],["0x0000000F"],"metaData");
        controllerAddress = await avatar.owner();
        controller = await Controller.at(controllerAddress);
        isSchemeRegistered = await controller.isSchemeRegistered(daoCreator.address,avatar.address);
        assert.equal(isSchemeRegistered,false);
    });

    it("setSchemes delete lock", async function() {
        var amountToMint = 10;
        await setup(accounts,amountToMint,amountToMint);
        await daoCreator.setSchemes(avatar.address,[accounts[1]],[zeroBytes32],["0x0000000F"],"metaData");
        try {
         await daoCreator.setSchemes(avatar.address,[accounts[1]],[zeroBytes32],["0x0000000F"],"metaData",{ from: accounts[1]});
         assert(false,"should fail because lock for account[0] suppose to be deleted by the first call");
        }
        catch(ex){
          helpers.assertVMException(ex);
        }
    });

    it("forgeOrg with different params length should revert", async function() {
       var amountToMint = 10;
       var controllerCreator = await ControllerCreator.new();
       var daoTracker = await DAOTracker.new();
       daoCreator = await DaoCreator.new(controllerCreator.address,daoTracker.address);
       try {
        await daoCreator.forgeOrg("testOrg","TEST","TST",[accounts[0]],[amountToMint],[],helpers.NULL_ADDRESS);
        assert(false,"should revert  because reputation array size is 0");
       }
       catch(ex){
         helpers.assertVMException(ex);
       }

       try {
        await daoCreator.forgeOrg("testOrg","TEST","TST",[accounts[0],helpers.NULL_ADDRESS],[amountToMint,amountToMint],[amountToMint,amountToMint],0);
        assert(false,"should revert  because account is 0");
       }
       catch(ex){
         helpers.assertVMException(ex);
       }
   });
    it("setSchemes to none UniversalScheme and addFounders", async function() {
        var amountToMint = 10;
        await setup(accounts,amountToMint,amountToMint);
        var foundersArray = [];
        var founderReputation = [];
        var founderToken = [];
        var i;
        var numberOfFounders = 60;
        for (i=0;i<numberOfFounders;i++) {
          foundersArray[i] = accounts[1];
          founderReputation[i] = 1;
          founderToken[i] = 1;

        }
        try {
              await daoCreator.addFounders(avatar.address,foundersArray,founderReputation,founderToken,{from:accounts[1]});
              assert(false,"should revert  because account is lock for account 0");
            }
            catch(ex){
              helpers.assertVMException(ex);
            }

        await daoCreator.addFounders(avatar.address,foundersArray,founderReputation,founderToken);
        var rep = await reputation.balanceOf(accounts[1]);
        assert.equal(rep.toNumber(),numberOfFounders);
        var founderBalance = await token.balanceOf(accounts[1]);
        assert.equal(founderBalance.toNumber(),numberOfFounders);
        var tx = await daoCreator.setSchemes(avatar.address,[accounts[1]],[zeroBytes32],["0x0000000F"],"metaData");
        assert.equal(tx.logs.length, 1);
        assert.equal(tx.logs[0].event, "InitialSchemesSet");
        assert.equal(tx.logs[0].args._avatar, avatar.address);
      });

});
