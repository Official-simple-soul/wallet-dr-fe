export interface EthereumProvider {
  isMetaMask?: boolean;
  isTrustWallet?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (
    eventName: string,
    callback: (...args: unknown[]) => void,
  ) => void;
  selectedAddress: string | null;
  chainId: string | null;
  networkVersion: string | null;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    phantom?: {
      ethereum: EthereumProvider;
    };
  }
}
