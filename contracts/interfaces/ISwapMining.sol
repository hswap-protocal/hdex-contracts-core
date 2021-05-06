// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface ISwapMining {
    function swap(address account, address input, address output, uint256 amount) external returns (bool);
}