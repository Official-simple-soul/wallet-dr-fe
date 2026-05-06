import React from 'react';
import { Sparkles, Wallet, CheckCircle } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/helper';

interface NavbarProps {
  onConnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onConnect }) => {
  const { account, isConnected, isConnecting } = useWallet();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <Sparkles size={24} />
          <span>RewardHub</span>
        </div>
        <div className="nav-links">
          <a href="#">Claim</a>
          <a href="#">Rewards</a>
          <a href="#">Support</a>
        </div>
        {!isConnected ? (
          <button
            className="btn-connect-header"
            onClick={onConnect}
            disabled={isConnecting}
          >
            <Wallet size={18} />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="wallet-badge">
            <CheckCircle size={14} />
            {formatAddress(account!)}
          </div>
        )}
      </div>
    </nav>
  );
};
