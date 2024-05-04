// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface PoolInterface {
     function createPool(
        uint256 _pool_ID, // 测试从100开始
        string calldata _location,
        string calldata _day_time,
        uint256 _weather, // 假设这里传递的是weathers枚举的整数索引
        address _owner_address,
        address _token_address
    ) external returns (uint256);
    function userBetERC20(
        address user_address,
        uint256 _amount,
        uint256 _pool_ID,
        uint256 _chain_ID,
        bool _bool_bet
    ) external;
}