import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider, ethers } from 'ethers';
import { TARGET_CHAIN_ID, NETWORK_CONFIG } from '../constants';
import type { WalletInfo } from '../types';
import { isCorrectNetwork } from '../utils/helper';
import '../types/ethereum';

interface Web3ContextType {
  provider: BrowserProvider | null;
  account: string | null;
  walletInfo: WalletInfo | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
  switchNetwork: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMetaMaskInstalled =
    typeof window !== 'undefined' && !!window.ethereum;

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
          params: [NETWORK_CONFIG],
        });
      } else {
        throw switchError;
      }
    }
  };

  const updateWalletInfo = async (
    providerInstance: BrowserProvider,
    address: string,
  ) => {
    const network = await providerInstance.getNetwork();
    const chainId = Number(network.chainId);

    setWalletInfo({
      address,
      balance: null,
      chainId,
    });
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank');
      setError('Please install MetaMask');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const providerInstance = new ethers.BrowserProvider(window.ethereum!);
      await providerInstance.send('eth_requestAccounts', []);
      const signer = await providerInstance.getSigner();
      const address = await signer.getAddress();

      setProvider(providerInstance);
      setAccount(address);
      await updateWalletInfo(providerInstance, address);

      const network = await providerInstance.getNetwork();
      if (!isCorrectNetwork(Number(network.chainId), TARGET_CHAIN_ID)) {
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
    setError(null);
  };

  // Event handlers
  const handleAccountsChanged = (accounts: unknown) => {
    if (
      Array.isArray(accounts) &&
      accounts.every((item) => typeof item === 'string')
    ) {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (provider && accounts[0]) {
        setAccount(accounts[0]);
        updateWalletInfo(provider, accounts[0]);
      }
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  useEffect(() => {
    const ethereum = window.ethereum;

    if (ethereum && ethereum.on) {
      // Subscribe to events
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup
    return () => {
      if (ethereum && ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
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
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
