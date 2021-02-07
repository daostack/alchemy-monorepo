pragma solidity 0.5.17;

import "./ERC827.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


/**
 * @title ERC827, an extension of IERC20 token standard
 *
 * @dev Implementation the ERC827, following the IERC20 standard with extra
 * methods to transfer value and data and execute calls in transfers and
 * approvals. Uses OpenZeppelin IERC20.
 */
contract ERC827Token is ERC20, ERC827 {

  /**
   * @dev Addition to IERC20 token methods. It allows to
   * approve the transfer of value and execute a call with the sent data.
   * Beware that changing an allowance with this method brings the risk that
   * someone may use both the old and the new allowance by unfortunate
   * transaction ordering. One possible solution to mitigate this race condition
   * is to first reduce the spender's allowance to 0 and set the desired value
   * afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender The address that will spend the funds.
   * @param _value The amount of tokens to be spent.
   * @param _data ABI-encoded contract call to call `_spender` address.
   * @return true if the call function was executed successfully
   */
    function approveAndCall(
        address _spender,
        uint256 _value,
        bytes memory _data
    )
    public
    payable
    returns (bool)
    {
        require(_spender != address(this));

        super.approve(_spender, _value);

        // solhint-disable-next-line avoid-call-value
        (bool success,) = _spender.call.value(msg.value)(_data);
        require(success);

        return true;
    }

  /**
   * @dev Addition to IERC20 token methods. Transfer tokens to a specified
   * address and execute a call with the sent data on the same transaction
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amout of tokens to be transfered
   * @param _data ABI-encoded contract call to call `_to` address.
   * @return true if the call function was executed successfully
   */
    function transferAndCall(
        address _to,
        uint256 _value,
        bytes memory _data
    )
    public
    payable
    returns (bool)
    {
        require(_to != address(this));

        super.transfer(_to, _value);

        // solhint-disable-next-line avoid-call-value
        (bool success,) = _to.call.value(msg.value)(_data);
        require(success);
        return true;
    }

  /**
   * @dev Addition to IERC20 token methods. Transfer tokens from one address to
   * another and make a contract call on the same transaction
   * @param _from The address which you want to send tokens from
   * @param _to The address which you want to transfer to
   * @param _value The amout of tokens to be transferred
   * @param _data ABI-encoded contract call to call `_to` address.
   * @return true if the call function was executed successfully
   */
    function transferFromAndCall(
        address _from,
        address _to,
        uint256 _value,
        bytes memory _data
    )
    public payable returns (bool)
    {
        require(_to != address(this));

        super.transferFrom(_from, _to, _value);

        // solhint-disable-next-line avoid-call-value
        (bool success,) = _to.call.value(msg.value)(_data);
        require(success);
        return true;
    }

  /**
   * @dev Addition to IERC20 methods. Increase the amount of tokens that
   * an owner allowed to a spender and execute a call with the sent data.
   * approve should be called when allowed[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _addedValue The amount of tokens to increase the allowance by.
   * @param _data ABI-encoded contract call to call `_spender` address.
   */
    function increaseApprovalAndCall(
        address _spender,
        uint256 _addedValue,
        bytes memory _data
    )
    public
    payable
    returns (bool)
    {
        require(_spender != address(this));

        super.increaseAllowance(_spender, _addedValue);

        // solhint-disable-next-line avoid-call-value
        (bool success,) = _spender.call.value(msg.value)(_data);
        require(success);

        return true;
    }

  /**
   * @dev Addition to IERC20 methods. Decrease the amount of tokens that
   * an owner allowed to a spender and execute a call with the sent data.
   * approve should be called when allowed[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _subtractedValue The amount of tokens to decrease the allowance by.
   * @param _data ABI-encoded contract call to call `_spender` address.
   */
    function decreaseApprovalAndCall(
        address _spender,
        uint256 _subtractedValue,
        bytes memory _data
    )
    public
    payable
    returns (bool)
    {
        require(_spender != address(this));

        super.decreaseAllowance(_spender, _subtractedValue);

        // solhint-disable-next-line avoid-call-value
        (bool success,) = _spender.call.value(msg.value)(_data);
        require(success);

        return true;
    }
}
