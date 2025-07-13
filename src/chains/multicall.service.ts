import { Injectable, Logger } from '@nestjs/common';
import { RpcService } from '@chains/rpc.service';
import { 
  MulticallCall,
  MulticallResult,
  MulticallSuccess,
  MulticallFailure,
} from '@common/types/multicall-call.interface';
import { batchMulticallCallsByChain } from '@common/helpers/batch.util';
import pLimit from 'p-limit';

const BATCH_SIZE = 150;
const CONCURRENCY_LIMIT = 25;

@Injectable()
export class MulticallService {
  private readonly logger = new Logger(MulticallService.name);

  constructor(
    private readonly rpcService: RpcService,
  ) {}

  async executeMulticall(
    calls: MulticallCall<any, any>[],
  ): Promise<Record<string, MulticallResult<any>[]>> {
    this.logger.log(`Starting multicall execution. Total calls: ${calls.length}`);

    const batchedCalls = batchMulticallCallsByChain(calls, BATCH_SIZE);
    const results: Record<string, MulticallResult<any>[]> = {};
    const limit = pLimit(CONCURRENCY_LIMIT);

    await Promise.all(
      Object.entries(batchedCalls).map(async ([chain, batches]) => {
        this.logger.debug(`Processing ${batches.length} batches for chain ${chain}`);
        results[chain] = [];

        const batchResults = await Promise.all(
          batches.map(batch =>
            limit(async () => {
              const client = this.rpcService.getClient(chain);
              let res;
              try {
                res = await client.multicall({
                  contracts: batch,
                  allowFailure: true,
                });
              } catch (err) {
                this.logger.error(`Multicall failed for chain ${chain}`, err.stack || err.message);
                res = Array(batch.length).fill(null);
              }

              const processedResults: MulticallResult<any>[] = batch.map((call, i) => {
                const callResult = res[i];

                if (
                  callResult === null ||
                  callResult === undefined ||
                  (typeof callResult === 'object' && callResult.status === 'failure')
                ) {
                  const errorMessage = callResult?.error?.message || 'Empty result or call failed';
                  const failure: MulticallFailure = {
                    adapterName: call.adapterName,
                    callId: call.callId,
                    status: 'failure',
                    error: errorMessage,
                  };
                  this.logger.warn(
                    `Call failed: adapter=${call.adapterName}, callId=${call.callId}, error=${errorMessage}`,
                  );
                  return failure;
                }

                const success: MulticallSuccess<any> = {
                  adapterName: call.adapterName,
                  callId: call.callId,
                  chain: call.chain,
                  status: 'success',
                  result: callResult,
                };
                return success;
              });

              return processedResults;
            })
          )
        );

        for (const batchRes of batchResults) {
          results[chain].push(...batchRes);
        }

        this.logger.debug(`Completed multicall batches for chain ${chain}, total results: ${results[chain].length}`);
      }),
    );

    this.logger.debug(`Multicall execution finished`);

    return results;
  }
}
