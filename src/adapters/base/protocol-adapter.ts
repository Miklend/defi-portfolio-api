import { MulticallCall, MulticallResult } from '@common/types/multicall-call.interface';
import { PortfolioDTO, PortfolioDataDTO, PortfolioItemDTO, StatsDTO } from '@portfolio/dto/portfolio-item.interface';
import { TokenDTO } from '@tokens/types/token.interface'

export abstract class ProtocolAdapter {
  abstract adapterName: string;
  abstract protocolName: string;
  abstract serviceName: string;
  abstract chainName: string;

  // abstract getMulticallCalls(user: string): Promise<MulticallCall<readonly unknown[], string>[]>;
  // abstract parseMulticallResults(results: MulticallResult<any>[]): Promise<Record<string, TokenDTO[]>>;

  async buildPortfolioFromTokens(
    user: string,
    supply: TokenDTO[],
    borrow: TokenDTO[],
    reward: TokenDTO[]
  ): Promise<PortfolioDTO | null> {
    const hasData = supply.length > 0 || borrow.length > 0 || reward.length > 0;
    if (!hasData) return null;

    const stats = this.calculateStats(supply, borrow, reward);

    const portfolioItem: PortfolioItemDTO = {
      name: this.serviceName,
      stats,
      supply_token_list: supply,
      borrow_token_list: borrow,
      reward_token_list: reward,
      update_at: this.getUnixTimestamp(),
    };

    const portfolioData: PortfolioDataDTO = {
      chain: this.chainName,
      id: `${this.chainName.toLowerCase()}_${this.protocolName.toLowerCase()}`,
      name: this.protocolName,
      portfolio_item_list: [portfolioItem],
    };

    return {
      wallet: user,
      data: [portfolioData],
    };
  }

  protected calculateStats(supply: TokenDTO[], borrow: TokenDTO[], reward: TokenDTO[]): StatsDTO {
    const asset_usd_value = this.sumTokensValue(supply) + this.sumTokensValue(borrow) + this.sumTokensValue(reward);
    const net_usd_value = this.sumTokensValue(supply) + this.sumTokensValue(reward) - this.sumTokensValue(borrow);
    return { asset_usd_value, net_usd_value };
  }

  protected sumTokensValue(tokens: TokenDTO[]): number {
    return tokens.reduce((sum, t) => sum + (t.value_usd ?? 0), 0);
  }

  protected getUnixTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }
}
