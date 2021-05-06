// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0;

interface IHdexCallee {
    function hdexV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external;
}
