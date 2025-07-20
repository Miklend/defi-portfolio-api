import { ApiProtocolAdapter } from '@adapters/base/protocol-adapter-api';
import { TokenDTO } from '@tokens/types/token.interface';

interface MorphoGraphQLResponse {
  data: {
    marketPositions: {
      items: {
        user: { address: string };
        state: {
          id: string;
          collateral: string | number;
          collateralUsd: number;
          collateralValue: number;
          borrowAssets: string | number;
          borrowAssetsUsd: number;
          supplyAssets: string | number;
          supplyAssetsUsd: number;
        };
        healthFactor: number;
        market: {
          collateralAsset: {
            name: string;
          };
          oracleInfo: {
            type: string;
          };
          oracle: {
            markets: {
              collateralAsset: {
                priceUsd: number;
              };
            }[];
          };
        };
      }[];
      pageInfo: {
        countTotal: number;
      };
    };
  };
  errors?: any[];
}

export class MorphoAdapter extends ApiProtocolAdapter {
  adapterName = 'morpho-adapter';
  protocolName = 'morpho';
  serviceName = 'morpho-api';
  chainName = 'eth';

  private graphQLEndpoint = 'https://api.morpho.org/graphql';

  async fetchApiTokens(user: string): Promise<{
    supply?: TokenDTO[];
    borrow?: TokenDTO[];
    reward?: TokenDTO[];
  }> {
    const query = `
      query ($addresses: [String!]!) {
        marketPositions(
          orderDirection: Desc
          where: { userAddress_in: $addresses }
        ) {
          items {
            user { address }
            state {
              id
              collateral
              collateralUsd
              collateralValue
              borrowAssets
              borrowAssetsUsd
              supplyAssets
              supplyAssetsUsd
            }
            healthFactor
            market {
              collateralAsset { name }
              oracleInfo { type }
              oracle {
                markets {
                  collateralAsset { priceUsd }
                }
              }
            }
          }
          pageInfo { countTotal }
        }
      }
    `;

    const response = await fetch(this.graphQLEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: { addresses: [user.toLowerCase()] }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Morpho API: ${response.statusText}`);
    }

    const rawJson = await response.json();

    if (!rawJson || typeof rawJson !== 'object' || !('data' in rawJson)) {
      throw new Error('Invalid response from Morpho API');
    }

    const json = rawJson as MorphoGraphQLResponse;

    if (json.errors && json.errors.length > 0) {
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    const items = json.data.marketPositions.items;

    // Массивы для supply и borrow токенов
    const supplyTokens: TokenDTO[] = [];
    const borrowTokens: TokenDTO[] = [];

    for (const item of items) {
      const {
        state,
        market
      } = item;

      // Цена берем с первого орклейна, если есть
      const priceUsd = market.oracle.markets?.[0]?.collateralAsset.priceUsd ?? undefined;

      // SUPPLY token (если есть ненулевой collateral)
      const supplyAmount = state.collateral;
      if (supplyAmount && +supplyAmount > 0) {
        supplyTokens.push({
          token_address: '0x0', // нет в ответе
          raw_amount: supplyAmount.toString(),
          formatted_amount: (+supplyAmount / 1e18).toFixed(6), // предположим 18 decimals, можно улучшить если знаем
          symbol: market.collateralAsset.name,
          chain: this.chainName,
          price_usd: priceUsd,
          value_usd: state.collateralUsd,
          // token_address нет в ответе — оставляем undefined
        });
      }

      // BORROW token (если есть ненулевой borrowAssets)
      const borrowAmount = state.borrowAssets;
      if (borrowAmount && +borrowAmount > 0) {
        borrowTokens.push({
          token_address: '0x0', // нет в ответе
          raw_amount: borrowAmount.toString(),
          symbol: market.collateralAsset.name,
          chain: this.chainName,
          price_usd: priceUsd,
          value_usd: state.borrowAssetsUsd,
        });
      }
    }

    return {
      supply: supplyTokens,
      borrow: borrowTokens,
      reward: [] // пока нет данных по reward
    };
  }
}
