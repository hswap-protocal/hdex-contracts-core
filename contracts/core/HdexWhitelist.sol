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
