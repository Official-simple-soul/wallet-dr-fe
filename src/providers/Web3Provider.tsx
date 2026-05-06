import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider, ethers } from 'ethers';
import { TARGET_CHAIN_ID } from '../constants';
import type { WalletInfo } from '../types';

interface Web3ContextType {
  provider: BrowserProvider | null;
  account: string | null;
  walletInfo: WalletInfo | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
  switchNetwork: () => Promise<void>;
  walletType: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

// Detect which wallet is being used
const detectWalletType = (): string => {
  const ethereum = window.ethereum as any;

  if (!ethereum) return 'none';
  if (ethereum.isMetaMask && !ethereum.isTrustWallet) return 'metamask';
  if (ethereum.isTrustWallet) return 'trustwallet';
  if (ethereum.isCoinbaseWallet) return 'coinbase';
  if (ethereum.isRainbow) return 'rainbow';
  if (ethereum.isBraveWallet) return 'brave';
  if (ethereum.isTokenPocket) return 'tokenpocket';
  if (window.phantom?.ethereum) return 'phantom';

  return 'unknown';
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);

  const isWeb3Available = typeof window !== 'undefined' && !!window.ethereum;

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${TARGET_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${TARGET_CHAIN_ID.toString(16)}`,
              chainName: 'BNB Smart Chain',
              nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
              blockExplorerUrls: ['https://bscscan.com'],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  };

  const connectWallet = async () => {
    if (!isWeb3Available) {
      // Show wallet installation options
      const shouldInstall = confirm(
        'No wallet detected. Would you like to install MetaMask or open in Trust Wallet browser?',
      );
      if (shouldInstall) {
        window.open('https://metamask.io/download/', '_blank');
      }
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Detect wallet type first
      const detectedWallet = detectWalletType();
      setWalletType(detectedWallet);

      console.log(`Connecting with: ${detectedWallet}`);

      const providerInstance = new ethers.BrowserProvider(window.ethereum!);
      const accounts = await providerInstance.send('eth_requestAccounts', []);
      const signer = await providerInstance.getSigner();
      const address = await signer.getAddress();

      setProvider(providerInstance);
      setAccount(address);

      const network = await providerInstance.getNetwork();
      setWalletInfo({
        address,
        balance: null,
        chainId: Number(network.chainId),
      });

      // Check network
      if (Number(network.chainId) !== TARGET_CHAIN_ID) {
        await switchNetwork();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAccount(null);
    setWalletInfo(null);
    setWalletType(null);
    setError(null);
  };

  useEffect(() => {
    const ethereum = window.ethereum as any;

    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (provider && accounts[0]) {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [provider]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        account,
        walletInfo,
        connectWallet,
        disconnectWallet,
        isConnecting,
        error,
        switchNetwork,
        walletType,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
