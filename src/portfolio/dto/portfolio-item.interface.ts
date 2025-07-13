import { TokenDTO } from '@tokens/types/token.interface'

export class StatsDTO {
  asset_usd_value: number;
  net_usd_value: number;
}

export class PortfolioItemDTO {
  name: string;
  stats: StatsDTO;
  borrow_token_list: TokenDTO[];
  supply_token_list: TokenDTO[];
  reward_token_list: TokenDTO[];
  update_at: number;
}

export class PortfolioDataDTO {
  chain: string;
  id: string;
  name: string;
  portfolio_item_list: PortfolioItemDTO[];
}

export class PortfolioDTO {
  wallet: string;
  data: PortfolioDataDTO[];
}
