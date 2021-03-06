pragma solidity 0.5.17;

import "@daostack/infra/contracts/votingMachines/GenesisProtocolInterface.sol";
import "../schemes/Competition.sol";
import "../schemes/ContributionRewardExt.sol";

/**
 * @title CompetitionFactory
 */
contract CompetitionFactory {
    uint8 public constant CUSTOM = 0;
    uint8 public constant FAST = 1;
    uint8 public constant NORMAL = 2;
    uint8 public constant SLOW = 3;

    event NewCompetition(address competition, address contributionRewardExt);

    function createCompetition(
        Avatar _avatar,
        IntVoteInterface _votingMachine,
        uint8 _voteParamsType,
        uint256[11] memory _votingParams,
        address _voteOnBehalf
    ) public returns(address, address) {
        require(_voteParamsType < 4, "Vote params type specified does not exist");
        ContributionRewardExt contributionRewardExt = new ContributionRewardExt();
        Competition competition = new Competition();
        competition.initialize(address(contributionRewardExt));
        
        uint256[11] memory voteParams;
        if (_voteParamsType == CUSTOM) {
           // Custom params hash
            voteParams = _votingParams;
        } else {
            voteParams = getDefaultVoteParams(_voteParamsType);
        }

        bytes32 voteParamsHash = GenesisProtocolInterface(address(_votingMachine))
                                    .setParameters(voteParams, _voteOnBehalf);

        contributionRewardExt.initialize(
            _avatar, _votingMachine, voteParamsHash, address(competition)
        );

        emit NewCompetition(address(competition), address(contributionRewardExt));
        return (address(competition), address(contributionRewardExt));
    }

    function getDefaultVoteParams(uint8 _voteParamsType) private pure returns(uint256[11] memory voteParams) {
        if (_voteParamsType == FAST) {
            // Fast params hash
            voteParams = [
                uint256(50),
                uint256(604800),
                uint256(129600),
                uint256(43200),
                uint256(1200),
                uint256(86400),
                uint256(10000000000000000000),
                uint256(1),
                uint256(50000000000000000000),
                uint256(10),
                uint256(0)
            ];
        } else if (_voteParamsType == NORMAL) {
            // Normal params hash
            voteParams = [
                uint256(50),
                uint256(2592000),
                uint256(345600),
                uint256(86400),
                uint256(1200),
                uint256(172800),
                uint256(50000000000000000000),
                uint256(4),
                uint256(150000000000000000000),
                uint256(10),
                uint256(0)
            ];
        } else if (_voteParamsType == SLOW) {
            // Slow params hash
            voteParams = [
                uint256(50),
                uint256(5184000),
                uint256(691200),
                uint256(172800),
                uint256(1500),
                uint256(345600),
                uint256(200000000000000000000),
                uint256(4),
                uint256(500000000000000000000),
                uint256(10),
                uint256(0)
            ];
        }
    }
}
