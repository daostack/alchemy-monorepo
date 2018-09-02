pragma solidity ^0.4.24;

import "../VotingMachines/GenesisProtocolCallbacksInterface.sol";
import "../VotingMachines/GenesisProtocol.sol";
import "../Reputation.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract GenesisProtocolCallbacksMock is GenesisProtocolCallbacksInterface,Ownable {

    Reputation public reputation;
    StandardToken public stakingToken;
    GenesisProtocol genesisProtocol;
    mapping (bytes32=>uint) proposalsBlockNumbers;

    event NewProposal(bytes32 indexed _proposalId, address indexed _organization, uint _numOfChoices, address _proposer, bytes32 _paramsHash);


    /**
     * @dev Constructor
     */
    constructor(Reputation _reputation,StandardToken _stakingToken,GenesisProtocol _genesisProtocol) public
    {
        reputation = _reputation;
        stakingToken = _stakingToken;
        genesisProtocol = _genesisProtocol;
        transferOwnership(genesisProtocol);
    }

    function getTotalReputationSupply(bytes32 _proposalId) external view returns(uint256) {
        return reputation.totalSupplyAt(proposalsBlockNumbers[_proposalId]);
    }

    function mintReputation(uint _amount,address _beneficiary,bytes32)
    external
    onlyOwner
    returns(bool)
    {
        return reputation.mint(_beneficiary,_amount);
    }

    function burnReputation(uint _amount,address _beneficiary,bytes32)
    external
    onlyOwner
    returns(bool)
    {
        return reputation.burn(_beneficiary,_amount);
    }

    function reputationOf(address _owner,bytes32 _proposalId) view external returns(uint) {
        return reputation.balanceOfAt(_owner,proposalsBlockNumbers[_proposalId]);
    }

    function stakingTokenTransfer(address _beneficiary,uint _amount,bytes32)
    external
    onlyOwner
    returns(bool)
    {
        return stakingToken.transfer(_beneficiary,_amount);
    }

    function setParameters(uint[14] _params,address _voteOnBehalf) external returns(bytes32) {
        return genesisProtocol.setParameters(_params,_voteOnBehalf);
    }

    function executeProposal(bytes32 _proposalId,int _decision,ExecutableInterface _executable) external returns(bool) {
        return  _executable.execute(_proposalId, 0, _decision);
    }

    function propose(uint _numOfChoices, bytes32 _paramsHash, address , ExecutableInterface _executable,address _proposer)
    external
    returns
    (bytes32)
    {
        bytes32 proposalId = genesisProtocol.propose(_numOfChoices,_paramsHash,0,_executable,_proposer);
        emit NewProposal(proposalId, this, _numOfChoices, _proposer, _paramsHash);

        return proposalId;
    }

    //this function is used only for testing purpose on this mock contract
    function burnReputationTest(uint _amount,address _beneficiary,bytes32)
    external
    returns(bool)
    {
        return reputation.burn(_beneficiary,_amount);
    }

    function setProposal(bytes32 _proposalId) external returns(bool) {
        proposalsBlockNumbers[_proposalId] = block.number;
    }

}
