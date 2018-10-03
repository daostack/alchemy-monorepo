pragma solidity ^0.4.24;

interface ProposalExecuteInterface {
    function executeProposal(bytes32 _proposalId,int _decision) external returns(bool);
}
