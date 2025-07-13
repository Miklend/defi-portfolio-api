import { MulticallCall } from '@common/types/multicall-call.interface';


export function batchMulticallCallsByChain(
  calls: MulticallCall<any, any>[],
  batchSize: number,
): Record<string, MulticallCall<any, any>[][]> {
  const result: Record<string, MulticallCall<any, any>[][]> = {};

  for (const call of calls) {
    const chain = call.chain;

    if (!result[chain]) {
      result[chain] = [];
    }

    const lastBatch = result[chain][result[chain].length - 1];

    if (!lastBatch || lastBatch.length >= batchSize) {
      result[chain].push([call]);
    } else {
      lastBatch.push(call);
    }
  }

  return result;
}
