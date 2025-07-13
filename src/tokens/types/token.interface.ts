export interface TokenDTO {
  token_address: string;
  raw_amount: string;
  formatted_amount?: string;
  symbol?: string;
  decimals?: number;
  chain?: string;
  price_usd?: number;
  value_usd?: number;
}
