export interface ClaimStatus {
  status: 'idle' | 'connecting' | 'approving' | 'success' | 'error';
  message: string;
}

export interface WalletInfo {
  address: string;
  balance: string | null;
  chainId: number | null;
}

export interface ClaimResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}
