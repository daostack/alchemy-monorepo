pragma solidity ^0.4.24;

import "../VotingMachines/GenesisProtocolCallbacksInterface.sol";
import "../VotingMachines/GenesisProtocol.sol";
import "../Reputation.sol";


contract GenesisProtocolCallbacksMock is GenesisProtocolCallbacksInterface {

    Reputation public reputation;
    ERC827Token public stakingToken;
    GenesisProtocol genesisProtocol;

    /**
     * @dev Constructor
     */
    constructor(Reputation _reputation,ERC827Token _stakingToken,GenesisProtocol _genesisProtocol) public
    {
        reputation = _reputation;
        stakingToken = _stakingToken;
        genesisProtocol = _genesisProtocol;
    }

    function getTotalReputationSupply(bytes32 ) external returns(uint256) {
        return reputation.totalSupply();
    }

    function mintReputation(uint _amount,address _beneficiary,bytes32) external returns(bool) {
        return reputation.mint(_beneficiary,_amount);
    }

    function burnReputation(uint _amount,address _beneficiary,bytes32) external returns(bool) {
        return reputation.burn(_beneficiary,_amount);
    }

    function reputationOf(address _owner,bytes32) external returns(uint) {
        return reputation.reputationOf(_owner);
    }

    function stakingTokenTransfer(address _beneficiary,uint _amount,bytes32) external returns(bool) {
        return stakingToken.transfer(_beneficiary,_amount);
    }

    function setParameters(uint[14] _params) external returns(bytes32) {
        return genesisProtocol.setParameters(_params);
    }

    function execute(bytes32 _proposalId,int _decision,ExecutableInterface _executable) external returns(bool) {
        return  _executable.execute(_proposalId, 0, _decision);
    }

}
