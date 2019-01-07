const helpers = require('./helpers');

const AbsoluteVote = artifacts.require("./AbsoluteVote.sol");
const Reputation = artifacts.require("./Reputation.sol");
const AbsoluteVoteExecuteMock = artifacts.require("./AbsoluteVoteExecuteMock.sol");


let reputation, absoluteVote,reputationArray,absoluteVoteExecuteMock;

const setupAbsoluteVote = async function (accounts,voteOnBehalf=helpers.NULL_ADDRESS, precReq=50) {
  absoluteVote = await AbsoluteVote.new();
  // set up a reputation system
  reputation = await Reputation.new();
  reputationArray = [200, 100, 700 ];
  await reputation.mint(accounts[0], reputationArray[0]);
  await reputation.mint(accounts[1], reputationArray[1]);
  await reputation.mint(accounts[2], reputationArray[2]);

  // register some parameters
  await absoluteVote.setParameters(precReq, voteOnBehalf);
  absoluteVoteExecuteMock = await AbsoluteVoteExecuteMock.new(reputation.address,absoluteVote.address);

  return absoluteVote;
};

const checkProposalInfo = async function(proposalId, _proposalInfo) {
  let proposalInfo;
  proposalInfo = await absoluteVote.proposals(proposalId);
  // proposalInfo has the following structure
  // bytes32 organization;
  assert.equal(proposalInfo[0], _proposalInfo[0]);
  // bool opened; // voting opened flag
  assert.equal(proposalInfo[1], _proposalInfo[1]);
  // uint numOfChoices;
  assert.equal(proposalInfo[2], _proposalInfo[2]);
    // bytes32 paramsHash;
  assert.equal(proposalInfo[3], _proposalInfo[3]);
  // uint totalVotes;
  assert.equal(proposalInfo[4], _proposalInfo[4]);
  // - the mapping is simply not returned at all in the array

  assert.equal(proposalInfo[5], _proposalInfo[5]);
  assert.equal(proposalInfo[6], _proposalInfo[6]);
};

const checkVotesStatus = async function(proposalId, _votesStatus){
  return helpers.checkVotesStatus(proposalId, _votesStatus,absoluteVote);
};

const checkIsVotable = async function(proposalId, _votable){
  let votable;

  votable = await absoluteVote.isVotable(proposalId);
  assert.equal(votable, _votable);
};

const checkVoteInfo = async function(proposalId, voterAddress, _voteInfo) {
  let voteInfo;
  voteInfo = await absoluteVote.voteInfo(proposalId, voterAddress);
  // voteInfo has the following structure
  // int vote;
  assert.equal(voteInfo[0], _voteInfo[0]);
  // uint reputation;
  assert.equal(voteInfo[1], _voteInfo[1]);
};

const checkIsVotableWithAbsoluteVote = async function(proposalId, _votable,absoluteVote){
  let votable;

  votable = await absoluteVote.isVotable(proposalId);
  assert.equal(votable, _votable);
};

const checkVotesStatusWithAbsoluteVote = async function(proposalId, _votesStatus, absoluteVote){
  return helpers.checkVotesStatus(proposalId, _votesStatus,absoluteVote);
};

const checkProposalInfoWithAbsoluteVote = async function(proposalId, _proposalInfo, absoluteVote) {
  let proposalInfo;
  proposalInfo = await absoluteVote.proposals(proposalId);
  // proposalInfo has the following structure
  // address organization;
  assert.equal(proposalInfo[0], _proposalInfo[0]);
  // bool opened; // voting opened flag
  assert.equal(proposalInfo[1], _proposalInfo[1]);
  // address numOfChoices;
  assert.equal(proposalInfo[2], _proposalInfo[2]);
  // bytes32 paramsHash;
  assert.equal(proposalInfo[3], _proposalInfo[3]);
  // uint totalVotes;
  assert.equal(proposalInfo[4], _proposalInfo[4]);
  // - the mapping is simply not returned at all in the array

};

contract('AbsoluteVote', accounts => {

  it("Sanity checks", async()=> {
      absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

      // propose a vote
      const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);

      let tx = await absoluteVoteExecuteMock.propose(5, paramsHash,helpers.NULL_ADDRESS,accounts[0],helpers.NULL_ADDRESS);
      const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
      assert.isOk(proposalId);

      var organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);
      // no one has voted yet at this point
      await checkProposalInfo(proposalId, [
                                           organizationId,
                                           true,
                                           absoluteVoteExecuteMock.address,
                                           5,
                                          paramsHash,
                                          0
                                          ]);
      await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      await checkIsVotable(proposalId, true);

      // now lets vote Option 1 with a minority reputation
      await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);

      await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);
      await checkProposalInfo(proposalId, [
                                           organizationId,
                                           true,
                                           absoluteVoteExecuteMock.address,
                                           5,
                                           paramsHash,
                                           reputationArray[0],
                                           ]);
      await checkVotesStatus(proposalId, [0, reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0]);
      await checkIsVotable(proposalId, true);

      // another minority reputation (Option 0):
      await absoluteVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS, { from: accounts[1] });
      await checkVoteInfo(proposalId, accounts[1], [0, reputationArray[1]]);
      await checkProposalInfo(proposalId, [
                                           organizationId,
                                           true,
                                           absoluteVoteExecuteMock.address,
                                           5,
                                          paramsHash,
                                          (reputationArray[0] + reputationArray[1]),
                                           ]);
      await checkVotesStatus(proposalId, [reputationArray[1], reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0]);
      await checkIsVotable(proposalId, true);

      // the decisive vote is cast now and the proposal will be executed with option 5

      await absoluteVote.vote(proposalId, 5,0, helpers.NULL_ADDRESS,{from:accounts[2]});

      await checkVoteInfo(proposalId, accounts[2], [5, reputationArray[2]]);
      // Proposal should be empty (being deleted after execution)
      await checkProposalInfo(proposalId, [ helpers.NULL_HASH,false,helpers.NULL_ADDRESS, 0,helpers.NULL_HASH, 0]);
      await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      await checkIsVotable(proposalId, false);
  });

  it("log the NewProposal event on proposing new proposal", async function() {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);

    assert.equal(absoluteVoteExecuteMock.address,
                 await helpers.getOrganization(tx,absoluteVote,"NewProposal"));
  });
  it("should log the VoteProposal and CancelVoting events on voting and canceling the vote", async function() {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);

    let voteTX = await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);

    assert.equal(voteTX.logs.length, 2);
    assert.equal(voteTX.logs[0].event, "VoteProposal");
    assert.equal(voteTX.logs[0].args._proposalId, proposalId);
    assert.equal(voteTX.logs[0].args._voter, accounts[0]);
    assert.equal(voteTX.logs[0].args._vote, 1);
    assert.equal(voteTX.logs[0].args._reputation, reputationArray[0]);

    let cancelVoteTX = await absoluteVote.cancelVote(proposalId);
    assert.equal(cancelVoteTX.logs.length, 1);
    assert.equal(cancelVoteTX.logs[0].event, "CancelVoting");
    assert.equal(cancelVoteTX.logs[0].args._proposalId, proposalId);
    assert.equal(cancelVoteTX.logs[0].args._voter, accounts[0]);
  });

  it("should log the ExecuteProposal event", async function() {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);

    // now lets vote with a minority reputation
    await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);

    // another minority reputation:
    await absoluteVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS, { from: accounts[1] });

    // the decisive vote is cast now and the proposal will be executed
    tx = await absoluteVote.vote(proposalId, 4,0, helpers.NULL_ADDRESS, {from:accounts[2]});

    await absoluteVote.getPastEvents('ExecuteProposal', {
            fromBlock: tx.blockNumber,
            toBlock: 'latest'
        })
        .then(function(events){
            assert.equal(events[0].args._proposalId,proposalId);
            assert.equal(events[0].args._decision, 4);
        });
  });

  it("All options can be voted (0-9)", async function() {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(10, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);
    // Option 1
    await absoluteVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [0, reputationArray[0]]);
    await checkVotesStatus(proposalId, [reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    await checkIsVotable(proposalId,true);

    // Option 2
    await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0]);
    await checkIsVotable(proposalId,true);

    // Option 3
    await absoluteVote.vote(proposalId, 2,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [2, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, reputationArray[0], 0, 0, 0, 0, 0, 0, 0]);
    await checkIsVotable(proposalId,true);

    // Option 4
    await absoluteVote.vote(proposalId, 3,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [3, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, reputationArray[0], 0, 0, 0, 0, 0, 0]);
    await checkIsVotable(proposalId,true);

    // Option 5
    await absoluteVote.vote(proposalId, 4,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [4, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, reputationArray[0], 0, 0, 0, 0, 0]);
    await checkIsVotable(proposalId,true);

    // Option 6
    await absoluteVote.vote(proposalId, 5,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [5, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, reputationArray[0], 0, 0, 0, 0]);
    await checkIsVotable(proposalId,true);

    // Option 7
    await absoluteVote.vote(proposalId, 6,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [6, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, reputationArray[0], 0, 0, 0]);
    await checkIsVotable(proposalId,true);

    // Option 8
    await absoluteVote.vote(proposalId, 7,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [7, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, reputationArray[0], 0, 0]);
    await checkIsVotable(proposalId,true);

    // Option 9
    await absoluteVote.vote(proposalId, 8,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [8, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, reputationArray[0], 0]);
    await checkIsVotable(proposalId,true);

    // Option 10
    await absoluteVote.vote(proposalId, 9,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [9, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, reputationArray[0]]);
    await checkIsVotable(proposalId,true);
  });

  it("Double vote shouldn't double proposal's 'Option 2' count", async function() {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);

    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);


    // no one has voted yet at this point
    await checkProposalInfo(proposalId, [
                                         organizationId,
                                         true,
                                         absoluteVoteExecuteMock.address,
                                         6,
                                        paramsHash,
                                        0,
                                        ]);

    // Lets try to vote twice from the same address
    await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);
    await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);
    // Total 'Option 2' should be equal to the voter's reputation exactly, even though we voted twice
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0,reputationArray[0],0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it("Vote cancellation should revert proposal's counters", async function() {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);
    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);

    // no one has voted yet at this point
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);

    // Lets try to vote and then cancel our vote
    await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);
    await absoluteVote.cancelVote(proposalId);
    await checkVoteInfo(proposalId, accounts[0], [0, 0]);

    // Proposal's votes supposed to be zero again.
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });


  it("if the voter is not set as voteOnBehalf, he shouldn't be able to vote on the behalf of someone else", async function () {
    absoluteVote = await setupAbsoluteVote(accounts,accounts[5], 50);

    // propose a vote
    const paramsHash = await absoluteVote.getParametersHash( 50,accounts[5]);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);
    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);
    // no one has voted yet at this point
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);

    // Lets try to vote on the behalf of someone else
    try {
      await absoluteVote.vote(proposalId, 1,0, accounts[0], {from: accounts[1]});
      assert(false, "ownerVote was supposed to throw but didn't.");
    } catch(error) {
      helpers.assertVMException(error);
    }

    // The vote should not be counted
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);
    await absoluteVote.vote(proposalId, 1,0, accounts[0], {from: accounts[5]});
  });

  it("Non-existent parameters hash shouldn't work", async function() {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);
    var paramsHash;

    // propose a vote
    paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);

    paramsHash = await absoluteVote.getParametersHash( 51, helpers.NULL_ADDRESS);
    try {
      await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
      assert(false, "propose was supposed to throw but didn't.");
    } catch(error) {
      helpers.assertVMException(error);
    }

    paramsHash = await absoluteVote.getParametersHash( 52, helpers.NULL_ADDRESS);
    try {
      await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
      assert(false, "propose was supposed to throw but didn't.");
    } catch(error) {
      helpers.assertVMException(error);
    }

    paramsHash = await absoluteVote.getParametersHash( 50, accounts[1]);
    try {
      await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
      assert(false, "propose was supposed to throw but didn't.");
    } catch(error) {
      helpers.assertVMException(error);
    }
  });

  it("Invalid percentage required( < 0 || > 100) shouldn't work", async function() {
    try {
      absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 150);
      assert(false, "setParameters(we call it here: test/absolutevote.js:setupAbsoluteVote()) was supposed to throw but didn't.");
    } catch(error) {
      helpers.assertVMException(error);
    }

    try {
      absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, -50);
      assert(false, "setParameters(we call it here: test/absolutevote.js:setupAbsoluteVote()) was supposed to throw but didn't.");
    } catch(error) {
      helpers.assertVMException(error);
    }
  });

  it("Proposal voting or cancelling shouldn't be able after proposal has been executed", async function () {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);

    // After this voting the proposal should be executed
    await absoluteVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS, {from: accounts[2]});

    // Should not be able to cancel the vote because the proposal has been executed
    try {
        await absoluteVote.cancelVote(proposalId);
        assert(false, "cancelVote was supposed to throw but didn't.");
    } catch (error) {
        helpers.assertVMException(error);
    }

    // Should not be able to vote because the proposal has been executed
    try {
        await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS, { from: accounts[1] });
        assert(false, "vote was supposed to throw but didn't.");
    } catch (error) {
        helpers.assertVMException(error);
    }

  });

  it("the vote function should behave as expected", async function () {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);
    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);

    // no one has voted yet at this point
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);

    try {
      await absoluteVote.vote(proposalId, 3,0, helpers.NULL_ADDRESS, { from: accounts[3] });
      assert(false, 'Tried to create an absolute vote with 12 options - max is 10');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // everything should be 0
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // Let's try to change user voting choice. and also check that if it's the same choice, ignore.
    await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS, { from: accounts[1] });
    await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS, { from: accounts[1] });
    await absoluteVote.vote(proposalId, 2,0,helpers.NULL_ADDRESS, { from: accounts[1] });
    await absoluteVote.vote(proposalId, 2,0,helpers.NULL_ADDRESS, { from: accounts[1] });
    // Total 'Option 2' supposed to be 0, 'Option 3' supposed to be accounts[1] reputation.
    // everything should be 0
    await checkVotesStatus(proposalId, [0, 0, reputationArray[1], 0, 0, 0, 0, 0, 0, 0]);
  });

  describe("as _not_ proposal owner - vote for myself", async function () {

    it('vote "Option 1" then vote "Option 2" should register "Option 2"', async function () {
      absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

      // propose a vote
      const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
      let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
      const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
      assert.isOk(proposalId);
      const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);

      // no one has voted yet at this point
      await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);

      await absoluteVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS, { from: accounts[1] });

      await checkVotesStatus(proposalId, [reputationArray[1], 0, 0, 0, 0, 0, 0, 0, 0, 0]);

      await absoluteVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS, { from: accounts[1] });

      await checkVotesStatus(proposalId, [0, reputationArray[1], 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it('vote "Option 3" then vote "Option 4" should register "Option 4"', async function () {
      absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

      // propose a vote
      const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
      let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
      const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
      assert.isOk(proposalId);
      const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);


      // no one has voted yet at this point
      await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);

      await absoluteVote.vote(proposalId, 2,0,helpers.NULL_ADDRESS, { from: accounts[1] });

      await checkVotesStatus(proposalId, [0, 0, reputationArray[1], 0, 0, 0, 0, 0, 0, 0]);

      await absoluteVote.vote(proposalId, 3,0,helpers.NULL_ADDRESS, { from: accounts[1] });

      await checkVotesStatus(proposalId, [0, 0, 0, reputationArray[1], 0, 0, 0, 0, 0, 0]);
    });
  });

  it('cannot vote for another user', async function () {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a new proposal
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);
    await absoluteVote.vote(proposalId, 1,0, accounts[1], { from: accounts[2] });
    await checkVoteInfo(proposalId, accounts[2], [1, reputationArray[2]]);
    await checkVoteInfo(proposalId, accounts[0], [0, 0]);

  });

  it("Should behave sensibly without an executable [TODO] execution isn't implemented yet", async function () {

    // Initiate objects & give reputation
    const absoluteVote = await AbsoluteVote.new();
    const reputation = await Reputation.new();
    absoluteVoteExecuteMock =  await AbsoluteVoteExecuteMock.new(reputation.address,absoluteVote.address);
    reputationArray = [20, 10, 70];
    await reputation.mint(accounts[0], reputationArray[0]);
    await reputation.mint(accounts[1], reputationArray[1]);
    await reputation.mint(accounts[2], reputationArray[2]);

    // Send empty rep system to the absoluteVote contract
    await absoluteVote.setParameters(50, helpers.NULL_ADDRESS);
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address, helpers.NULL_ADDRESS,helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");

    // Minority vote - no execution - no exception
    tx = await absoluteVote.vote(proposalId, 5,0, helpers.NULL_ADDRESS,{ from: accounts[0] });
    // The decisive vote - execution should be initiate execution with an empty address
    // await absoluteVote.vote(proposalId, 5,0, { from: accounts[2] });
  });

  it('Proposal with wrong num of options', async function () {
    // 6 Option - no exception should be raised
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address, helpers.NULL_ADDRESS,helpers.NULL_ADDRESS);

    // 12 options - max is 10 - exception should be raised
    try {
      await absoluteVoteExecuteMock.propose(12, paramsHash, absoluteVoteExecuteMock.address, helpers.NULL_ADDRESS,helpers.NULL_ADDRESS);
      assert(false, 'Tried to create an absolute vote with 12 options - max is 10');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // -5 options - exception should be raised
    try {
      await absoluteVoteExecuteMock.propose(-5, paramsHash, absoluteVoteExecuteMock.address, helpers.NULL_ADDRESS,helpers.NULL_ADDRESS);
      assert(false, 'Tried to create an absolute vote with negative number of options');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // 0 options - exception should be raised
    try {
      await absoluteVoteExecuteMock.propose(0, paramsHash, absoluteVoteExecuteMock.address, helpers.NULL_ADDRESS,helpers.NULL_ADDRESS);
      assert(false, 'Tried to create an absolute vote with 0 number of options');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

  });

  it('Test voteWithSpecifiedAmounts - More reputation than I own, negative reputation, etc..', async function () {
    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a new proposal
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);

    // Vote with the reputation the I own - should work
    tx = await absoluteVote.vote(proposalId, 1, reputationArray[0] / 10,helpers.NULL_ADDRESS);

    var repVoted = await helpers.getValueFromLogs(tx, "_reputation");

    assert.equal(repVoted, reputationArray[0] / 10, 'Should vote with specified amount');
    // Vote with negative reputation - exception should be raised
    try {
      await absoluteVote.vote(proposalId, 1, -100,helpers.NULL_ADDRESS);
      assert(false, 'Vote with -100 reputation voting shouldn\'t work');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // Vote with more reputation that i own - exception should be raised
    try {
      await absoluteVote.vote(proposalId, 1, (reputationArray[0] + 1),helpers.NULL_ADDRESS);
      assert(false, 'Not enough reputation - voting shouldn\'t work');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // Vote with a very big number - exception should be raised
    let BigNumber = require('bignumber.js');
    let bigNum = ((new BigNumber(2)).toPower(254)).toString(10);

    try {
      await absoluteVote.vote(proposalId, 1, bigNum,helpers.NULL_ADDRESS);
      assert(false, 'Voting shouldn\'t work');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

  });

  it("Internal functions can not be called externally", async () => {

    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a new proposal
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);

    // Lets try to call internalVote function
    try {
      await absoluteVote.internalVote(proposalId, accounts[0], 1, reputationArray[0]);
      assert(false, 'Can\'t call internalVote');
    } catch (ex) {
      helpers.assertInternalFunctionException(ex);
    }

    await absoluteVote.vote(proposalId, 1,0, helpers.NULL_ADDRESS,{ from: accounts[0] });

    // Lets try to call cancelVoteInternal function
    try {
      await absoluteVote.cancelVoteInternal(proposalId, accounts[0]);
      assert(false, 'Can\'t call cancelVoteInternal');
    } catch (ex) {
      helpers.assertInternalFunctionException(ex);
    }
  });

  it("Try to send wrong proposal id to the voting/cancel functions", async () => {

    absoluteVote = await setupAbsoluteVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a new proposal
    const paramsHash = await absoluteVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,absoluteVote,"NewProposal");
    assert.isOk(proposalId);

    // Lets try to call vote with invalid proposal id
    try {
      await absoluteVote.vote(helpers.NULL_HASH, 1,0,helpers.NULL_ADDRESS, {from: accounts[0]});
      assert(false, 'Invalid proposal ID has been delivered');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // Lets try to call voteWithSpecifiedAmounts with invalid proposal id
    try {
      await absoluteVote.vote(helpers.NULL_HASH, 1, 1,helpers.NULL_ADDRESS);
      assert(false, 'Invalid proposal ID has been delivered');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // Lets try to call execute with invalid proposal id
    try {
      await absoluteVote.execute(helpers.NULL_HASH);
      assert(false, 'Invalid proposal ID has been delivered');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // Lets try to call cancel a vote with invalid proposal id
    try {
      await absoluteVote.cancelVote(helpers.NULL_HASH);
      assert(false, 'Invalid proposal ID has been delivered');
    } catch (ex) {
      helpers.assertVMException(ex);
    }
  });

  it('2 proposals, 1 Reputation system', async function () {

    // Initiate parameters
    //accounts = web3.eth.accounts;
    reputation = await Reputation.new();
    reputationArray = [20, 10, 70 ];
    await reputation.mint(accounts[0], reputationArray[0]);
    await reputation.mint(accounts[1], reputationArray[1]);
    await reputation.mint(accounts[2], reputationArray[2]);

    // proposal 1 - 6 choices - 30% - ownerVote disabled
    let absoluteVote1 = await AbsoluteVote.new();
    absoluteVoteExecuteMock = await AbsoluteVoteExecuteMock.new(reputation.address,absoluteVote1.address);
    await absoluteVote1.setParameters(30, helpers.NULL_ADDRESS);
    const paramsHash1 = await absoluteVote1.getParametersHash( 30, helpers.NULL_ADDRESS);
    let tx1 = await absoluteVoteExecuteMock.propose(6, paramsHash1, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId1 = await helpers.getProposalId(tx1,absoluteVote1,"NewProposal");

    assert.isOk(proposalId1);
    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);



    // proposal 2 - Yes/No - 50% - ownerVote enabled
    let absoluteVote2 = await AbsoluteVote.new();
    var absoluteVoteExecuteMock2 = await AbsoluteVoteExecuteMock.new(reputation.address,absoluteVote2.address);

    await absoluteVote2.setParameters( 50, helpers.NULL_ADDRESS);
    const paramsHash2 = await absoluteVote2.getParametersHash( 50, helpers.NULL_ADDRESS);
    let tx2 = await absoluteVoteExecuteMock2.propose(2, paramsHash2, absoluteVoteExecuteMock2.address,accounts[0],helpers.NULL_ADDRESS, { from: accounts[1] });

    const proposalId2 = await helpers.getProposalId(tx2,absoluteVote2,"NewProposal");
    const organization2Id = await web3.utils.soliditySha3(absoluteVoteExecuteMock2.address,helpers.NULL_ADDRESS);
    assert.isOk(proposalId2);

    // Lets check the proposals
    await checkProposalInfoWithAbsoluteVote(proposalId1, [organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash1, 0], absoluteVote1);
    await checkProposalInfoWithAbsoluteVote(proposalId2, [organization2Id,true,absoluteVoteExecuteMock2.address, 2, paramsHash2, 0], absoluteVote2);
    // Account 0 votes in both proposals, and on behalf of Account 1 - should get an exception for that
    await absoluteVote1.vote(proposalId1, 2, 2, helpers.NULL_ADDRESS);
    await absoluteVote2.vote(proposalId2, 0,0,helpers.NULL_ADDRESS);

    // Account 1 voting on both proposals
    await absoluteVote1.vote(proposalId1, 4,0,helpers.NULL_ADDRESS, { from: accounts[1] });
    // Made mistake and changed his vote
    await absoluteVote1.vote(proposalId1, 3,0,helpers.NULL_ADDRESS, { from: accounts[1] });
    await absoluteVote2.vote(proposalId2, 1,0,helpers.NULL_ADDRESS, { from: accounts[1] });

    await absoluteVote2.vote(proposalId2, 1,0, accounts[0], { from: accounts[0] });

    // Lets check the proposals status
    await checkVotesStatusWithAbsoluteVote(proposalId1, [0, 0, 2, reputationArray[1], 0, 0, 0, 0, 0, 0], absoluteVote1);
    await checkVotesStatusWithAbsoluteVote(proposalId2, [0, (reputationArray[0] + reputationArray[1]), 0, 0, 0, 0, 0, 0, 0, 0], absoluteVote2);
    await checkIsVotableWithAbsoluteVote(proposalId1,true,absoluteVote1);
    await checkIsVotableWithAbsoluteVote(proposalId2,true,absoluteVote2);

  });

  it('getAllowedRangeOfChoices', async function () {
    let absoluteVote = await AbsoluteVote.new();
    let allowedRange;
    allowedRange = await absoluteVote.getAllowedRangeOfChoices();
    assert.equal(allowedRange[0],0);
    assert.equal(allowedRange[1],10);
  });
});
