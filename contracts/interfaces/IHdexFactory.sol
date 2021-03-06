// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0;

interface IHdexFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function isCheck() external view returns (bool);
    function feeTo() external view returns (address);
    function feeToRate() external view returns (uint256);
    function isFlashSwapOn() external view returns (bool);
    function isInWhitelist(address _user) external view returns(bool);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToRate(uint256) external;
    function setFlashSwap(bool _isFlashSwapOn) external;
    function setRouter(address _router) external;
}
