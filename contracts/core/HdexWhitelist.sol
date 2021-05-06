// SPDX-License-Identifier: MIT

pragma solidity =0.5.16;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract HdexWhitelist is Ownable {

    event AddWhitelist(address indexed user);
    event RemoveWhitelist(address indexed user);
    event ChangeCheck(bool indexed isCheck);

    // 是否启用白名单限制，默认关闭
    bool public isCheck;
    // 白名单列表
    address[] public whitelist;
    // 白名单索引
    mapping(address => uint256) public whitelistIndex;

    // 获取白名单地址数量
    function whitelistLength() public view returns(uint256) {
        return whitelist.length;
    }

    // 是否在白名单
    function isInWhitelist(address _user) public view returns(bool) {
        require(_user != address(0), "Hdex: ZERO_ADDRESS");
        return whitelistIndex[_user] != uint256(0);
    }

    // 添加白名单
    function addWhitelist(address _user) public onlyOwner {
        require(!isInWhitelist(_user), "Hdex: ALREADY_EXIST");
        whitelist.push(_user);
        whitelistIndex[_user] = whitelist.length;
        emit AddWhitelist(_user);
    }

    // 移除白名单
    function removeWhitelist(address _user) public onlyOwner {
        require(isInWhitelist(_user), "Hdex: NOT_EXIST");
        uint256 deleteIndex = whitelistIndex[_user] - 1;
        uint256 lastIndex = whitelist.length - 1;
        if(lastIndex != deleteIndex) {
            address lastAddress = whitelist[lastIndex];
            whitelist[deleteIndex] = lastAddress;
            whitelistIndex[lastAddress] = deleteIndex + 1;
        }
        whitelist.pop();
        delete whitelistIndex[_user];
        emit RemoveWhitelist(_user);
    }

    // 修改白名单限制开关
    function changeCheck(bool _isCheck) public onlyOwner {
        require(_isCheck != isCheck, "Hdex: INVALID OPERATION");
        isCheck = _isCheck;
        emit ChangeCheck(_isCheck);
    }
}
