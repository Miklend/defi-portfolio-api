import { Injectable, Logger } from '@nestjs/common';
import { TokenDTO } from '@tokens/types/token.interface';
import { ALCHEMY_KEY_PRICE } from '@config/rpc.config';
const ALCHEMY_API_URL = `https://api.g.alchemy.com/prices/v1/${ALCHEMY_KEY_PRICE}/tokens/by-address`;
const MAX_RETRIES = 2;

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);
  private readonly maxBatchSize = 100;

  private async fetchPricesWithRetry(addresses: string[], chain: string, retries = MAX_RETRIES): Promise<Record<string, number>> {
    try {
      return await this.fetchPricesForChain(addresses, chain);
    } catch (err) {
      if (retries > 0) {
        this.logger.warn(`Retrying fetch for ${chain}, ${addresses.length} tokens left, retries: ${retries}`);
        return this.fetchPricesWithRetry(addresses, chain, retries - 1);
      }
      this.logger.error(`Failed to fetch prices for ${chain}`, err);
      return {};
    }
  }

  private async fetchPricesForChain(addresses: string[], chain: string): Promise<Record<string, number>> {
    if (addresses.length === 0) return {};

    const result: Record<string, number> = {};
    const batches = this.createBatches(addresses, this.maxBatchSize);

    await Promise.all(
      batches.map(async (batch) => {
        try {
          const response = await fetch(ALCHEMY_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              addresses: batch.map((addr) => ({
                network: `${chain}-mainnet`,
                address: addr.toLowerCase(),
              })),
            }),
          });

          if (!response.ok) {
            this.logger.warn(`Alchemy fetch error for ${chain}: ${response.statusText}`);
            return;
          }

          const data = await response.json();

          if (!Array.isArray(data?.data)) {
            this.logger.warn(`Unexpected structure from Alchemy for ${chain}`);
            return;
          }

          for (const token of data.data) {
            const usdPrice = token.prices?.find((p: any) => p.currency === 'usd');
            if (usdPrice) {
              result[token.address.toLowerCase()] = parseFloat(usdPrice.value);
            }
          }
        } catch (e) {
          this.logger.error(`Fetch prices error for ${chain}`, e);
        }
      })
    );

    return result;
  }

  async enrichTokens(tokens: TokenDTO[]): Promise<TokenDTO[]> {
    const tokensWithPrice: TokenDTO[] = [];
    const tokensWithoutPrice: TokenDTO[] = [];

    for (const token of tokens) {
      if (token.price_usd && token.price_usd > 0) {
        tokensWithPrice.push(token);
      } else {
        tokensWithoutPrice.push(token);
      }
    }

    const tokensByChain = tokensWithoutPrice.reduce((acc, token) => {
      const chain = token.chain || 'eth';
      acc[chain] ??= [];
      acc[chain].push(token);
      return acc;
    }, {} as Record<string, TokenDTO[]>);

    const enriched: TokenDTO[] = [];
    const noPriceToken: TokenDTO[] = [];

    await Promise.all(
      Object.entries(tokensByChain).map(async ([chain, chainTokens]) => {
        const addresses = chainTokens.map((t) => t.token_address.toLowerCase());
        const prices = await this.fetchPricesWithRetry(addresses, chain);

        for (const token of chainTokens) {
          const price = prices[token.token_address.toLowerCase()] ?? 0;
          const amount = parseFloat(token.formatted_amount ?? '0');
          if (amount <= 0 || price <= 0) 
            noPriceToken.push(token);
            
          enriched.push({
            ...token,
            price_usd: price,
            value_usd: price * amount,
          });
        }
        this.logger.debug('No price tokens', noPriceToken.map((t) => t.token_address));
      })
    );

    const enrichedMap = new Map<string, TokenDTO>();
    for (const t of [...tokensWithPrice, ...enriched]) {
      const key = this.tokenKey(t);
      enrichedMap.set(key, t);
    }

    this.logger.log(
      `Prices enriched: ${enriched.length}, already had price: ${tokensWithPrice.length}, total input: ${tokens.length}, no price tokens: ${noPriceToken.length}`
    );

    return tokens.map((t) => enrichedMap.get(this.tokenKey(t)) ?? t);
  }

  private tokenKey(t: TokenDTO): string {
    return `${t.token_address.toLowerCase()}_${t.raw_amount}_${t.chain ?? 'unknown'}`;
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }
}
