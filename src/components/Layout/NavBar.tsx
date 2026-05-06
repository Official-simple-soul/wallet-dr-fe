import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { ConnectButton } from '../Wallet/ConnectButton';
import { formatAddress } from '../../utils/helper';

export const Navbar = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { account, isConnected, isConnecting, walletType, disconnectWallet } =
    useWallet();

  const getWalletIcon = () => {
    switch (walletType) {
      case 'metamask':
        return '🦊';
      case 'trustwallet':
        return '📱';
      case 'coinbase':
        return '🏦';
      case 'rainbow':
        return '🌈';
      default:
        return '🔗';
    }
  };

  return (
    <nav className="relative z-10 border-b border-white/5 backdrop-blur-md bg-[rgba(10,12,16,0.8)] px-2! py-4! md:p-4! sticky top-0">
      <div className="nav-container">
        <div className="logo">
          <img src="/favicon.png" alt="" className="size-8 rounded-md" />
          <span className="hidden md:flex">RewardHub</span>
        </div>
        <div className="nav-links">
          <a href="#">Claim</a>
          <a href="#">Rewards</a>
          <a href="#">Support</a>
        </div>
        {!isConnected ? (
          <ConnectButton setIsOpen={setIsOpen} isConnecting={isConnecting} />
        ) : (
          <div className="wallet-badge">
            <span className="wallet-icon">{getWalletIcon()}</span>
            {formatAddress(account!)}
            <button className="disconnect-btn" onClick={disconnectWallet}>
              ✕
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// padding: 1rem 2rem;
