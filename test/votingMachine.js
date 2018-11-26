const helpers = require('./helpers');
const constants = require('./constants');
const AbsoluteVote = artifacts.require('AbsoluteVote');
const QuorumVote = artifacts.require('QuorumVote');
const Reputation = artifacts.require('Reputation');

const ERC827TokenMock = artifacts.require('./test/ERC827TokenMock.sol');
const GenesisProtocol = artifacts.require("./GenesisProtocol.sol");
const GenesisProtocolCallbacks = artifacts.require("./GenesisProtocolCallbacksMock.sol");



const setupGenesisProtocol = async function (accounts,_voteOnBehalf = helpers.NULL_ADDRESS,
                                      _preBoostedVoteRequiredPercentage=50,
                                      _preBoostedVotePeriodLimit=60,
                                      _boostedVotePeriodLimit=60,
                                      _thresholdConstA=1,
                                      _thresholdConstB=1,
                                      _minimumStakingFee=0,
                                      _quietEndingPeriod=0,
                                      _proposingRepRewardConstA=60000,
                                      _proposingRepRewardConstB=1000,
                                      _stakerFeeRatioForVoters=10,
                                      _votersReputationLossRatio=10,
                                      _votersGainRepRatioFromLostRep=80,
                                      _daoBountyConst = 15,
                                      _daoBountyLimt =10 ) {
   var testSetup = new helpers.TestSetup();
   testSetup.stakingToken = await ERC827TokenMock.new(accounts[0],3000);
   testSetup.genesisProtocol = await GenesisProtocol.new(testSetup.stakingToken.address,{gas:constants.GAS_LIMIT});

   testSetup.reputationArray = [20, 10, 70 ];
   testSetup.org = {};
   //let reputationMinimeTokenFactory = await ReputationMinimeTokenFactory.new();
   testSetup.org.reputation  = await Reputation.new();
   await testSetup.org.reputation.mint(accounts[0],testSetup.reputationArray[0]);
   await testSetup.org.reputation.mint(accounts[1],testSetup.reputationArray[1]);
   await testSetup.org.reputation.mint(accounts[2],testSetup.reputationArray[2]);
   await testSetup.stakingToken.transfer(accounts[1],1000);
   await testSetup.stakingToken.transfer(accounts[2],1000);

   testSetup.genesisProtocolCallbacks = await GenesisProtocolCallbacks.new(testSetup.org.reputation.address,testSetup.stakingToken.address,testSetup.genesisProtocol.address);
   await testSetup.org.reputation.transferOwnership(testSetup.genesisProtocolCallbacks.address);

   testSetup.genesisProtocolParams= await setupGenesisProtocolParams(testSetup,
                                         _voteOnBehalf,
                                         _preBoostedVoteRequiredPercentage,
                                         _preBoostedVotePeriodLimit,
                                         _boostedVotePeriodLimit,
                                         _thresholdConstA,
                                         _thresholdConstB,
                                         _minimumStakingFee,
                                         _quietEndingPeriod,
                                         _proposingRepRewardConstA,
                                         _proposingRepRewardConstB,
                                         _stakerFeeRatioForVoters,
                                         _votersReputationLossRatio,
                                         _votersGainRepRatioFromLostRep,
                                         _daoBountyConst,
                                         _daoBountyLimt);


   return testSetup;
};


export class GenesisProtocolParams {
  constructor() {
  }
}

const setupGenesisProtocolParams = async function(
                                            testSetup,
                                            voteOnBehalf = 0,
                                            _preBoostedVoteRequiredPercentage=50,
                                            _preBoostedVotePeriodLimit=60,
                                            _boostedVotePeriodLimit=60,
                                            _thresholdConstA=1,
                                            _thresholdConstB=1,
                                            _minimumStakingFee=0,
                                            _quietEndingPeriod=0,
                                            _proposingRepRewardConstA=60,
                                            _proposingRepRewardConstB=1,
                                            _stakerFeeRatioForVoters=10,
                                            _votersReputationLossRatio=10,
                                            _votersGainRepRatioFromLostRep=80,
                                            _daoBountyConst=15,
                                            _daoBountyLimt=10
                                            ) {
  var genesisProtocolParams = new GenesisProtocolParams();
  await testSetup.genesisProtocolCallbacks.setParameters([_preBoostedVoteRequiredPercentage,
                                                 _preBoostedVotePeriodLimit,
                                                 _boostedVotePeriodLimit,
                                                 _thresholdConstA,
                                                 _thresholdConstB,
                                                 _minimumStakingFee,
                                                 _quietEndingPeriod,
                                                 _proposingRepRewardConstA,
                                                 _proposingRepRewardConstB,
                                                 _stakerFeeRatioForVoters,
                                                 _votersReputationLossRatio,
                                                 _votersGainRepRatioFromLostRep,
                                                 _daoBountyConst,
                                                 _daoBountyLimt],voteOnBehalf);
  genesisProtocolParams.paramsHash = await testSetup.genesisProtocol.getParametersHash([_preBoostedVoteRequiredPercentage,
                                                 _preBoostedVotePeriodLimit,
                                                 _boostedVotePeriodLimit,
                                                 _thresholdConstA,
                                                 _thresholdConstB,
                                                 _minimumStakingFee,
                                                 _quietEndingPeriod,
                                                 _proposingRepRewardConstA,
                                                 _proposingRepRewardConstB,
                                                 _stakerFeeRatioForVoters,
                                                 _votersReputationLossRatio,
                                                 _votersGainRepRatioFromLostRep,
                                                 _daoBountyConst,
                                                 _daoBountyLimt],voteOnBehalf);
  return genesisProtocolParams;
};


contract('VotingMachine', (accounts)=>{
  it('proposalId should be globally unique', async () =>{
    const absolute = await AbsoluteVote.new();
    const quorum = await QuorumVote.new();

    const absoluteParams = await absolute.setParameters.call(50,true);
    await absolute.setParameters(50,true);
    var testSetup = await setupGenesisProtocol(accounts);
    const quoromParams = await quorum.setParameters.call(50,true);
    await quorum.setParameters(50,true);
    const absoluteProposalId = await absolute.propose(5, absoluteParams,accounts[0],helpers.NULL_ADDRESS);

    const genesisProposalId = await testSetup.genesisProtocol.propose(2, testSetup.genesisProtocolParams.paramsHash,accounts[0],helpers.NULL_ADDRESS);
    const quorumProposalId = await quorum.propose(5, quoromParams,accounts[0],helpers.NULL_ADDRESS);

    assert(absoluteProposalId !== genesisProposalId, 'AbsoluteVote gives the same proposalId as GenesisProtocol');
    assert(genesisProposalId !== quorumProposalId, 'GenesisProtocol gives the same proposalId as QuorumVote');
    assert(quorumProposalId !== absoluteProposalId, 'QuorumVote gives the same proposalId as AbsoluteVote');
  });
});
