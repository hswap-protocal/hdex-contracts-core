// SPDX-License-Identifier: MIT

pragma solidity =0.5.16;

contract Context {
    constructor () internal { }

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    function isOwner() public view returns (bool) {
        return _msgSender() == _owner;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

contract HdexRecommendedToken is Ownable {
    event TokenRecommended(address indexed token);
    event RemoveTokenRecommended(address indexed token);

    // 推荐Token
    address[] public recommendedTokens;
    // 推荐Token索引
    mapping(address => uint256) recommendedIndex;

    // 推荐Token数量
    function allRecommendedTokenLength() external view returns(uint) {
        return recommendedTokens.length;
    }

    // 判断是否是推荐token
    function isInRecommendedToken(address token) external view returns(bool) {
        require(token != address(0), 'HdexRecommendedToken: ZERO_ADDRESS');
        return recommendedIndex[token] != uint256(0);
    }

    // 添加推荐Token
    function addRecommendedToken(address token) external onlyOwner {
        require(token != address(0), 'HdexRecommendedToken: ZERO_ADDRESS');
        require(recommendedIndex[token] == uint256(0), "HdexRecommendedToken: ALREADY_IN_RECOMMENDED");
        recommendedTokens.push(token);
        recommendedIndex[token] = recommendedTokens.length;
        emit TokenRecommended(token);
    }

    // 移除推荐Token
    function removeRecommendedToken(address token) external onlyOwner {
        require(token != address(0), 'HdexRecommendedToken: ZERO_ADDRESS');
        require(recommendedIndex[token] != uint256(0), "Hdex: NOT_IN_RECOMMENDED");
        uint256 deleteIndex = recommendedIndex[token] - 1;
        uint256 lastIndex = recommendedTokens.length - 1;
        if(lastIndex != deleteIndex) {
            address lastToken = recommendedTokens[lastIndex];
            recommendedTokens[deleteIndex] = lastToken;
            recommendedIndex[lastToken] = deleteIndex + 1;
        }
        recommendedTokens.pop();
        delete recommendedIndex[token];
        emit RemoveTokenRecommended(token);
    }
}
