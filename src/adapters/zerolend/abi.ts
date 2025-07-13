export const ABIuserReservesData = [
  {
    "inputs": [
      {
        "internalType": "contract IPoolAddressesProvider",
        "name": "provider",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserReservesData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "underlyingAsset",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "scaledATokenBalance",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "usageAsCollateralEnabledOnUser",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "scaledVariableDebt",
            "type": "uint256"
          }
        ],
        "internalType": "struct IUiPoolDataProviderV3.UserReserveData[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const ABIGetReservesData = [
  {
    "inputs": [
      {
        "internalType": "contract IPoolAddressesProvider",
        "name": "provider",
        "type": "address"
      }
    ],
    "name": "getReservesData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "underlyingAsset",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "decimals",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseLTVasCollateral",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserveLiquidationThreshold",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserveLiquidationBonus",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserveFactor",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "usageAsCollateralEnabled",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "borrowingEnabled",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isFrozen",
            "type": "bool"
          },
          {
            "internalType": "uint128",
            "name": "liquidityIndex",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "variableBorrowIndex",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "liquidityRate",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "variableBorrowRate",
            "type": "uint128"
          },
          {
            "internalType": "uint40",
            "name": "lastUpdateTimestamp",
            "type": "uint40"
          },
          {
            "internalType": "address",
            "name": "aTokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "variableDebtTokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "interestRateStrategyAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "availableLiquidity",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalScaledVariableDebt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "priceInMarketReferenceCurrency",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "priceOracle",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "variableRateSlope1",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "variableRateSlope2",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseVariableBorrowRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "optimalUsageRatio",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isPaused",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isSiloedBorrowing",
            "type": "bool"
          },
          {
            "internalType": "uint128",
            "name": "accruedToTreasury",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "unbacked",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "isolationModeTotalDebt",
            "type": "uint128"
          },
          {
            "internalType": "bool",
            "name": "flashLoanEnabled",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "debtCeiling",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "debtCeilingDecimals",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "borrowCap",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "supplyCap",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "borrowableInIsolation",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "virtualAccActive",
            "type": "bool"
          },
          {
            "internalType": "uint128",
            "name": "virtualUnderlyingBalance",
            "type": "uint128"
          }
        ],
        "internalType": "struct IUiPoolDataProviderV3.AggregatedReserveData[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "marketReferenceCurrencyUnit",
            "type": "uint256"
          },
          {
            "internalType": "int256",
            "name": "marketReferenceCurrencyPriceInUsd",
            "type": "int256"
          },
          {
            "internalType": "int256",
            "name": "networkBaseTokenPriceInUsd",
            "type": "int256"
          },
          {
            "internalType": "uint8",
            "name": "networkBaseTokenPriceDecimals",
            "type": "uint8"
          }
        ],
        "internalType": "struct IUiPoolDataProviderV3.BaseCurrencyInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const ABIGetUserReservesIncentiveData = [
  {
    "inputs": [
      {
        "internalType": "contract IPoolAddressesProvider",
        "name": "provider",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserReservesIncentivesData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "underlyingAsset",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "incentiveControllerAddress",
                "type": "address"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "rewardTokenSymbol",
                    "type": "string"
                  },
                  {
                    "internalType": "address",
                    "name": "rewardOracleAddress",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "rewardTokenAddress",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "userUnclaimedRewards",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "tokenIncentivesUserIndex",
                    "type": "uint256"
                  },
                  {
                    "internalType": "int256",
                    "name": "rewardPriceFeed",
                    "type": "int256"
                  },
                  {
                    "internalType": "uint8",
                    "name": "priceFeedDecimals",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint8",
                    "name": "rewardTokenDecimals",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct IUiIncentiveDataProviderV3.UserRewardInfo[]",
                "name": "userRewardsInformation",
                "type": "tuple[]"
              }
            ],
            "internalType": "struct IUiIncentiveDataProviderV3.UserIncentiveData",
            "name": "aTokenIncentivesUserData",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "incentiveControllerAddress",
                "type": "address"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "rewardTokenSymbol",
                    "type": "string"
                  },
                  {
                    "internalType": "address",
                    "name": "rewardOracleAddress",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "rewardTokenAddress",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "userUnclaimedRewards",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "tokenIncentivesUserIndex",
                    "type": "uint256"
                  },
                  {
                    "internalType": "int256",
                    "name": "rewardPriceFeed",
                    "type": "int256"
                  },
                  {
                    "internalType": "uint8",
                    "name": "priceFeedDecimals",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint8",
                    "name": "rewardTokenDecimals",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct IUiIncentiveDataProviderV3.UserRewardInfo[]",
                "name": "userRewardsInformation",
                "type": "tuple[]"
              }
            ],
            "internalType": "struct IUiIncentiveDataProviderV3.UserIncentiveData",
            "name": "vTokenIncentivesUserData",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "incentiveControllerAddress",
                "type": "address"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "rewardTokenSymbol",
                    "type": "string"
                  },
                  {
                    "internalType": "address",
                    "name": "rewardOracleAddress",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "rewardTokenAddress",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "userUnclaimedRewards",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "tokenIncentivesUserIndex",
                    "type": "uint256"
                  },
                  {
                    "internalType": "int256",
                    "name": "rewardPriceFeed",
                    "type": "int256"
                  },
                  {
                    "internalType": "uint8",
                    "name": "priceFeedDecimals",
                    "type": "uint8"
                  },
                  {
                    "internalType": "uint8",
                    "name": "rewardTokenDecimals",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct IUiIncentiveDataProviderV3.UserRewardInfo[]",
                "name": "userRewardsInformation",
                "type": "tuple[]"
              }
            ],
            "internalType": "struct IUiIncentiveDataProviderV3.UserIncentiveData",
            "name": "sTokenIncentivesUserData",
            "type": "tuple"
          }
        ],
        "internalType": "struct IUiIncentiveDataProviderV3.UserReserveIncentiveData[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]