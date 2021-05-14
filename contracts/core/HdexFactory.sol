// SPDX-License-Identifier: MIT

pragma solidity =0.5.16;

import '../interfaces/IHdexFactory.sol';
import './HdexPair.sol';
import './HdexWhitelist.sol';

contract HdexFactory is IHdexFactory, HdexWhitelist{
    using SafeMath for uint;

    address public feeTo;
    // 默认开发团队收到的手续费比例为1/2
    uint256 public feeToRate = 1;
    // 套利开关，默认关闭
    bool public isFlashSwapOn;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);
    event ChangeFeeToRate(uint256 feeToRate);
    event ChangeFlashSwap(bool indexed isFlashSwapOn);

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    // get init code
    function getInitCode() external pure returns(bytes32 codeHash) {
        codeHash = keccak256(type(HdexPair).creationCode);
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        // 如果开启了白名单检查，即只有白名单用户可以添加交易对
        if(isCheck){
            require(isInWhitelist(msg.sender) || isInWhitelist(tx.origin), "Hdex: NOT_IN_WHITELIST");
        }
        require(tokenA != tokenB, 'Hdex: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'Hdex: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'Hdex: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(HdexPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IHdexPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external onlyOwner {
        feeTo = _feeTo;
    }

    // 设置feeTo收到的手续费的比例，设置为6，代表占交易手续费的1/6
    function setFeeToRate(uint256 _rate) external onlyOwner {
        require(_rate > 0, "Hdex: FEE_TO_RATE_OVERFLOW");
        feeToRate = _rate.sub(1);
        emit ChangeFeeToRate(feeToRate);
    }

    // 修改套利开关
    function setFlashSwap(bool _isFlashSwapOn) external onlyOwner {
        if(isFlashSwapOn != _isFlashSwapOn) {
            isFlashSwapOn = _isFlashSwapOn;
            emit ChangeFlashSwap(_isFlashSwapOn);
        }
    }
}
