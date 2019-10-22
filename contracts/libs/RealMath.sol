pragma solidity ^0.5.11;

/**
 * RealMath: fixed-point math library, based on fractional and integer parts.
 * Using uint256 as real216x40, which isn't in Solidity yet.
 * Internally uses the wider uint256 for some math.
 *
 * Note that for addition, subtraction, and mod (%), you should just use the
 * built-in Solidity operators. Functions for these operations are not provided.
 *
 */


library RealMath {

    /**
     * How many total bits are there?
     */
    uint256 constant private REAL_BITS = 256;

    /**
     * How many fractional bits are there?
     */
    uint256 constant private REAL_FBITS = 40;

    /**
     * What's the first non-fractional bit
     */
    uint256 constant private REAL_ONE = uint256(1) << REAL_FBITS;

    /**
     * Raise a real number to any positive integer power
     */
    function pow(uint256 realBase, uint256 exponent) internal pure returns (uint256) {

        uint256 tempRealBase = realBase;
        uint256 tempExponent = exponent;

        // Start with the 0th power
        uint256 realResult = REAL_ONE;
        while (tempExponent != 0) {
            // While there are still bits set
            if ((tempExponent & 0x1) == 0x1) {
                // If the low bit is set, multiply in the (many-times-squared) base
                realResult = mul(realResult, tempRealBase);
            }
                // Shift off the low bit
            tempExponent = tempExponent >> 1;
            if (tempExponent != 0) {
                // Do the squaring
                tempRealBase = mul(tempRealBase, tempRealBase);
            }
        }

        // Return the final result.
        return realResult;
    }

    /**
     * Create a real from a rational fraction.
     */
    function fraction(uint216 numerator, uint216 denominator) internal pure returns (uint256) {
        return div(uint256(numerator) * REAL_ONE, uint256(denominator) * REAL_ONE);
    }

    /**
     * Multiply one real by another. Truncates overflows.
     */
    function mul(uint256 realA, uint256 realB) private pure returns (uint256) {
        // When multiplying fixed point in x.y and z.w formats we get (x+z).(y+w) format.
        // So we just have to clip off the extra REAL_FBITS fractional bits.
        uint256 res = realA * realB;
        require(res/realA == realB, "RealMath mul overflow");
        return (res >> REAL_FBITS);
    }

    /**
     * Divide one real by another real. Truncates overflows.
     */
    function div(uint256 realNumerator, uint256 realDenominator) private pure returns (uint256) {
        // We use the reverse of the multiplication trick: convert numerator from
        // x.y to (x+z).(y+w) fixed point, then divide by denom in z.w fixed point.
        return uint256((uint256(realNumerator) * REAL_ONE) / uint256(realDenominator));
    }

}
