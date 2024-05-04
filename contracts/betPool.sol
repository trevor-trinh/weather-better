// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BetPool {
    enum weathers {
        sunday,
        rainday,
        clouday,
        snowday
    }
    weathers weather;
    weathers constant defaultChoice = weathers.sunday;

    Pool[] public pools;
    Record[] public records;
    PoolResult[] public pool_results;
    SettlementRecord[] public settlement_records;

    uint256 public last_pool;

    // 池子信息
    struct Pool {
        uint256 pool_ID;
        string location;
        string day_time;
        uint256 weather;
        address owner_address; //自己的下注
        address token_address; // 下注用的地址
    }

    // 用于快速根据pool_ID 索引 pool的信息
    mapping(uint256 => Pool) private poolInfo;

    // 下注记录
    struct Record {
        uint256 pool_ID;
        address user_address;
        uint256 chain_ID; // 先不考虑
        bool bool_bet;
        uint256 amount;
    }

    // 池子的结果
    struct PoolResult {
        uint256 pool_ID;
        bool bool_result;
        uint256 sum_total;
        uint256 sum_winner;
    }

    // 分配方案
    struct SettlementRecord {
        uint256 pool_ID;
        address user_address;
        uint256 user_amount;
    }

    event ERC20Deposit(
        address indexed token,
        address indexed from,
        uint256 amount
    );

    function approveToken(address token_address, uint256 _amount) external {
        // 使用IERC20接口的approve函数来增加对合约的授权
        IERC20(token_address).approve(address(this), _amount);
    }

    // 用户下注
    function userBetERC20(
        address user_address,
        uint256 _amount,
        uint256 _pool_ID,
        uint256 _chain_ID,
        bool _bool_bet
    ) public {
        // 本pool的token 类型
        address token_address = poolInfo[_pool_ID].token_address;
        // 确保调用者确实发送了指定数量的ERC20代币到合约

        //0x036CbD53842c5426634e7929541eC2318f3dCF7e usdc-base
        IERC20(token_address).transferFrom(msg.sender, address(this), _amount);

        // 创建Record结构体的实例
        Record memory record = Record(
            _pool_ID,
            user_address,
            _chain_ID,
            _bool_bet,
            _amount
        );

        // 将Record实例推入records数组
        records.push(record);

        // 触发事件，记录ERC20代币的存款信息
        // emit ERC20Deposit(token_address, user_address, _amount);
    }

    // 创建池子
    function createPool(
        uint256 _pool_ID, // 测试从100开始
        string calldata _location,
        string calldata _day_time,
        uint256 _weather, // 假设这里传递的是weathers枚举的整数索引
        address _owner_address,
        address _token_address,
        uint256 _amount,
        bool _bool_bet
    ) external returns (uint256) {
        // 创建Pool结构体的实例
        Pool memory newPool = Pool({
            pool_ID: _pool_ID,
            location: _location,
            day_time: _day_time,
            weather: _weather,
            owner_address: _owner_address,
            token_address: _token_address // 下注用的地址
        });

        // 将新的Pool实例添加到pools数组 和poolInfo字典中
        poolInfo[newPool.pool_ID] = newPool;
        pools.push(newPool);

        // 返回新创建的pool的索引或者pool_ID，以供外部引用
        last_pool = newPool.pool_ID;

        userBetERC20(_owner_address,_amount,_pool_ID,1,_bool_bet);

        return last_pool;
    }
    
    // 池子清算
    function poolSettlement(uint256 _pool_ID) public {
        //计算池子总资金 获取天气 并存储至result
        (
            uint256 totalAmount,
            uint256 amountZeroBets,
            uint256 amountOneBets
        ) = calculateSumAmount(_pool_ID);

        address token_address = poolInfo[_pool_ID].token_address;

        bool _bool_result = getWeather(_pool_ID);

        uint256 winnerAmount = _bool_result ? amountOneBets : amountZeroBets;

        // 创建并存储PoolResult
        PoolResult memory newPoolResult = PoolResult({
            pool_ID: _pool_ID,
            bool_result: _bool_result,
            sum_total: totalAmount,
            sum_winner: winnerAmount
        });
        pool_results.push(newPoolResult);

        // 用户清算 只有与这个池子中bool_result 一致的才能赢

        for (uint256 j = 0; j < records.length; j++) {
            Record memory record = records[j];

            // 如果池子ID、押注金额一致
            if (record.pool_ID == _pool_ID && record.bool_bet == _bool_result) {
                // 计算应该得到多少钱
                uint256 payoutPerWinner = record.amount *
                    (newPoolResult.sum_total / newPoolResult.sum_winner);

                // 记录在分配表中
                SettlementRecord memory settlement = SettlementRecord({
                    pool_ID: _pool_ID,
                    user_address: record.user_address,
                    user_amount: payoutPerWinner
                });
                settlement_records.push(settlement);
                safeTransfer(
                    IERC20(token_address),
                    record.user_address,
                    payoutPerWinner
                );
            }
        }
    }

    uint256 test = 1;

    // 获取天气 根据poolID读取location 和weather押注的类型
    function getWeather(uint256 _pool_ID) internal returns (bool) {
        // Pool memory pool = poolInfo[_pool_ID];
        test = _pool_ID;
        return true; // 意味着这个池子只有押True才能赢
    }

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        // 使用IERC20接口的transfer函数来安全地转移代币
        token.transfer(to, value);
        // 通常不需要检查transfer的返回值，因为ERC20的transfer函数不会返回bool
        // 如果转账失败，它会抛出异常并回滚状态变化
    }

    // 根据下注记录求所有的和
    function calculateSumAmount(uint256 _pool_ID)
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        uint256 totalAmount = 0; // 池子的总金额
        uint256 amountZeroBets = 0; // 下注为0的总金额
        uint256 amountOneBets = 0; // 下注为1的总金额

        // 获取records数组的长度
        uint256 recordsLength = records.length;
        // 遍历所有下注记录
        for (uint256 i = 0; i < recordsLength; i++) {
            Record memory record = records[i];
            // 检查下注记录是否属于当前池子
            if (record.pool_ID == _pool_ID) {
                // 累加总金额
                totalAmount += record.amount;

                // 根据bool_bet的值累加相应的下注金额
                if (record.bool_bet == false) {
                    amountZeroBets += record.amount;
                } else if (record.bool_bet == true) {
                    amountOneBets += record.amount;
                }
            }
        }

        // 返回总金额以及下注为0和1的金额
        return (totalAmount, amountZeroBets, amountOneBets);
    }

    // get the balance in contract
    function getERC20Balance(address _tokenContractAddress)
        public
        view
        returns (uint256)
    {
        // 使用IERC20接口调用balanceOf函数
        uint256 balance = IERC20(_tokenContractAddress).balanceOf(
            address(this)
        );
        return balance;
    }

    // read pools records
    function getAllPools() external view returns (Pool[] memory) {
        return pools;
    }

    function getAllRecords() external view returns (Record[] memory) {
        return records;
    }

    function getAllSettlement()
        external
        view
        returns (SettlementRecord[] memory)
    {
        return settlement_records;
    }
}
