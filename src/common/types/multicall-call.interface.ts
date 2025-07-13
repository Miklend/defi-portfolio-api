import { Address } from 'viem'

export interface MulticallCall<TAbi extends readonly [...any], TFuncName extends string> {
  address: Address
  abi: TAbi
  functionName: TFuncName
  args?: readonly unknown[] 
  adapterName: string
  callId: string
  chain: string
}

export interface MulticallSuccess<T> {
  adapterName: string;
  callId: string;
  chain: string;
  status: 'success';
  result: T;
}

export interface MulticallFailure {
  adapterName: string;
  callId: string;
  status: 'failure';
  error: string;
}

export type MulticallResult<T> = MulticallSuccess<T> | MulticallFailure;