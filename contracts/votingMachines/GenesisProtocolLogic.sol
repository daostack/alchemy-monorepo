pragma solidity ^0.5.11;

import "./IntVoteInterface.sol";
import { RealMath } from "../libs/RealMath.sol";
import "./VotingMachineCallbacksInterface.sol";
import "./ProposalExecuteInterface.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";



/**
 * @title GenesisProtocol implementation -an organization's voting machine scheme.
 */
contract GenesisProtocolLogic is IntVoteInterface {
    using SafeMath for uint256;
    using Math for uint256;
    using RealMath for uint216;
    using RealMath for uint256;
    using Address for address;

    enum ProposalState { None, ExpiredInQueue, Executed, Queued, PreBoosted, Boosted, QuietEndingPeriod}
    enum ExecutionState { None, QueueBarCrossed, QueueTimeOut, PreBoostedBarCrossed, BoostedTimeOut, BoostedBarCrossed}

    //Organization's parameters
    struct Parameters {
        uint256 queuedVoteRequiredPercentage; // the absolute vote percentages bar.
        uint256 queuedVotePeriodLimit; //the time limit for a proposal to be in an absolute voting mode.
        uint256 boostedVotePeriodLimit; //the time limit for a proposal to be in boost mode.
        uint256 preBoostedVotePeriodLimit; //the time limit for a proposal
                                          //to be in an preparation state (stable) before boosted.
        uint256 thresholdConst; //constant  for threshold calculation .
                                //threshold =thresholdConst ** (numberOfBoostedProposals)
        uint256 limitExponentValue;// an upper limit for numberOfBoostedProposals
                                   //in the threshold calculation to prevent overflow
        uint256 quietEndingPeriod; //quite ending period
        uint256 proposingRepReward;//proposer reputation reward.
        uint256 votersReputationLossRatio;//Unsuccessful pre booster
                                          //voters lose votersReputationLossRatio% of their reputation.
        uint256 minimumDaoBounty;
        uint256 daoBountyConst;//The DAO downstake for each proposal is calculate according to the formula
                               //(daoBountyConst * averageBoostDownstakes)/100 .
        uint256 activationTime;//the point in time after which proposals can be created.
        //if this address is set so only this address is allowed to vote of behalf of someone else.
        address voteOnBehalf;
    }

    struct Voter {
        uint256 vote; // YES(1) ,NO(2)
        uint256 reputation; // amount of voter's reputation
        bool preBoosted;
    }

    struct Staker {
        uint256 vote; // YES(1) ,NO(2)
        uint256 amount; // amount of staker's stake
        uint256 amount4Bounty;// amount of staker's stake used for bounty reward calculation.
    }

    struct Proposal {
        bytes32 organizationId; // the organization unique identifier the proposal is target to.
        address callbacks;    // should fulfill voting callbacks interface.
        ProposalState state;
        uint256 winningVote; //the winning vote.
        address proposer;
        //the proposal boosted period limit . it is updated for the case of quiteWindow mode.
        uint256 currentBoostedVotePeriodLimit;
        bytes32 paramsHash;
        uint256 daoBountyRemain; //use for checking sum zero bounty claims.it is set at the proposing time.
        uint256 daoBounty;
        uint256 totalStakes;// Total number of tokens staked which can be redeemable by stakers.
        uint256 confidenceThreshold;
        uint256 secondsFromTimeOutTillExecuteBoosted;
        uint[3] times; //times[0] - submittedTime
                       //times[1] - boostedPhaseTime
                       //times[2] -preBoostedPhaseTime;
        bool daoRedeemItsWinnings;
        //      vote      reputation
        mapping(uint256   =>  uint256    ) votes;
        //      vote      reputation
        mapping(uint256   =>  uint256    ) preBoostedVotes;
        //      address     voter
        mapping(address =>  Voter    ) voters;
        //      vote        stakes
        mapping(uint256   =>  uint256    ) stakes;
        //      address  staker
        mapping(address  => Staker   ) stakers;
    }

    event Stake(bytes32 indexed _proposalId,
        address indexed _organization,
        address indexed _staker,
        uint256 _vote,
        uint256 _amount
    );

    event Redeem(bytes32 indexed _proposalId,
        address indexed _organization,
        address indexed _beneficiary,
        uint256 _amount
    );

    event RedeemDaoBounty(bytes32 indexed _proposalId,
        address indexed _organization,
        address indexed _beneficiary,
        uint256 _amount
    );

    event RedeemReputation(bytes32 indexed _proposalId,
        address indexed _organization,
        address indexed _beneficiary,
        uint256 _amount
    );

    event StateChange(bytes32 indexed _proposalId, ProposalState _proposalState);
    event GPExecuteProposal(bytes32 indexed _proposalId, ExecutionState _executionState);
    event ExpirationCallBounty(bytes32 indexed _proposalId, address indexed _beneficiary, uint256 _amount);
    event ConfidenceLevelChange(bytes32 indexed _proposalId, uint256 _confidenceThreshold);

    mapping(bytes32=>Parameters) public parameters;  // A mapping from hashes to parameters
    mapping(bytes32=>Proposal) public proposals; // Mapping from the ID of the proposal to the proposal itself.
    mapping(bytes32=>uint) public orgBoostedProposalsCnt;
           //organizationId => organization
    mapping(bytes32        => address     ) public organizations;
          //organizationId => averageBoostDownstakes
    mapping(bytes32           => uint256              ) public averagesDownstakesOfBoosted;
    uint256 constant public NUM_OF_CHOICES = 2;
    uint256 constant public NO = 2;
    uint256 constant public YES = 1;
    uint256 public proposalsCnt; // Total number of proposals
    IERC20 public stakingToken;
    address constant private GEN_TOKEN_ADDRESS = 0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf;
    uint256 constant private MAX_BOOSTED_PROPOSALS = 4096;

    /**
     * @dev Constructor
     */
    constructor(IERC20 _stakingToken) public {
      //The GEN token (staking token) address is hard coded in the contract by GEN_TOKEN_ADDRESS .
      //This will work for a network which already hosted the GEN token on this address (e.g mainnet).
      //If such contract address does not exist in the network (e.g ganache)
      //the contract will use the _stakingToken param as the
      //staking token address.
        if (address(GEN_TOKEN_ADDRESS).isContract()) {
            stakingToken = IERC20(GEN_TOKEN_ADDRESS);
        } else {
            stakingToken = _stakingToken;
        }
    }

  /**
   * @dev Check that the proposal is votable
   * a proposal is votable if it is in one of the following states:
   *  PreBoosted,Boosted,QuietEndingPeriod or Queued
   */
    modifier votable(bytes32 _proposalId) {
        require(_isVotable(_proposalId));
        _;
    }

    /**
     * @dev register a new proposal with the given parameters. Every proposal has a unique ID which is being
     * generated by calculating keccak256 of a incremented counter.
     * @param _paramsHash parameters hash
     * @param _proposer address
     * @param _organization address
     */
    function propose(uint256, bytes32 _paramsHash, address _proposer, address _organization)
        external
        returns(bytes32)
    {
      // solhint-disable-next-line not-rely-on-time
        require(now > parameters[_paramsHash].activationTime, "not active yet");
        //Check parameters existence.
        require(parameters[_paramsHash].queuedVoteRequiredPercentage >= 50);
        // Generate a unique ID:
        bytes32 proposalId = keccak256(abi.encodePacked(this, proposalsCnt));
        proposalsCnt = proposalsCnt.add(1);
         // Open proposal:
        Proposal memory proposal;
        proposal.callbacks = msg.sender;
        proposal.organizationId = keccak256(abi.encodePacked(msg.sender, _organization));

        proposal.state = ProposalState.Queued;
        // solhint-disable-next-line not-rely-on-time
        proposal.times[0] = now;//submitted time
        proposal.currentBoostedVotePeriodLimit = parameters[_paramsHash].boostedVotePeriodLimit;
        proposal.proposer = _proposer;
        proposal.winningVote = NO;
        proposal.paramsHash = _paramsHash;
        if (organizations[proposal.organizationId] == address(0)) {
            if (_organization == address(0)) {
                organizations[proposal.organizationId] = msg.sender;
            } else {
                organizations[proposal.organizationId] = _organization;
            }
        }
        //calc dao bounty
        uint256 daoBounty =
        parameters[_paramsHash].daoBountyConst.mul(averagesDownstakesOfBoosted[proposal.organizationId]).div(100);
        proposal.daoBountyRemain = daoBounty.max(parameters[_paramsHash].minimumDaoBounty);
        proposals[proposalId] = proposal;
        proposals[proposalId].stakes[NO] = proposal.daoBountyRemain;//dao downstake on the proposal

        emit NewProposal(proposalId, organizations[proposal.organizationId], NUM_OF_CHOICES, _proposer, _paramsHash);
        return proposalId;
    }

    /**
      * @dev executeBoosted try to execute a boosted or QuietEndingPeriod proposal if it is expired
      * it rewards the msg.sender with P % of the proposal's upstakes upon a successful call to this function.
      * P = t/150, where t is the number of seconds passed since the the proposal's timeout.
      * P is capped by 10%.
      * @param _proposalId the id of the proposal
      * @return uint256 expirationCallBounty the bounty amount for the expiration call
     */
    function executeBoosted(bytes32 _proposalId) external returns(uint256 expirationCallBounty) {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.state == ProposalState.Boosted || proposal.state == ProposalState.QuietEndingPeriod,
        "proposal state in not Boosted nor QuietEndingPeriod");
        require(_execute(_proposalId), "proposal need to expire");

        proposal.secondsFromTimeOutTillExecuteBoosted =
        // solhint-disable-next-line not-rely-on-time
        now.sub(proposal.currentBoostedVotePeriodLimit.add(proposal.times[1]));

        expirationCallBounty = calcExecuteCallBounty(_proposalId);
        proposal.totalStakes = proposal.totalStakes.sub(expirationCallBounty);
        require(stakingToken.transfer(msg.sender, expirationCallBounty), "transfer to msg.sender failed");
        emit ExpirationCallBounty(_proposalId, msg.sender, expirationCallBounty);
    }

    /**
     * @dev hash the parameters, save them if necessary, and return the hash value
     * @param _params a parameters array
     *    _params[0] - _queuedVoteRequiredPercentage,
     *    _params[1] - _queuedVotePeriodLimit, //the time limit for a proposal to be in an absolute voting mode.
     *    _params[2] - _boostedVotePeriodLimit, //the time limit for a proposal to be in an relative voting mode.
     *    _params[3] - _preBoostedVotePeriodLimit, //the time limit for a proposal to be in an preparation
     *                  state (stable) before boosted.
     *    _params[4] -_thresholdConst
     *    _params[5] -_quietEndingPeriod
     *    _params[6] -_proposingRepReward
     *    _params[7] -_votersReputationLossRatio
     *    _params[8] -_minimumDaoBounty
     *    _params[9] -_daoBountyConst
     *    _params[10] -_activationTime
     * @param _voteOnBehalf - authorized to vote on behalf of others.
    */
    function setParameters(
        uint[11] calldata _params, //use array here due to stack too deep issue.
        address _voteOnBehalf
    )
    external
    returns(bytes32)
    {
        require(_params[0] <= 100 && _params[0] >= 50, "50 <= queuedVoteRequiredPercentage <= 100");
        require(_params[4] <= 16000 && _params[4] > 1000, "1000 < thresholdConst <= 16000");
        require(_params[7] <= 100, "votersReputationLossRatio <= 100");
        require(_params[2] >= _params[5], "boostedVotePeriodLimit >= quietEndingPeriod");
        require(_params[8] > 0, "minimumDaoBounty should be > 0");
        require(_params[9] > 0, "daoBountyConst should be > 0");

        bytes32 paramsHash = getParametersHash(_params, _voteOnBehalf);
        //set a limit for power for a given alpha to prevent overflow
        uint256 limitExponent = 172;//for alpha less or equal 2
        uint256 j = 2;
        for (uint256 i = 2000; i < 16000; i = i*2) {
            if ((_params[4] > i) && (_params[4] <= i*2)) {
                limitExponent = limitExponent/j;
                break;
            }
            j++;
        }

        parameters[paramsHash] = Parameters({
            queuedVoteRequiredPercentage: _params[0],
            queuedVotePeriodLimit: _params[1],
            boostedVotePeriodLimit: _params[2],
            preBoostedVotePeriodLimit: _params[3],
            thresholdConst:uint216(_params[4]).fraction(uint216(1000)),
            limitExponentValue:limitExponent,
            quietEndingPeriod: _params[5],
            proposingRepReward: _params[6],
            votersReputationLossRatio:_params[7],
            minimumDaoBounty:_params[8],
            daoBountyConst:_params[9],
            activationTime:_params[10],
            voteOnBehalf:_voteOnBehalf
        });
        return paramsHash;
    }

    /**
     * @dev redeem a reward for a successful stake, vote or proposing.
     * The function use a beneficiary address as a parameter (and not msg.sender) to enable
     * users to redeem on behalf of someone else.
     * @param _proposalId the ID of the proposal
     * @param _beneficiary - the beneficiary address
     * @return rewards -
     *           [0] stakerTokenReward
     *           [1] voterReputationReward
     *           [2] proposerReputationReward
     */
     // solhint-disable-next-line function-max-lines,code-complexity
    function redeem(bytes32 _proposalId, address _beneficiary) public returns (uint[3] memory rewards) {
        Proposal storage proposal = proposals[_proposalId];
        require((proposal.state == ProposalState.Executed)||(proposal.state == ProposalState.ExpiredInQueue),
        "Proposal should be Executed or ExpiredInQueue");
        Parameters memory params = parameters[proposal.paramsHash];
        //as staker
        Staker storage staker = proposal.stakers[_beneficiary];
        uint256 totalWinningStakes = proposal.stakes[proposal.winningVote];
        uint256 totalStakesLeftAfterCallBounty =
        proposal.stakes[NO].add(proposal.stakes[YES]).sub(calcExecuteCallBounty(_proposalId));
        if (staker.amount > 0) {

            if (proposal.state == ProposalState.ExpiredInQueue) {
                //Stakes of a proposal that expires in Queue are sent back to stakers
                rewards[0] = staker.amount;
            } else if (staker.vote == proposal.winningVote) {
                if (staker.vote == YES) {
                    if (proposal.daoBounty < totalStakesLeftAfterCallBounty) {
                        uint256 _totalStakes = totalStakesLeftAfterCallBounty.sub(proposal.daoBounty);
                        rewards[0] = (staker.amount.mul(_totalStakes))/totalWinningStakes;
                    }
                } else {
                    rewards[0] = (staker.amount.mul(totalStakesLeftAfterCallBounty))/totalWinningStakes;
                }
            }
            staker.amount = 0;
        }
            //dao redeem its winnings
        if (proposal.daoRedeemItsWinnings == false &&
            _beneficiary == organizations[proposal.organizationId] &&
            proposal.state != ProposalState.ExpiredInQueue &&
            proposal.winningVote == NO) {
            rewards[0] =
            rewards[0]
            .add((proposal.daoBounty.mul(totalStakesLeftAfterCallBounty))/totalWinningStakes)
            .sub(proposal.daoBounty);
            proposal.daoRedeemItsWinnings = true;
        }

        //as voter
        Voter storage voter = proposal.voters[_beneficiary];
        if ((voter.reputation != 0) && (voter.preBoosted)) {
            if (proposal.state == ProposalState.ExpiredInQueue) {
              //give back reputation for the voter
                rewards[1] = ((voter.reputation.mul(params.votersReputationLossRatio))/100);
            } else if (proposal.winningVote == voter.vote) {
                uint256 lostReputation;
                if (proposal.winningVote == YES) {
                    lostReputation = proposal.preBoostedVotes[NO];
                } else {
                    lostReputation = proposal.preBoostedVotes[YES];
                }
                lostReputation = (lostReputation.mul(params.votersReputationLossRatio))/100;
                rewards[1] = ((voter.reputation.mul(params.votersReputationLossRatio))/100)
                .add((voter.reputation.mul(lostReputation))/proposal.preBoostedVotes[proposal.winningVote]);
            }
            voter.reputation = 0;
        }
        //as proposer
        if ((proposal.proposer == _beneficiary)&&(proposal.winningVote == YES)&&(proposal.proposer != address(0))) {
            rewards[2] = params.proposingRepReward;
            proposal.proposer = address(0);
        }
        if (rewards[0] != 0) {
            proposal.totalStakes = proposal.totalStakes.sub(rewards[0]);
            require(stakingToken.transfer(_beneficiary, rewards[0]), "transfer to beneficiary failed");
            emit Redeem(_proposalId, organizations[proposal.organizationId], _beneficiary, rewards[0]);
        }
        if (rewards[1].add(rewards[2]) != 0) {
            VotingMachineCallbacksInterface(proposal.callbacks)
            .mintReputation(rewards[1].add(rewards[2]), _beneficiary, _proposalId);
            emit RedeemReputation(
            _proposalId,
            organizations[proposal.organizationId],
            _beneficiary,
            rewards[1].add(rewards[2])
            );
        }
    }

    /**
     * @dev redeemDaoBounty a reward for a successful stake.
     * The function use a beneficiary address as a parameter (and not msg.sender) to enable
     * users to redeem on behalf of someone else.
     * @param _proposalId the ID of the proposal
     * @param _beneficiary - the beneficiary address
     * @return redeemedAmount - redeem token amount
     * @return potentialAmount - potential redeem token amount(if there is enough tokens bounty at the organization )
     */
    function redeemDaoBounty(bytes32 _proposalId, address _beneficiary)
    public
    returns(uint256 redeemedAmount, uint256 potentialAmount) {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.state == ProposalState.Executed);
        uint256 totalWinningStakes = proposal.stakes[proposal.winningVote];
        Staker storage staker = proposal.stakers[_beneficiary];
        if (
            (staker.amount4Bounty > 0)&&
            (staker.vote == proposal.winningVote)&&
            (proposal.winningVote == YES)&&
            (totalWinningStakes != 0)) {
            //as staker
                potentialAmount = (staker.amount4Bounty * proposal.daoBounty)/totalWinningStakes;
            }
        if ((potentialAmount != 0)&&
            (VotingMachineCallbacksInterface(proposal.callbacks)
            .balanceOfStakingToken(stakingToken, _proposalId) >= potentialAmount)) {
            staker.amount4Bounty = 0;
            proposal.daoBountyRemain = proposal.daoBountyRemain.sub(potentialAmount);
            require(
            VotingMachineCallbacksInterface(proposal.callbacks)
            .stakingTokenTransfer(stakingToken, _beneficiary, potentialAmount, _proposalId));
            redeemedAmount = potentialAmount;
            emit RedeemDaoBounty(_proposalId, organizations[proposal.organizationId], _beneficiary, redeemedAmount);
        }
    }

    /**
      * @dev calcExecuteCallBounty calculate the execute boosted call bounty
      * @param _proposalId the ID of the proposal
      * @return uint256 executeCallBounty
    */
    function calcExecuteCallBounty(bytes32 _proposalId) public view returns(uint256) {
        uint maxRewardSeconds = 1500;
        uint rewardSeconds =
        uint256(maxRewardSeconds).min(proposals[_proposalId].secondsFromTimeOutTillExecuteBoosted);
        return rewardSeconds.mul(proposals[_proposalId].stakes[YES]).div(maxRewardSeconds*10);
    }

    /**
     * @dev shouldBoost check if a proposal should be shifted to boosted phase.
     * @param _proposalId the ID of the proposal
     * @return bool true or false.
     */
    function shouldBoost(bytes32 _proposalId) public view returns(bool) {
        Proposal memory proposal = proposals[_proposalId];
        return (_score(_proposalId) > threshold(proposal.paramsHash, proposal.organizationId));
    }

    /**
     * @dev threshold return the organization's score threshold which required by
     * a proposal to shift to boosted state.
     * This threshold is dynamically set and it depend on the number of boosted proposal.
     * @param _organizationId the organization identifier
     * @param _paramsHash the organization parameters hash
     * @return uint256 organization's score threshold as real number.
     */
    function threshold(bytes32 _paramsHash, bytes32 _organizationId) public view returns(uint256) {
        uint256 power = orgBoostedProposalsCnt[_organizationId];
        Parameters storage params = parameters[_paramsHash];

        if (power > params.limitExponentValue) {
            power = params.limitExponentValue;
        }

        return params.thresholdConst.pow(power);
    }

  /**
   * @dev hashParameters returns a hash of the given parameters
   */
    function getParametersHash(
        uint[11] memory _params,//use array here due to stack too deep issue.
        address _voteOnBehalf
    )
        public
        pure
        returns(bytes32)
        {
        //double call to keccak256 to avoid deep stack issue when call with too many params.
        return keccak256(
            abi.encodePacked(
            keccak256(
            abi.encodePacked(
                _params[0],
                _params[1],
                _params[2],
                _params[3],
                _params[4],
                _params[5],
                _params[6],
                _params[7],
                _params[8],
                _params[9],
                _params[10])
            ),
            _voteOnBehalf
        ));
    }

    /**
      * @dev execute check if the proposal has been decided, and if so, execute the proposal
      * @param _proposalId the id of the proposal
      * @return bool true - the proposal has been executed
      *              false - otherwise.
     */
     // solhint-disable-next-line function-max-lines,code-complexity
    function _execute(bytes32 _proposalId) internal votable(_proposalId) returns(bool) {
        Proposal storage proposal = proposals[_proposalId];
        Parameters memory params = parameters[proposal.paramsHash];
        Proposal memory tmpProposal = proposal;
        uint256 totalReputation =
        VotingMachineCallbacksInterface(proposal.callbacks).getTotalReputationSupply(_proposalId);
        //first divide by 100 to prevent overflow
        uint256 executionBar = (totalReputation/100) * params.queuedVoteRequiredPercentage;
        ExecutionState executionState = ExecutionState.None;
        uint256 averageDownstakesOfBoosted;
        uint256 confidenceThreshold;

        if (proposal.votes[proposal.winningVote] > executionBar) {
         // someone crossed the absolute vote execution bar.
            if (proposal.state == ProposalState.Queued) {
                executionState = ExecutionState.QueueBarCrossed;
            } else if (proposal.state == ProposalState.PreBoosted) {
                executionState = ExecutionState.PreBoostedBarCrossed;
            } else {
                executionState = ExecutionState.BoostedBarCrossed;
            }
            proposal.state = ProposalState.Executed;
        } else {
            if (proposal.state == ProposalState.Queued) {
                // solhint-disable-next-line not-rely-on-time
                if ((now - proposal.times[0]) >= params.queuedVotePeriodLimit) {
                    proposal.state = ProposalState.ExpiredInQueue;
                    proposal.winningVote = NO;
                    executionState = ExecutionState.QueueTimeOut;
                } else {
                    confidenceThreshold = threshold(proposal.paramsHash, proposal.organizationId);
                    if (_score(_proposalId) > confidenceThreshold) {
                        //change proposal mode to PreBoosted mode.
                        proposal.state = ProposalState.PreBoosted;
                        // solhint-disable-next-line not-rely-on-time
                        proposal.times[2] = now;
                        proposal.confidenceThreshold = confidenceThreshold;
                    }
                }
            }

            if (proposal.state == ProposalState.PreBoosted) {
                confidenceThreshold = threshold(proposal.paramsHash, proposal.organizationId);
              // solhint-disable-next-line not-rely-on-time
                if ((now - proposal.times[2]) >= params.preBoostedVotePeriodLimit) {
                    if (_score(_proposalId) > confidenceThreshold) {
                        if (orgBoostedProposalsCnt[proposal.organizationId] < MAX_BOOSTED_PROPOSALS) {
                         //change proposal mode to Boosted mode.
                            proposal.state = ProposalState.Boosted;
                         // solhint-disable-next-line not-rely-on-time
                            proposal.times[1] = now;
                            orgBoostedProposalsCnt[proposal.organizationId]++;
                         //add a value to average -> average = average + ((value - average) / nbValues)
                            averageDownstakesOfBoosted = averagesDownstakesOfBoosted[proposal.organizationId];
                          // solium-disable-next-line indentation
                            averagesDownstakesOfBoosted[proposal.organizationId] =
                                uint256(int256(averageDownstakesOfBoosted) +
                                ((int256(proposal.stakes[NO])-int256(averageDownstakesOfBoosted))/
                                int256(orgBoostedProposalsCnt[proposal.organizationId])));
                        }
                    } else {
                        proposal.state = ProposalState.Queued;
                    }
                } else { //check the Confidence level is stable
                    uint256 proposalScore = _score(_proposalId);
                    if (proposalScore <= proposal.confidenceThreshold.min(confidenceThreshold)) {
                        proposal.state = ProposalState.Queued;
                    } else if (proposal.confidenceThreshold > proposalScore) {
                        proposal.confidenceThreshold = confidenceThreshold;
                        emit ConfidenceLevelChange(_proposalId, confidenceThreshold);
                    }
                }
            }
        }

        if ((proposal.state == ProposalState.Boosted) ||
            (proposal.state == ProposalState.QuietEndingPeriod)) {
            // solhint-disable-next-line not-rely-on-time
            if ((now - proposal.times[1]) >= proposal.currentBoostedVotePeriodLimit) {
                proposal.state = ProposalState.Executed;
                executionState = ExecutionState.BoostedTimeOut;
            }
        }

        if (executionState != ExecutionState.None) {
            if ((executionState == ExecutionState.BoostedTimeOut) ||
                (executionState == ExecutionState.BoostedBarCrossed)) {
                orgBoostedProposalsCnt[tmpProposal.organizationId] =
                orgBoostedProposalsCnt[tmpProposal.organizationId].sub(1);
                //remove a value from average = ((average * nbValues) - value) / (nbValues - 1);
                uint256 boostedProposals = orgBoostedProposalsCnt[tmpProposal.organizationId];
                if (boostedProposals == 0) {
                    averagesDownstakesOfBoosted[proposal.organizationId] = 0;
                } else {
                    averageDownstakesOfBoosted = averagesDownstakesOfBoosted[proposal.organizationId];
                    averagesDownstakesOfBoosted[proposal.organizationId] =
                    (averageDownstakesOfBoosted.mul(boostedProposals+1).sub(proposal.stakes[NO]))/boostedProposals;
                }
            }
            emit ExecuteProposal(
            _proposalId,
            organizations[proposal.organizationId],
            proposal.winningVote,
            totalReputation
            );
            emit GPExecuteProposal(_proposalId, executionState);
            ProposalExecuteInterface(proposal.callbacks).executeProposal(_proposalId, int(proposal.winningVote));
            proposal.daoBounty = proposal.daoBountyRemain;
        }
        if (tmpProposal.state != proposal.state) {
            emit StateChange(_proposalId, proposal.state);
        }
        return (executionState != ExecutionState.None);
    }

    /**
     * @dev staking function
     * @param _proposalId id of the proposal
     * @param _vote  NO(2) or YES(1).
     * @param _amount the betting amount
     * @return bool true - the proposal has been executed
     *              false - otherwise.
     */
    function _stake(bytes32 _proposalId, uint256 _vote, uint256 _amount, address _staker) internal returns(bool) {
        // 0 is not a valid vote.
        require(_vote <= NUM_OF_CHOICES && _vote > 0, "wrong vote value");
        require(_amount > 0, "staking amount should be >0");

        if (_execute(_proposalId)) {
            return true;
        }
        Proposal storage proposal = proposals[_proposalId];

        if ((proposal.state != ProposalState.PreBoosted) &&
            (proposal.state != ProposalState.Queued)) {
            return false;
        }

        // enable to increase stake only on the previous stake vote
        Staker storage staker = proposal.stakers[_staker];
        if ((staker.amount > 0) && (staker.vote != _vote)) {
            return false;
        }

        uint256 amount = _amount;
        require(stakingToken.transferFrom(_staker, address(this), amount), "fail transfer from staker");
        proposal.totalStakes = proposal.totalStakes.add(amount); //update totalRedeemableStakes
        staker.amount = staker.amount.add(amount);
        //This is to prevent average downstakes calculation overflow
        //Note that any how GEN cap is 100000000 ether.
        require(staker.amount <= 0x100000000000000000000000000000000, "staking amount is too high");
        require(proposal.totalStakes <= uint256(0x100000000000000000000000000000000).sub(proposal.daoBountyRemain),
                "total stakes is too high");

        if (_vote == YES) {
            staker.amount4Bounty = staker.amount4Bounty.add(amount);
        }
        staker.vote = _vote;

        proposal.stakes[_vote] = amount.add(proposal.stakes[_vote]);
        emit Stake(_proposalId, organizations[proposal.organizationId], _staker, _vote, _amount);
        return _execute(_proposalId);
    }

    /**
     * @dev Vote for a proposal, if the voter already voted, cancel the last vote and set a new one instead
     * @param _proposalId id of the proposal
     * @param _voter used in case the vote is cast for someone else
     * @param _vote a value between 0 to and the proposal's number of choices.
     * @param _rep how many reputation the voter would like to stake for this vote.
     *         if  _rep==0 so the voter full reputation will be use.
     * @return true in case of proposal execution otherwise false
     * throws if proposal is not open or if it has been executed
     * NB: executes the proposal if a decision has been reached
     */
     // solhint-disable-next-line function-max-lines,code-complexity
    function internalVote(bytes32 _proposalId, address _voter, uint256 _vote, uint256 _rep) internal returns(bool) {
        require(_vote <= NUM_OF_CHOICES && _vote > 0, "0 < _vote <= 2");
        if (_execute(_proposalId)) {
            return true;
        }

        Parameters memory params = parameters[proposals[_proposalId].paramsHash];
        Proposal storage proposal = proposals[_proposalId];

        // Check voter has enough reputation:
        uint256 reputation = VotingMachineCallbacksInterface(proposal.callbacks).reputationOf(_voter, _proposalId);
        require(reputation > 0, "_voter must have reputation");
        require(reputation >= _rep, "reputation >= _rep");
        uint256 rep = _rep;
        if (rep == 0) {
            rep = reputation;
        }
        // If this voter has already voted, return false.
        if (proposal.voters[_voter].reputation != 0) {
            return false;
        }
        // The voting itself:
        proposal.votes[_vote] = rep.add(proposal.votes[_vote]);
        //check if the current winningVote changed or there is a tie.
        //for the case there is a tie the current winningVote set to NO.
        if ((proposal.votes[_vote] > proposal.votes[proposal.winningVote]) ||
            ((proposal.votes[NO] == proposal.votes[proposal.winningVote]) &&
            proposal.winningVote == YES)) {
            if (proposal.state == ProposalState.Boosted &&
            // solhint-disable-next-line not-rely-on-time
                ((now - proposal.times[1]) >= (params.boostedVotePeriodLimit - params.quietEndingPeriod))||
                proposal.state == ProposalState.QuietEndingPeriod) {
                //quietEndingPeriod
                if (proposal.state != ProposalState.QuietEndingPeriod) {
                    proposal.currentBoostedVotePeriodLimit = params.quietEndingPeriod;
                    proposal.state = ProposalState.QuietEndingPeriod;
                    emit StateChange(_proposalId, proposal.state);
                }
                // solhint-disable-next-line not-rely-on-time
                proposal.times[1] = now;
            }
            proposal.winningVote = _vote;
        }
        proposal.voters[_voter] = Voter({
            reputation: rep,
            vote: _vote,
            preBoosted:((proposal.state == ProposalState.PreBoosted) || (proposal.state == ProposalState.Queued))
        });
        if ((proposal.state == ProposalState.PreBoosted) || (proposal.state == ProposalState.Queued)) {
            proposal.preBoostedVotes[_vote] = rep.add(proposal.preBoostedVotes[_vote]);
            uint256 reputationDeposit = (params.votersReputationLossRatio.mul(rep))/100;
            VotingMachineCallbacksInterface(proposal.callbacks).burnReputation(reputationDeposit, _voter, _proposalId);
        }
        emit VoteProposal(_proposalId, organizations[proposal.organizationId], _voter, _vote, rep);
        return _execute(_proposalId);
    }

    /**
     * @dev _score return the proposal score (Confidence level)
     * For dual choice proposal S = (S+)/(S-)
     * @param _proposalId the ID of the proposal
     * @return uint256 proposal score as real number.
     */
    function _score(bytes32 _proposalId) internal view returns(uint256) {
        Proposal storage proposal = proposals[_proposalId];
        //proposal.stakes[NO] cannot be zero as the dao downstake > 0 for each proposal.
        return uint216(proposal.stakes[YES]).fraction(uint216(proposal.stakes[NO]));
    }

    /**
      * @dev _isVotable check if the proposal is votable
      * @param _proposalId the ID of the proposal
      * @return bool true or false
    */
    function _isVotable(bytes32 _proposalId) internal view returns(bool) {
        ProposalState pState = proposals[_proposalId].state;
        return ((pState == ProposalState.PreBoosted)||
                (pState == ProposalState.Boosted)||
                (pState == ProposalState.QuietEndingPeriod)||
                (pState == ProposalState.Queued)
        );
    }
}
