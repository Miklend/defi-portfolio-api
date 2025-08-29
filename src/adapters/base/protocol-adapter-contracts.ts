import { ProtocolAdapter } from './protocol-adapter';
import { MulticallCall, MulticallResult } from '@common/types/multicall-call.interface';
import { TokenDTO } from '@tokens/types/token.interface';


export abstract class ContractProtocolAdapter extends ProtocolAdapter {
  abstract getMulticallCalls(user: string): Promise<MulticallCall<readonly unknown[], string>[]>;
  abstract parseMulticallResults(results: MulticallResult<any>[]): Promise<Record<string, TokenDTO[]>>;
}