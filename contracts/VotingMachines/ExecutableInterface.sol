pragma solidity ^0.4.24;


contract ExecutableInterface {
    function execute(bytes32 _proposalId, address _organization, int _param) public returns(bool);
}
