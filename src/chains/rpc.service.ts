import { Injectable } from '@nestjs/common';
import { createPublicClient, http, PublicClient } from 'viem';
import { Chain } from 'viem/chains';
import { ALCHEMY_API_KEYS, VIEM_CHAIN_MAP } from '@config/rpc.config'

class RpcClientPool {
  private clients: PublicClient[];
  private index = 0;

  constructor(private apiKeys: string[], private chainName: string, private chain: Chain) {
    this.clients = apiKeys.map(
      (key) =>
        createPublicClient({
          chain,
          transport: http(`https://${chainName}-mainnet.g.alchemy.com/v2/${key}`),
        }),
    );
  }

  getClient(): PublicClient {
    const client = this.clients[this.index];
    this.index = (this.index + 1) % this.clients.length;
    return client;
  }
}

@Injectable()
export class RpcService {
  private pools: Record<string, RpcClientPool>;

  constructor() {
    this.pools = {};

    for (const chainName of Object.keys(ALCHEMY_API_KEYS)) {
      const apiKeys = ALCHEMY_API_KEYS[chainName];
      if (!VIEM_CHAIN_MAP[chainName]) {
        throw new Error(`No viem chain mapping for chain ${chainName}`);
      }
      this.pools[chainName] = new RpcClientPool(apiKeys, chainName, VIEM_CHAIN_MAP[chainName]);
    }
  }

  getClient(chainName: string): PublicClient {
    const pool = this.pools[chainName];
    if (!pool) throw new Error(`Unsupported chain: ${chainName}`);
    return pool.getClient();
  }
}
