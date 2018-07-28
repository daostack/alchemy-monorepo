pragma solidity ^0.4.24;

import "./ExecutableInterface.sol";

interface GenesisProtocolCallbacksInterface {
    function getTotalReputationSupply(bytes32 _proposalId) external returns(uint256);
    function mintReputation(uint _amount,address _beneficiary,bytes32 _proposalId) external returns(bool);
    function burnReputation(uint _amount,address _owner,bytes32 _proposalId) external returns(bool);
    function reputationOf(address _owner,bytes32 _proposalId) view external returns(uint);
    function stakingTokenTransfer(address _beneficiary,uint _amount,bytes32 _proposalId) external returns(bool);
    function executeProposal(bytes32 _proposalId,int _decision,ExecutableInterface _executable) external returns(bool);
}
