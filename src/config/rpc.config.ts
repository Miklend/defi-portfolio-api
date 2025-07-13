import {Chain, mainnet, polygon, avalanche, zksync } from 'viem/chains';
import 'dotenv/config';

export const ALCHEMY_KEY_PRICE = process.env.ALCHEMY_KEY || '';

export const ALCHEMY_API_KEYS: Record<string, string[]> = {
  eth: [
    process.env.ALCHEMY_ETH_KEY_1 || '',
    process.env.ALCHEMY_KEY || '',
  ],
  polygon: [
    process.env.ALCHEMY_KEY || '',
    process.env.ALCHEMY_KEY || '',
  ],
  avax: [
    process.env.ALCHEMY_KEY || '',
  ],
  zksync: [
    process.env.ALCHEMY_KEY || '',
  ],
};

export const VIEM_CHAIN_MAP: Record<string, Chain> = {
  eth: mainnet,
  polygon,
  avax: avalanche,
  zksync,
};
