pragma solidity 0.5.17;
/*
    A contract you can inherit from that has some useful Events to print statements.
*/


contract Debug {
    event LogAddress(address _msg);
    event LogInt(int _msg);
    event LogString(string _msg);
    event LogUint(uint256 _msg);
    event LogBytes(bytes _msg);
    event LogBytes32(bytes32 _msg);
    event LogBool(bool _msg);
}
