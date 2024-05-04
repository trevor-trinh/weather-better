export const abi = [
  [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "ERC20Deposit",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token_address",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "approveToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_pool_ID",
          type: "uint256",
        },
      ],
      name: "calculateSumAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_pool_ID",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_location",
          type: "string",
        },
        {
          internalType: "string",
          name: "_day_time",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_weather",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_owner_address",
          type: "address",
        },
        {
          internalType: "address",
          name: "_token_address",
          type: "address",
        },
      ],
      name: "createPool",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllPools",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "pool_ID",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "location",
              type: "string",
            },
            {
              internalType: "string",
              name: "day_time",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "weather",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner_address",
              type: "address",
            },
            {
              internalType: "address",
              name: "token_address",
              type: "address",
            },
          ],
          internalType: "struct BetPool.Pool[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllRecords",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "pool_ID",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "user_address",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "chain_ID",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "bool_bet",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          internalType: "struct BetPool.Record[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllSettlement",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "pool_ID",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "user_address",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "user_amount",
              type: "uint256",
            },
          ],
          internalType: "struct BetPool.SettlementRecord[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_tokenContractAddress",
          type: "address",
        },
      ],
      name: "getERC20Balance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "last_pool",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_pool_ID",
          type: "uint256",
        },
      ],
      name: "poolSettlement",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "pool_results",
      outputs: [
        {
          internalType: "uint256",
          name: "pool_ID",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "bool_result",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "sum_total",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "sum_winner",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "pools",
      outputs: [
        {
          internalType: "uint256",
          name: "pool_ID",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "location",
          type: "string",
        },
        {
          internalType: "string",
          name: "day_time",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "weather",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "owner_address",
          type: "address",
        },
        {
          internalType: "address",
          name: "token_address",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "records",
      outputs: [
        {
          internalType: "uint256",
          name: "pool_ID",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "user_address",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "chain_ID",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "bool_bet",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "settlement_records",
      outputs: [
        {
          internalType: "uint256",
          name: "pool_ID",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "user_address",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "user_amount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user_address",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_pool_ID",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_chain_ID",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "_bool_bet",
          type: "bool",
        },
      ],
      name: "userBetERC20",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
];
