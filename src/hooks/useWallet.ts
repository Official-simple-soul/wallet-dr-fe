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
    switchAccount,
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
    switchAccount,
    isConnected: !!account,
    walletType,
  };
};
