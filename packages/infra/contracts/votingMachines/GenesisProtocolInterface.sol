pragma solidity 0.5.17;


contract GenesisProtocolInterface {
    function setParameters(
        uint[11] calldata _params, //use array here due to stack too deep issue.
        address _voteOnBehalf
    )
    external
    returns(bytes32);
}
