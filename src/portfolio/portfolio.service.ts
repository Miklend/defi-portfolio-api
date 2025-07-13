import { Inject, Injectable, Logger } from '@nestjs/common';
import { APP_ADAPTERS } from './portfolio.module';
import { ProtocolAdapter } from '@adapters/base/protocol-adapter';
import { ApiProtocolAdapter } from '@adapters/base/protocol-adapter-api';
import { MulticallService } from '@chains/multicall.service';
import { PortfolioDTO } from '@portfolio/dto/portfolio-item.interface';
import { PriceService } from '@tokens/token/price-token.service';
import { TokenDTO } from '@tokens/types/token.interface';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    @Inject(APP_ADAPTERS)
    private readonly adapters: ProtocolAdapter[],
    private readonly multicallService: MulticallService,
    private readonly priceService: PriceService,
  ) {}

  async getFullPortfolio(wallet: string): Promise<PortfolioDTO> {
    this.logger.log(`Start building portfolio for wallet: ${wallet}`);

    try {
      // 1. Собираем multicall вызовы
      const allCalls = await Promise.all(
        this.adapters.map(adapter => adapter.getMulticallCalls(wallet)),
      );
      const flatCalls = allCalls.flat();
      this.logger.debug(`Collected ${flatCalls.length} multicall calls`);

      // 2. Выполняем multicall
      const resultsByChain = await this.multicallService.executeMulticall(flatCalls);
      this.logger.debug(`Multicall executed for ${Object.keys(resultsByChain).length} chains`);

      // 3. Собираем все токены по адаптерам
      const uniqueTokensMap = new Map<string, TokenDTO>();
      const adapterTokenGroups: {
        adapter: ProtocolAdapter;
        tokensByType: Record<string, TokenDTO[]>;
      }[] = [];

      for (const adapter of this.adapters) {
        if (adapter instanceof ApiProtocolAdapter) {
          this.logger.debug(`[${adapter.adapterName}] using API adapter`);
          const portfolio = await adapter.buildPortfolioFromApi(wallet);
          adapterTokenGroups.push({ adapter, tokensByType: {} });
          continue;
        }

        const results = resultsByChain[adapter.chainName]?.filter(
          r => r.adapterName === adapter.adapterName,
        ) ?? [];

        this.logger.debug(`[${adapter.adapterName}] parsing ${results.length} results`);
        const tokensByType = await adapter.parseMulticallResults(results);

        const allTokens = [
          ...(tokensByType.supply ?? []),
          ...(tokensByType.borrow ?? []),
          ...(tokensByType.reward ?? []),
        ];

        for (const token of allTokens) {
          const key = `${token.token_address.toLowerCase()}_${token.chain}`;
          if (!uniqueTokensMap.has(key)) {
            uniqueTokensMap.set(key, token);
          }
        }

        adapterTokenGroups.push({ adapter, tokensByType });
      }

      const uniqueTokens = Array.from(uniqueTokensMap.values());

      // 4. Обогащаем цены
      const enrichedTokens = await this.priceService.enrichTokens(uniqueTokens);
      const enrichedMap = new Map<string, TokenDTO>();
      for (const t of enrichedTokens) {
        const key = `${t.token_address.toLowerCase()}_${t.chain}`;
        enrichedMap.set(key, t);
      }

      // 5. Сборка итогового портфеля
      const portfolios: PortfolioDTO[] = [];

      for (const { adapter, tokensByType } of adapterTokenGroups) {
        if (!tokensByType || Object.keys(tokensByType).length === 0) continue;

        const enrichGroup = (tokens: TokenDTO[] | undefined) =>
          (tokens ?? []).map(token => {
            const key = `${token.token_address.toLowerCase()}_${token.chain}`;
            return enrichedMap.get(key) ?? token;
          });

        const portfolio = await adapter.buildPortfolioFromTokens(
          wallet,
          enrichGroup(tokensByType.supply),
          enrichGroup(tokensByType.borrow),
          enrichGroup(tokensByType.reward),
        );

        if (portfolio) {
          portfolios.push(portfolio);
        }
      }

      this.logger.log(`Portfolio built for ${wallet}, total items: ${portfolios.flatMap(p => p.data).length}`);

      return {
        wallet,
        data: portfolios.flatMap(p => p.data),
      };

    } catch (err) {
      this.logger.error(`Failed to build portfolio for wallet: ${wallet}`, err.stack || err.message);
      throw err;
    }
  }
}
