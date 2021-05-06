// SPDX-License-Identifier: MIT

pragma solidity =0.5.16;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract HdexRecommendedToken is Ownable {
    event TokenRecommended(address indexed token);
    event RemoveTokenRecommended(address indexed token);

    // 推荐Token
    address[] public recommendedTokens;
    // 推荐Token索引
    mapping(address => uint256) public recommendedIndex;

    // 推荐Token数量
    function allRecommendedTokenLength() external view returns(uint) {
        return recommendedTokens.length;
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
