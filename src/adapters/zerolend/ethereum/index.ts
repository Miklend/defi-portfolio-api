import { Injectable } from '@nestjs/common';
import { Address } from 'viem';
import { ContractProtocolAdapter } from '@adapters/base/protocol-adapter-contracts';
import { MulticallCall, MulticallResult } from '@common/types/multicall-call.interface';
import { TokenDTO } from '@tokens/types/token.interface'
import { parserAaveType } from '@common/helpers/aave-type'
import { ABIuserReservesData, ABIGetReservesData, ABIGetUserReservesIncentiveData } from '@adapters/zerolend/abi'

@Injectable()
export class AdapterZerolandEthereum extends ContractProtocolAdapter {
  adapterName = 'ZerolandEth';
  protocolName = 'Zeroland';
  serviceName = 'Lending Pool';
  chainName = 'eth';

  contractPoolAddressesProvider = '0xFD856E1a33225B86f70D686f9280435E3fF75FCF';

  contractUiPoolDataProviderV3 = '0x3F78BBD206e4D3c504Eb854232EdA7e47E9Fd8FC';
  contractUiIncentiveDataProviderV3 = '0x0A1198DDb5247a283F76077Bb1E45e5858ee100b';

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

@Injectable()
export class AdapterZerolandEthereumRWT extends ContractProtocolAdapter {
  adapterName = 'ZerolandEthRWT';
  protocolName = 'Zeroland';
  serviceName = 'Lending Pool';
  chainName = 'eth';

  contractPoolAddressesProviderRWT = '0xE3C3c5eAd58FC2BEd4E577E38985B8F7F1DDfF00';

  contractUiPoolDataProviderV3 = '0x3F78BBD206e4D3c504Eb854232EdA7e47E9Fd8FC';

  funcGetUserReservesData = 'getUserReservesData';
  funcGetReservesData = 'getReservesData';

  async getMulticallCalls(user: string): Promise<MulticallCall<any, string>[]> {
    return [
      {
        address: this.contractUiPoolDataProviderV3 as Address,
        abi: ABIuserReservesData,
        functionName: this.funcGetUserReservesData,
        args: [this.contractPoolAddressesProviderRWT, user],
        adapterName: this.adapterName,
        chain: this.chainName,
        callId: 'userReservesData',
      },
      {
        address: this.contractUiPoolDataProviderV3 as Address,
        abi: ABIGetReservesData,
        functionName: this.funcGetReservesData,
        args: [this.contractPoolAddressesProviderRWT],
        adapterName: this.adapterName,
        chain: this.chainName,
        callId: 'reservesData',
      }
    ];
  }

  async parseMulticallResults(results: MulticallResult<any>[]): Promise<Record<string, TokenDTO[]>> {
    return parserAaveType(results, this.chainName)
  }
}