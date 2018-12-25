pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

interface VotingMachineCallbacksInterface {
    function getTotalReputationSupply(bytes32 _proposalId) external view returns(uint256);
    function mintReputation(uint256 _amount,address _beneficiary,bytes32 _proposalId) external returns(bool);
    function burnReputation(uint256 _amount,address _owner,bytes32 _proposalId) external returns(bool);
    function reputationOf(address _owner,bytes32 _proposalId) external view returns(uint256);
    function stakingTokenTransfer(ERC20 _stakingToken,address _beneficiary,uint256 _amount,bytes32 _proposalId) external returns(bool);
    function balanceOfStakingToken(ERC20 _stakingToken,bytes32 _proposalId) external view returns(uint256);
}
