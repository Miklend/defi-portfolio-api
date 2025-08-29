import { Injectable } from '@nestjs/common';
import { Address } from 'viem';
import { ContractProtocolAdapter } from '@adapters/base/protocol-adapter-contracts';
import { MulticallCall, MulticallResult } from '@common/types/multicall-call.interface';
import { TokenDTO } from '@tokens/types/token.interface'
import { parserAaveType } from '@common/helpers/aave-type'
import { ABIGetUserReservesIncentiveData } from '@adapters/zerolend/abi'

@Injectable()
export class AdapterZerolandZksync extends ContractProtocolAdapter {
  adapterName = 'ZerolandZksync';
  protocolName = 'Zeroland';
  serviceName = 'Lending Pool';
  chainName = 'zksync';

  contractPoolAddressesProvider = '0x4f285Ea117eF0067B59853D6d16a5dE8088bA259';

  contractUiPoolDataProviderV3 = '0x8FE0ac76b634B7D343Bd32282B98E9f271B43367';
  contractUiIncentiveDataProviderV3 = '0x91ccF57c1E9A7F5A9537eE59306faF8dA3b7e960';

  funcGetUserReservesData = 'getUserReservesData';
  funcGetReservesData = 'getReservesData';
  funcGetFullReservesIncentiveData = 'getUserReservesIncentivesData';

  async getMulticallCalls(user: string): Promise<MulticallCall<any, string>[]> {
    return [
      {
        address: this.contractUiPoolDataProviderV3 as Address,
        abi: ABIuserReservesData,
        functionName: this.funcGetUserReservesData,
        args: [this.contractPoolAddressesProvider, user],
        adapterName: this.adapterName,
        chain: this.chainName,
        callId: 'userReservesData',
      },
      {
        address: this.contractUiPoolDataProviderV3 as Address,
        abi: ABIGetReservesData,
        functionName: this.funcGetReservesData,
        args: [this.contractPoolAddressesProvider],
        adapterName: this.adapterName,
        chain: this.chainName,
        callId: 'reservesData',
      }, 
      {
        address: this.contractUiIncentiveDataProviderV3 as Address,
        abi: ABIGetUserReservesIncentiveData,
        functionName: this.funcGetFullReservesIncentiveData,
        args: [this.contractPoolAddressesProvider, user],
        adapterName: this.adapterName,
        chain: this.chainName,
        callId: 'userIncentives',
      }
    ];
  }

  async parseMulticallResults(results: MulticallResult<any>[]): Promise<Record<string, TokenDTO[]>> {
    return parserAaveType(results, this.chainName)
  }
}

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
            "name": "stableBorrowRateEnabled",
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
            "internalType": "uint128",
            "name": "stableBorrowRate",
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
            "name": "stableDebtTokenAddress",
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
            "name": "totalPrincipalStableDebt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "averageStableRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stableDebtLastUpdateTimestamp",
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
            "name": "stableRateSlope1",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stableRateSlope2",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseStableBorrowRate",
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
            "internalType": "uint8",
            "name": "eModeCategoryId",
            "type": "uint8"
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
            "internalType": "uint16",
            "name": "eModeLtv",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "eModeLiquidationThreshold",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "eModeLiquidationBonus",
            "type": "uint16"
          },
          {
            "internalType": "address",
            "name": "eModePriceSource",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "eModeLabel",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "borrowableInIsolation",
            "type": "bool"
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
            "name": "stableBorrowRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "scaledVariableDebt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "principalStableDebt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stableBorrowLastUpdateTimestamp",
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