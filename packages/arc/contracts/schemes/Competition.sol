pragma solidity 0.5.17;

import "./ContributionRewardExt.sol";


contract Competition {
    using SafeMath for uint256;

    event NewCompetitionProposal(
        bytes32 indexed _proposalId,
        uint256 _numberOfWinners,
        uint256[] _rewardSplit,
        uint256 _startTime,
        uint256 _votingStartTime,
        uint256 _suggestionsEndTime,
        uint256 _endTime,
        uint256 _maxNumberOfVotesPerVoter,
        address payable _contributionRewardExt, //address of the contract to redeem from.
        address _admin
    );

    event Redeem(
        bytes32 indexed _proposalId,
        uint256 indexed _suggestionId,
        uint256 _rewardPercentage
    );

    event NewSuggestion(
        bytes32 indexed _proposalId,
        uint256 indexed _suggestionId,
        string _descriptionHash,
        address payable indexed _beneficiary
    );

    event NewVote(
        bytes32 indexed _proposalId,
        uint256 indexed _suggestionId,
        address indexed _voter,
        uint256 _reputation
    );

    event SnapshotBlock(
        bytes32 indexed _proposalId,
        uint256 _snapshotBlock
    );

    // A struct holding the data for a competition proposal
    struct Proposal {
        uint256 numberOfWinners;
        uint256[] rewardSplit;
        uint256 startTime;
        uint256 votingStartTime;
        uint256 suggestionsEndTime;
        uint256 endTime;
        uint256 maxNumberOfVotesPerVoter;
        address payable contributionRewardExt;
        uint256 snapshotBlock;
        uint256 reputationReward;
        uint256 ethReward;
        uint256 nativeTokenReward;
        uint256 externalTokenReward;
        uint256[] topSuggestions;
        address admin;
        //mapping from suggestions totalVotes to the number of suggestions with the same totalVotes.
        mapping(uint256=>uint256) suggestionsPerVote;
        mapping(address=>uint256) votesPerVoter;
    }

    struct Suggestion {
        uint256 totalVotes;
        bytes32 proposalId;
        address payable beneficiary;
        mapping(address=>uint256) votes;
    }

    //mapping from proposalID to Proposal
    mapping(bytes32=>Proposal) public proposals;
    //mapping from suggestionId to Suggestion
    mapping(uint256=>Suggestion) public suggestions;
    uint256 public suggestionsCounter;
    address payable public contributionRewardExt; //address of the contract to redeem from.
    uint256 constant public REDEMPTION_PERIOD = 7776000; //90 days
    uint256 constant public MAX_NUMBER_OF_WINNERS = 100;

    /**
     * @dev initialize
     * @param _contributionRewardExt the contributionRewardExt scheme which
     *        manage and allocate the rewards for the competition.
     */
    function initialize(address payable _contributionRewardExt) external {
        require(contributionRewardExt == address(0), "can be called only one time");
        require(_contributionRewardExt != address(0), "contributionRewardExt cannot be zero");
        contributionRewardExt = _contributionRewardExt;
    }

    /**
    * @dev Submit a competion proposal
    * @param _descriptionHash A hash of the proposal's description
    * @param _reputationChange - Amount of reputation change requested.
    * @param _rewards rewards array:
    *         rewards[0] - Amount of tokens requested per period
    *         rewards[1] - Amount of ETH requested per period
    *         rewards[2] - Amount of external tokens requested per period
    * @param _externalToken Address of external token, if reward is requested there
    * @param _rewardSplit an array of precentages which specify how to split the rewards
    *         between the winning suggestions
    * @param _competitionParams competition parameters :
    *         _competitionParams[0] - competition startTime
    *         _competitionParams[1] - _votingStartTime competition voting start time
    *         _competitionParams[2] - _endTime competition end time
    *         _competitionParams[3] - _maxNumberOfVotesPerVoter on how many suggestions a voter can vote
    *         _competitionParams[4] - _suggestionsEndTime suggestion submission end time
    *        _proposerIsAdmin -
    *          true -  proposer is an admin.
    *          false no admin.
    *          if admin is set, so only admin can suggest on this proposal.
    * @return proposalId the proposal id.
    */
    function proposeCompetition(
            string calldata _descriptionHash,
            int256 _reputationChange,
            uint[3] calldata _rewards,
            IERC20 _externalToken,
            uint256[] calldata _rewardSplit,
            uint256[5] calldata _competitionParams,
            bool _proposerIsAdmin
    )
    external
    // solhint-disable-next-line function-max-lines
    returns(bytes32 proposalId) {
        uint256 numberOfWinners = _rewardSplit.length;
        uint256 startTime = _competitionParams[0];
        if (startTime == 0) {
          // solhint-disable-next-line not-rely-on-time
            startTime = now;
        }
        // solhint-disable-next-line not-rely-on-time
        require(startTime >= now, "startTime should be greater than proposing time");
        require(numberOfWinners <= MAX_NUMBER_OF_WINNERS, "number of winners greater than max allowed");
        require(_competitionParams[1] < _competitionParams[2], "voting start time greater than end time");
        require(_competitionParams[1] >= startTime, "voting start time smaller than start time");
        require(_competitionParams[3] > 0, "maxNumberOfVotesPerVoter should be greater than 0");
        require(_competitionParams[4] <= _competitionParams[2],
        "suggestionsEndTime should be earlier than proposal end time");
        require(_competitionParams[4] > startTime, "suggestionsEndTime should be later than proposal start time");
        if (_rewards[2] > 0) {
            require(_externalToken != ERC20(0), "extenal token cannot be zero");
        }
        require(_reputationChange >= 0, "negative reputation change is not allowed for a competition");
        uint256 totalRewardSplit;
        for (uint256 i = 0; i < numberOfWinners; i++) {
            totalRewardSplit = totalRewardSplit.add(_rewardSplit[i]);
        }
        require(totalRewardSplit == 100, "total rewards split is not 100%");
        proposalId = ContributionRewardExt(contributionRewardExt).proposeContributionReward(
                _descriptionHash, _reputationChange, _rewards, _externalToken, contributionRewardExt, msg.sender);
        proposals[proposalId].numberOfWinners = numberOfWinners;
        proposals[proposalId].rewardSplit = _rewardSplit;
        proposals[proposalId].startTime = startTime;
        proposals[proposalId].votingStartTime = _competitionParams[1];
        proposals[proposalId].endTime = _competitionParams[2];
        proposals[proposalId].maxNumberOfVotesPerVoter = _competitionParams[3];
        proposals[proposalId].suggestionsEndTime = _competitionParams[4];
        proposals[proposalId].reputationReward = uint256(_reputationChange);
        proposals[proposalId].nativeTokenReward = _rewards[0];
        proposals[proposalId].ethReward = _rewards[1];
        proposals[proposalId].externalTokenReward = _rewards[2];
        proposals[proposalId].snapshotBlock = 0;
        if (_proposerIsAdmin) {
            proposals[proposalId].admin = msg.sender;
        }
        emit NewCompetitionProposal(
            proposalId,
            numberOfWinners,
            proposals[proposalId].rewardSplit,
            startTime,
            proposals[proposalId].votingStartTime,
            proposals[proposalId].suggestionsEndTime,
            proposals[proposalId].endTime,
            proposals[proposalId].maxNumberOfVotesPerVoter,
            contributionRewardExt,
            proposals[proposalId].admin
        );
    }

    /**
    * @dev submit a competion suggestion
    * @param _proposalId the proposal id this suggestion is referring to.
    * @param _descriptionHash a descriptionHash of the suggestion.
    * @param _beneficiary the beneficiary of this suggestion.
    * @return suggestionId the suggestionId.
    */
    function suggest(
            bytes32 _proposalId,
            string calldata _descriptionHash,
            address payable _beneficiary
    )
    external
    returns(uint256)
    {
        if (proposals[_proposalId].admin != address(0)) {
            require(proposals[_proposalId].admin == msg.sender, "only admin can suggest");
        }
        // solhint-disable-next-line not-rely-on-time
        require(proposals[_proposalId].startTime <= now, "competition not started yet");
        // solhint-disable-next-line not-rely-on-time
        require(proposals[_proposalId].suggestionsEndTime > now, "suggestions submission time is over");
        suggestionsCounter = suggestionsCounter.add(1);
        suggestions[suggestionsCounter].proposalId = _proposalId;
        address payable beneficiary;
        if (_beneficiary == address(0)) {
            beneficiary = msg.sender;
        } else {
            beneficiary = _beneficiary;
        }
        suggestions[suggestionsCounter].beneficiary = beneficiary;
        emit NewSuggestion(_proposalId, suggestionsCounter, _descriptionHash, beneficiary);
        return suggestionsCounter;
    }

    /**
    * @dev vote on a suggestion
    * @param _suggestionId suggestionId
    * @return bool
    */
    function vote(uint256 _suggestionId)
    external
    returns(bool)
    {
        bytes32 proposalId = suggestions[_suggestionId].proposalId;
        require(proposalId != bytes32(0), "suggestion does not exist");
        setSnapshotBlock(proposalId);
        Avatar avatar = ContributionRewardExt(contributionRewardExt).avatar();
        uint256 reputation = avatar.nativeReputation().balanceOfAt(msg.sender, proposals[proposalId].snapshotBlock);
        require(reputation > 0, "voter had no reputation when snapshot was taken");
        Proposal storage proposal = proposals[proposalId];
        // solhint-disable-next-line not-rely-on-time
        require(proposal.endTime > now, "competition ended");
        Suggestion storage suggestion = suggestions[_suggestionId];
        require(suggestion.votes[msg.sender] == 0, "already voted on this suggestion");
        require(proposal.votesPerVoter[msg.sender] < proposal.maxNumberOfVotesPerVoter,
        "exceed number of votes allowed");
        proposal.votesPerVoter[msg.sender] = proposal.votesPerVoter[msg.sender].add(1);
        if (suggestion.totalVotes > 0) {
            proposal.suggestionsPerVote[suggestion.totalVotes] =
            proposal.suggestionsPerVote[suggestion.totalVotes].sub(1);
        }
        suggestion.totalVotes = suggestion.totalVotes.add(reputation);
        proposal.suggestionsPerVote[suggestion.totalVotes] = proposal.suggestionsPerVote[suggestion.totalVotes].add(1);
        suggestion.votes[msg.sender] = reputation;
        refreshTopSuggestions(proposalId, _suggestionId);
        emit NewVote(proposalId, _suggestionId, msg.sender, reputation);
        return true;
    }

    /**
    * @dev setSnapshotBlock set the block for the reputaion snapshot
    * this function is public in order to externaly set snapshot block regardless of the first voting event.
    * @param _proposalId the proposal id
    */
    function setSnapshotBlock(bytes32 _proposalId) public {
        // solhint-disable-next-line not-rely-on-time
        require(proposals[_proposalId].votingStartTime < now, "voting period not started yet");
        require(proposals[_proposalId].maxNumberOfVotesPerVoter > 0, "proposal does not exist");
        if (proposals[_proposalId].snapshotBlock == 0) {
            proposals[_proposalId].snapshotBlock = block.number;
            emit SnapshotBlock(_proposalId, block.number);
        }
    }

    /**
    * @dev sendLeftOverFund send leftover funds back to the dao.
    * @param _proposalId the proposal id
    */
    function sendLeftOverFunds(bytes32 _proposalId) public {
        // solhint-disable-next-line not-rely-on-time
        require(proposals[_proposalId].endTime.add(REDEMPTION_PERIOD) < now, "redemption period is still on");
        require(proposals[_proposalId].maxNumberOfVotesPerVoter > 0, "proposal does not exist");
        require(_proposalId != bytes32(0), "proposalId is zero");

        (, , , , , ,
        uint256 nativeTokenRewardLeft, ,
        uint256 ethRewardLeft,
        uint256 externalTokenRewardLeft,)
        = ContributionRewardExt(contributionRewardExt).organizationProposals(_proposalId);

        Avatar avatar = ContributionRewardExt(contributionRewardExt).avatar();

        ContributionRewardExt(contributionRewardExt).redeemExternalTokenByRewarder(
        _proposalId, address(avatar), externalTokenRewardLeft);

        ContributionRewardExt(contributionRewardExt).redeemEtherByRewarder(
        _proposalId, address(avatar), ethRewardLeft);

        ContributionRewardExt(contributionRewardExt).redeemNativeTokenByRewarder(
        _proposalId, address(avatar), nativeTokenRewardLeft);
    }

    /**
    * @dev redeem a winning suggestion reward
    * @param _suggestionId suggestionId
    */
    function redeem(uint256 _suggestionId) public {
        bytes32 proposalId = suggestions[_suggestionId].proposalId;
        require(proposalId != bytes32(0), "proposalId is zero");
        Proposal storage proposal = proposals[proposalId];
        require(_suggestionId > 0, "suggestionId is zero");
        // solhint-disable-next-line not-rely-on-time
        require(proposal.endTime < now, "competition is still on");
        // solhint-disable-next-line not-rely-on-time
        require(proposal.endTime.add(REDEMPTION_PERIOD) > now, "redemption period is over");
        require(proposal.maxNumberOfVotesPerVoter > 0, "proposal does not exist");
        require(suggestions[_suggestionId].beneficiary != address(0),
        "suggestion was already redeemed");
        address payable beneficiary = suggestions[_suggestionId].beneficiary;
        uint256 orderIndex = getOrderedIndexOfSuggestion(_suggestionId);
        require(orderIndex < proposal.topSuggestions.length, "suggestion is not in winners list");
        suggestions[_suggestionId].beneficiary = address(0);
        uint256 rewardPercentage = 0;
        uint256 numberOfTieSuggestions = proposal.suggestionsPerVote[suggestions[_suggestionId].totalVotes];
        uint256 j;
        //calc the reward percentage for this suggestion
        for (j = orderIndex; j < (orderIndex+numberOfTieSuggestions) && j < proposal.numberOfWinners; j++) {
            rewardPercentage = rewardPercentage.add(proposal.rewardSplit[j]);
        }
        rewardPercentage = rewardPercentage.div(numberOfTieSuggestions);
        uint256 rewardPercentageLeft = 0;
        if (proposal.topSuggestions.length < proposal.numberOfWinners) {
          //if there are less winners than the proposal number of winners so divide the pre allocated
          //left reward equally between the winners
            for (j = proposal.topSuggestions.length; j < proposal.numberOfWinners; j++) {
                rewardPercentageLeft = rewardPercentageLeft.add(proposal.rewardSplit[j]);
            }
            rewardPercentage =
            rewardPercentage.add(rewardPercentageLeft.div(proposal.topSuggestions.length));
        }
        uint256 amount;
        amount = proposal.externalTokenReward.mul(rewardPercentage).div(100);
        ContributionRewardExt(contributionRewardExt).redeemExternalTokenByRewarder(
        proposalId, beneficiary, amount);

        amount = proposal.reputationReward.mul(rewardPercentage).div(100);
        ContributionRewardExt(contributionRewardExt).redeemReputationByRewarder(
        proposalId, beneficiary, amount);

        amount = proposal.ethReward.mul(rewardPercentage).div(100);
        ContributionRewardExt(contributionRewardExt).redeemEtherByRewarder(
        proposalId, beneficiary, amount);

        amount = proposal.nativeTokenReward.mul(rewardPercentage).div(100);
        ContributionRewardExt(contributionRewardExt).redeemNativeTokenByRewarder(
        proposalId, beneficiary, amount);
        emit Redeem(proposalId, _suggestionId, rewardPercentage);
    }

    /**
    * @dev getOrderedIndexOfSuggestion return the index of specific suggestion in the winners list.
    * for the case when the suggestion is NOT in the winners list,
    * this method will return topSuggestions.length
    * @param _suggestionId suggestion id
    */
    function getOrderedIndexOfSuggestion(uint256 _suggestionId)
    public
    view
    returns(uint256 index) {
        bytes32 proposalId = suggestions[_suggestionId].proposalId;
        require(proposalId != bytes32(0), "suggestion does not exist");
        uint256[] memory topSuggestions = proposals[proposalId].topSuggestions;
        /** get how many elements are greater than a given element*/
        for (uint256 i = 0; i < topSuggestions.length; i++) {
            if (suggestions[topSuggestions[i]].totalVotes > suggestions[_suggestionId].totalVotes) {
                index++;
            }
        }
    }

    /**
    * @dev refreshTopSuggestions this function maintain a winners list array.
    * it will check if the given suggestion is among the top suggestions, and if so,
    * update the list of top suggestions
    * @param _proposalId proposal id
    * @param _suggestionId suggestion id
    */
    // solhint-disable-next-line code-complexity
    function refreshTopSuggestions(bytes32 _proposalId, uint256 _suggestionId) private {
        uint256[] storage topSuggestions = proposals[_proposalId].topSuggestions;
        uint256 topSuggestionsLength = topSuggestions.length;
        uint256 i;
        if (topSuggestionsLength < proposals[_proposalId].numberOfWinners) {
            for (i = 0; i < topSuggestionsLength; i++) {
                if (topSuggestions[i] == _suggestionId) {
                    return;
                }
            }
            topSuggestions.push(_suggestionId);
        } else {
         /** get the index of the smallest element **/
            uint256 smallest = 0;
            for (i = 0; i < proposals[_proposalId].numberOfWinners; i++) {
                if (suggestions[topSuggestions[i]].totalVotes <
                    suggestions[topSuggestions[smallest]].totalVotes) {
                    smallest = i;
                } else if (topSuggestions[i] == _suggestionId) {
                  //the suggestion is already in the topSuggestions list
                    return;
                }
            }

            if (suggestions[topSuggestions[smallest]].totalVotes < suggestions[_suggestionId].totalVotes) {
                topSuggestions[smallest] = _suggestionId;
            }
        }
    }

}
