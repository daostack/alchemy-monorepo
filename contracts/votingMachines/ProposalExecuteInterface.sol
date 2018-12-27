pragma solidity ^0.5.2;

interface ProposalExecuteInterface {
    function executeProposal(bytes32 _proposalId, int _decision) external returns(bool);
}
