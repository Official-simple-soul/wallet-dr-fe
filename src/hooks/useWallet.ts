import { useWeb3 } from '../providers/Web3Provider';

export const useWallet = () => {
  const {
    provider,
    account,
    walletInfo,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
    switchNetwork,
    walletType,
  } = useWeb3();

  return {
    provider,
    account,
    walletInfo,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
    switchNetwork,
    isConnected: !!account,
    walletType,
  };
};
