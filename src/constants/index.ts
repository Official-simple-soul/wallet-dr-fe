import { ethers } from 'ethers';

const requiredEnv = (key: string) => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing env variable: ${key}`);
  }

  return value;
};

export const CONTRACT_ADDRESS = ethers.getAddress(
  requiredEnv('VITE_CONTRACT_ADDRESS').toLowerCase(),
);

export const TOKEN_ADDRESS = ethers.getAddress(
  requiredEnv('VITE_TOKEN_ADDRESS').toLowerCase(),
);

export const TOKEN_SYMBOL = requiredEnv('VITE_TOKEN_SYMBOL');
export const TOKEN_DECIMALS = Number(requiredEnv('VITE_TOKEN_DECIMALS'));
export const REWARD_AMOUNT = requiredEnv('VITE_REWARD_AMOUNT');
export const BONUS_AMOUNT = requiredEnv('VITE_BONUS_AMOUNT');
export const BONUS_SYMBOL = requiredEnv('VITE_BONUS_SYMBOL');
export const TARGET_CHAIN_ID = Number(requiredEnv('VITE_CHAIN_ID'));
export const RPC_URL = requiredEnv('VITE_RPC_URL');

export const TOKEN_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
] as const;

export const NETWORK_CONFIG = {
  chainId: `0x${TARGET_CHAIN_ID.toString(16)}`,
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: ['https://bscscan.com'],
};
