const helpers = require('./helpers');

const QuorumVote = artifacts.require("./QuorumVote.sol");
const Reputation = artifacts.require("./Reputation.sol");
const AbsoluteVoteExecuteMock = artifacts.require("./AbsoluteVoteExecuteMock.sol");

let reputation, quorumVote, reputationArray, absoluteVoteExecuteMock;


const setupQuorumVote = async function (accounts,voteOnBehalf=helpers.NULL_ADDRESS, precReq=50) {
  quorumVote = await QuorumVote.new();

  // set up a reputation system
  reputation = await Reputation.new();
  reputationArray = [200, 100, 700 ];
  await reputation.mint(accounts[0], reputationArray[0]);
  await reputation.mint(accounts[1], reputationArray[1]);
  await reputation.mint(accounts[2], reputationArray[2]);

  // register some parameters
  await quorumVote.setParameters(precReq, voteOnBehalf);
  absoluteVoteExecuteMock = await AbsoluteVoteExecuteMock.new(reputation.address,quorumVote.address);

  return quorumVote;
};

const checkProposalInfo = async function(proposalId, _proposalInfo) {
  let proposalInfo;
  proposalInfo = await quorumVote.proposals(proposalId);
  // proposalInfo has the following structure
  // address organization;
  assert.equal(proposalInfo[0], _proposalInfo[0]);
  // uint numOfChoices;
  assert.equal(proposalInfo[1], _proposalInfo[1]);
  // ExecutableInterface executable;
  assert.equal(proposalInfo[2], _proposalInfo[2]);
  // bytes32 paramsHash;
  assert.equal(proposalInfo[3], _proposalInfo[3]);
  // uint totalVotes;
  assert.equal(proposalInfo[4], _proposalInfo[4]);
  assert.equal(proposalInfo[5], _proposalInfo[5]);
  // - the mapping is simply not returned at all in the array
  // bool opened; // voting opened flag;
};

const checkVotesStatus = async function(proposalId, _votesStatus){
   return helpers.checkVotesStatus(proposalId, _votesStatus,quorumVote);
};

const checkVoteInfo = async function(proposalId, voterAddress, _voteInfo) {
  let voteInfo;
  voteInfo = await quorumVote.voteInfo(proposalId, voterAddress);
  // voteInfo has the following structure
  // int vote;
  assert.equal(voteInfo[0], _voteInfo[0]);
  // uint reputation;
  assert.equal(voteInfo[1], _voteInfo[1]);
};

contract('QuorumVote', accounts => {

  it("Sanity checks", async function () {
    quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await quorumVote.getParametersHash( 50, helpers.NULL_ADDRESS );
    let tx = await absoluteVoteExecuteMock.propose(5, paramsHash, absoluteVoteExecuteMock.address, accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);
    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);

    // no one has voted yet at this point
    await checkProposalInfo(proposalId, [ organizationId,true, absoluteVoteExecuteMock.address, 5, paramsHash, 0]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // now lets vote Option 1 with a minority reputation
    await quorumVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 5, paramsHash, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // another minority reputation (Option 0):
    await quorumVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS, { from: accounts[1] });
    await checkVoteInfo(proposalId, accounts[1], [0, reputationArray[1]]);
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 5, paramsHash, (reputationArray[0] + reputationArray[1])]);
    await checkVotesStatus(proposalId, [reputationArray[1], reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // the decisive vote is cast now and the proposal will be executed with option 5
    tx = await quorumVote.vote(proposalId, 5,0, accounts[2],{from:accounts[2]});
    await checkVoteInfo(proposalId, accounts[2], [5, reputationArray[2]]);
    // Proposal should be empty (being deleted after execution)
    await checkProposalInfo(proposalId, [ helpers.NULL_HASH,false,helpers.NULL_ADDRESS, 0,helpers.NULL_HASH, 0]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  });

  it("Quorum proposals should be executed when reaching the percentage required", async function () {

    // 25% precReq proposal
    quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 25);
    const paramsHash = await quorumVote.getParametersHash( 25, helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);
    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);

    // no one has voted yet at this point
    await checkProposalInfo(proposalId, [ organizationId,true ,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // now lets vote 'Option 0' with 20% of the reputation - should not be executed yet (didn't reach 25%).
    await quorumVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [0, reputationArray[0]]);
    await checkProposalInfo(proposalId, [ organizationId,true, absoluteVoteExecuteMock.address,6, paramsHash, reputationArray[0]]);
    await checkVotesStatus(proposalId, [reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // now lets vote 'Option 1' with 10% of the reputation - should be executed with 'Option 0'! (reached 30% and the 'Option 1' is the majority).
    await quorumVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS, { from: accounts[1] });
    await checkVoteInfo(proposalId, accounts[1], [1, reputationArray[1]]);
    await checkProposalInfo(proposalId, [helpers.NULL_HASH,false,helpers.NULL_ADDRESS, 0,helpers.NULL_HASH, 0]);
  });

  it("Invalid inputs shouldn't work (precReq, vote)", async function () {

    // Lets try to create a proposal with precReq=200
    try {
      quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 200);
      throw 'an error'; // make sure that an error is thrown
    } catch (error) {
      helpers.assertVMException(error);
    }

    // Lets try to create a proposal with numOfChoices=99
    try {
      let quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 22);
      const paramsHash = await quorumVote.getParametersHash( 22, helpers.NULL_ADDRESS);
      await absoluteVoteExecuteMock.propose(99, paramsHash, accounts[1],accounts[0],helpers.NULL_ADDRESS);
      throw 'an error'; // make sure that an error is thrown
    } catch (error) {
      helpers.assertVMException(error);
    }

    // propose a proposal
    quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 3);
    const paramsHash = await quorumVote.getParametersHash( 3, helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);

    // Lets try to vote with the uint 99 (invalid vote)
    try {
      await quorumVote.vote(proposalId, 99,0,helpers.NULL_ADDRESS);
      throw 'an error'; // make sure that an error is thrown
    } catch (error) {
      helpers.assertVMException(error);
    }

  });

  it("All options can be voted (0-9)", async function() {
    let quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await quorumVote.getParametersHash( 50, helpers.NULL_ADDRESS );
    let tx = await absoluteVoteExecuteMock.propose(10, paramsHash, accounts[1],accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);

    // Option 1
    await quorumVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [0, reputationArray[0]]);
    await checkVotesStatus(proposalId, [reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // Option 2
    await quorumVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0]);

    // Option 3
    await quorumVote.vote(proposalId, 2,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [2, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, reputationArray[0], 0, 0, 0, 0, 0, 0, 0]);

    // Option 4
    await quorumVote.vote(proposalId, 3,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [3, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, reputationArray[0], 0, 0, 0, 0, 0, 0]);

    // Option 5
    await quorumVote.vote(proposalId, 4,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [4, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, reputationArray[0], 0, 0, 0, 0, 0, 0]);

    // Option 6
    await quorumVote.vote(proposalId, 5,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [5, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, reputationArray[0], 0, 0, 0, 0, 0]);

    // Option 7
    await quorumVote.vote(proposalId, 6,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [6, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, reputationArray[0], 0, 0, 0, 0]);

    // Option 8
    await quorumVote.vote(proposalId, 7,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [7, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, reputationArray[0], 0, 0, 0]);

    // Option 9
    await quorumVote.vote(proposalId, 8,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [8, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, reputationArray[0], 0, 0]);

    // Option 10
    await quorumVote.vote(proposalId, 9,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [9, reputationArray[0]]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, reputationArray[0], 0]);
  });

  it("Double vote shouldn't double proposal's 'Option 2' count", async function() {
    let quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await quorumVote.getParametersHash( 50, helpers.NULL_ADDRESS );
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);
    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);

    // no one has voted yet at this point
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);

    // Lets try to vote twice from the same address
    await quorumVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);
    await quorumVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);

    // Total 'Option 2' should be equal to the voter's reputation exactly, even though we voted twice
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, reputationArray[0], true]);
    await checkVotesStatus(proposalId, [0, reputationArray[0], 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it("Vote cancellation should revert proposal's counters", async function() {
    let quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await quorumVote.getParametersHash( 50, helpers.NULL_ADDRESS );
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);
    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);

    // no one has voted yet at this point
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0, true]);

    // Lets try to vote and then cancel our vote
    await quorumVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);
    await checkVoteInfo(proposalId, accounts[0], [1, reputationArray[0]]);
    await quorumVote.cancelVote(proposalId);
    await checkVoteInfo(proposalId, accounts[0], [0, 0]);

    // Proposal's votes supposed to be zero again.
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0, true]);
    await checkVotesStatus(proposalId, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it("if the voter is not set as voteOnBehalf, he shouldn't be able to vote on the behalf of someone else", async function () {
    quorumVote = await setupQuorumVote(accounts,accounts[5], 50);

    // propose a vote
    const paramsHash = await quorumVote.getParametersHash( 50,accounts[5]);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);
    const organizationId = await web3.utils.soliditySha3(absoluteVoteExecuteMock.address,helpers.NULL_ADDRESS);
    // no one has voted yet at this point
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);

    // Lets try to vote on the behalf of someone else
    try {
      await quorumVote.vote(proposalId, 1,0, accounts[0], {from: accounts[1]});
      assert(false, "ownerVote was supposed to throw but didn't.");
    } catch(error) {
      helpers.assertVMException(error);
    }

    // The vote should not be counted
    await checkProposalInfo(proposalId, [ organizationId,true,absoluteVoteExecuteMock.address, 6, paramsHash, 0]);
    await quorumVote.vote(proposalId, 1,0, accounts[0], {from: accounts[5]});
  });
    // [TODO] Check why this test doesn't work
    // it("Non-existent parameters hash shouldn't work", async function() {
    //   let quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);
    //   let paramsHash;
    //
    //   // propose a proposal
    //   paramsHash = await quorumVote.getParametersHash( 50, true ,helpers.NULL_ADDRESS);
    //   await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    //
    //   paramsHash = await quorumVote.getParametersHash(helpers.NULL_ADDRESS, 50, true);
    //   try {
    //     await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    //     assert(false, "propose was supposed to throw but didn't.");
    //   } catch(error) {
    //     helpers.assertVMException(error);
    //   }
    //
    //   paramsHash = await quorumVote.getParametersHash(helpers.SOME_ADDRESS, 50, true);
    //   try {
    //     await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    //     assert(false, "propose was supposed to throw but didn't.");
    //   } catch(error) {
    //     helpers.assertVMException(error);
    //   }
    // });

  it("Should not able to vote / cancel vote / proposal after proposal has been executed", async function () {

    // propose a vote with precRequired=19%
    let quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 19);

    // propose a proposal
    const paramsHash = await quorumVote.getParametersHash( 19, helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);
    // After that voting the proposal should be executed
    await quorumVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS);

    // Should not be able to cancel the vote because the proposal has been executed
    try {
        await quorumVote.cancelVote(proposalId);
        assert(false, "Can't cancel vote because proposal already been executed.");
    } catch (error) {
        helpers.assertVMException(error);
    }

    // Should not be able to vote because the proposal has been executed
    try {
        await quorumVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS, { from: accounts[1] });
        assert(false, "Can't vote because proposal already been executed.");
    } catch (error) {
        helpers.assertVMException(error);
    }

  });

  it("log the NewProposal event on proposing new proposal", async function() {
    let quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a vote
    const paramsHash = await quorumVote.getParametersHash( 50, helpers.NULL_ADDRESS );
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);
    assert.equal(absoluteVoteExecuteMock.address,
                 await helpers.getOrganization(tx,quorumVote,"NewProposal"));

  });

  it("Should log the VoteProposal and CancelVoting events on voting and canceling the vote", async () => {
    quorumVote = await setupQuorumVote(accounts,);

    // propose a vote
    const paramsHash = await quorumVote.getParametersHash( 50, helpers.NULL_ADDRESS );
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);

    let voteTX = await quorumVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS);

    assert.equal(voteTX.logs.length, 2);
    assert.equal(voteTX.logs[0].event, "VoteProposal");
    assert.equal(voteTX.logs[0].args._proposalId, proposalId);
    assert.equal(voteTX.logs[0].args._voter, accounts[0]);
    assert.equal(voteTX.logs[0].args._vote, 1);
    assert.equal(voteTX.logs[0].args._reputation, reputationArray[0]);

    let cancelVoteTX = await quorumVote.cancelVote(proposalId);
    assert.equal(cancelVoteTX.logs.length, 1);
    assert.equal(cancelVoteTX.logs[0].event, "CancelVoting");
    assert.equal(cancelVoteTX.logs[0].args._proposalId, proposalId);
    assert.equal(cancelVoteTX.logs[0].args._voter, accounts[0]);
  });

  it("Should log the ExecuteProposal event on executing quorum proposal with 'no' decision", async () => {

    // propose a proposal with precRequired=19%
    quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 19);

    const paramsHash = await quorumVote.getParametersHash( 19, helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);

    let voteTX = await quorumVote.vote(proposalId, 0,0,helpers.NULL_ADDRESS);

    assert.equal(voteTX.logs.length, 3);
    assert.equal(voteTX.logs[2].event, "ExecuteProposal");
    assert.equal(voteTX.logs[2].args._proposalId, proposalId);
    assert.equal(voteTX.logs[2].args._decision, 0);
  });

  it('cannot vote for another user', async function () {
    quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a new proposal
    const paramsHash = await quorumVote.getParametersHash( 50,helpers.NULL_ADDRESS);
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId =  await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);
    await quorumVote.vote(proposalId, 1,0, accounts[1], { from: accounts[2] });
    await checkVoteInfo(proposalId, accounts[2], [1, reputationArray[2]]);
    await checkVoteInfo(proposalId, accounts[0], [0, 0]);
  });
  // [TODO] Check why this test doesn't work
  // it("Should behave sensibly when voting with an empty reputation system", async function () {
  //   // Initiate objects
  //   const quorumVote = await QuorumVote.new();
  //   const reputation = await Reputation.new();
  //   const executable = await ExecutableTest.new();
  //   organization = await Avatar.new('name', helpers.NULL_ADDRESS, reputation.address);
  //
  //   // Send empty rep system to the absoluteVote contract
  //   await quorumVote.setParameters(helpers.NULL_ADDRESS, 50, true);
  //   const paramsHash = await quorumVote.getParametersHash(helpers.NULL_ADDRESS, 50, true);
  //
  //   // Try to propose - an exception should be raised
  //   try {
  //     let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
  //     assert(false, 'Should throw an exception but didn\'t');
  //   } catch (ex) {
  //     helpers.assertVMException(ex);
  //   }
  // });


  it('Test voteWithSpecifiedAmounts - More reputation than I own, negative reputation, etc..', async function () {
    let quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a new proposal
    const paramsHash = await quorumVote.getParametersHash( 50, helpers.NULL_ADDRESS );
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);

    // Vote with the reputation the I own - should work
    tx = await quorumVote.vote(proposalId, 1, reputationArray[0] / 10,helpers.NULL_ADDRESS);

    var repVoted = await helpers.getValueFromLogs(tx, "_reputation");

    assert.equal(repVoted, reputationArray[0] / 10, 'Should vote with specified amount');

    // Vote with more reputation that i own - exception should be raised
    try {
      await quorumVote.vote(proposalId, 1, (reputationArray[0] + 1),helpers.NULL_ADDRESS);
      assert(false, 'Not enough reputation - voting shouldn\'t work');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // Vote with a very big number - exception should be raised
    let BigNumber = require('bignumber.js');
    let bigNum = ((new BigNumber(2)).toPower(254)).toString(10);
    try {
      await quorumVote.vote(proposalId, 1, bigNum,helpers.NULL_ADDRESS);
      assert(false, 'Voting shouldn\'t work');
    } catch (ex) {
      helpers.assertVMException(ex);
    }
  });

  it("Internal functions can not be called externally", async () => {

    let quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a new proposal
    const paramsHash = await quorumVote.getParametersHash( 50, helpers.NULL_ADDRESS );
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);

    // Lets try to call internalVote function
    try {
      await quorumVote.internalVote(proposalId, accounts[0], 1, reputationArray[0]);
      assert(false, 'Can\'t call internalVote');
    } catch (ex) {
      helpers.assertInternalFunctionException(ex);
    }

    await quorumVote.vote(proposalId, 1,0,helpers.NULL_ADDRESS, {from: accounts[0]});

    // Lets try to call cancelVoteInternal function
    try {
      await quorumVote.cancelVoteInternal(proposalId, accounts[0]);
      assert(false, 'Can\'t call cancelVoteInternal');
    } catch (ex) {
      helpers.assertInternalFunctionException(ex);
    }
  });

  it("Try to send wrong proposal id to the voting/cancel functions", async () => {

    quorumVote = await setupQuorumVote(accounts,helpers.NULL_ADDRESS, 50);

    // propose a new proposal
    const paramsHash = await quorumVote.getParametersHash( 50, helpers.NULL_ADDRESS );
    let tx = await absoluteVoteExecuteMock.propose(6, paramsHash, absoluteVoteExecuteMock.address,accounts[0],helpers.NULL_ADDRESS);
    const proposalId = await helpers.getProposalId(tx,quorumVote,"NewProposal");
    assert.isOk(proposalId);

    // Lets try to call vote with invalid proposal id
    try {
      await quorumVote.vote(helpers.NULL_HASH, 1,0,helpers.NULL_ADDRESS, {from: accounts[0]});
      assert(false, 'Invalid proposal ID has been delivered');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // Lets try to call voteWithSpecifiedAmounts with invalid proposal id
    try {
      await quorumVote.vote(helpers.NULL_HASH, 1, 1,helpers.NULL_ADDRESS);
      assert(false, 'Invalid proposal ID has been delivered');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // Lets try to call execute with invalid proposal id
    try {
      await quorumVote.execute(helpers.NULL_HASH);
      assert(false, 'Invalid proposal ID has been delivered');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

    // Lets try to call cancel a vote with invalid proposal id
    try {
      await quorumVote.cancelVote(helpers.NULL_HASH);
      assert(false, 'Invalid proposal ID has been delivered');
    } catch (ex) {
      helpers.assertVMException(ex);
    }

  });
});
