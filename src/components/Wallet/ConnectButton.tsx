import React from 'react';
import { Wallet, ChevronDown } from 'lucide-react';

interface WalletSelectorProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isConnecting: boolean;
  className?: string;
}

export const ConnectButton: React.FC<WalletSelectorProps> = ({
  isConnecting,
  setIsOpen,
  className = '',
}) => {
  return (
    <button
      className={`bg-gradient-to-br from-purple-500 to-blue-500 text-xs md:text-base border-0 px-4! py-2! rounded-lg text-white font-medium flex items-center gap-2 transition hover:scale-105 hover:shadow-lg ${className}`}
      onClick={() => setIsOpen(true)}
      disabled={isConnecting}
    >
      <Wallet size={16} />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      <ChevronDown size={14} />
    </button>
  );
};
