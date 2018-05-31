pragma solidity ^0.4.24;



interface GenesisProtocolCallbacksInterface {
    function getTotalReputationSupply() external returns(uint256);
    function mintReputation(uint _amount,address _beneficiary) external returns(bool);
    function burnReputation(uint _amount,address _owner) external returns(bool);
    function reputationOf(address _owner) external returns(uint);
    function stakingTokenTransfer(address _beneficiary,uint _amount) external returns(bool);
}
