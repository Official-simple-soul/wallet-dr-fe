import React from 'react';
import { CheckCircle } from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  installUrl: string;
  getMobileDeepLink?: () => string;
  detect: () => boolean;
}

const WalletIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="h-7 w-7 object-contain" />
);

const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

const getEthereum = () => {
  if (typeof window === 'undefined') return undefined;
  return window.ethereum as any;
};

const getCurrentUrl = () => {
  if (typeof window === 'undefined') return '';
  return window.location.href;
};

const walletOptions: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: (
      <WalletIcon
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/3840px-MetaMask_Fox.svg.png"
        alt="MetaMask"
      />
    ),
    installUrl: 'https://metamask.io/download/',
    getMobileDeepLink: () => {
      const url = getCurrentUrl().replace(/^https?:\/\//, '');
      return `https://metamask.app.link/dapp/${url}`;
    },
    detect: () => {
      const ethereum = getEthereum();
      return !!ethereum?.isMetaMask && !ethereum?.isTrustWallet;
    },
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: (
      <WalletIcon
        src="https://trustwallet.com/assets/images/media/assets/TWT.png"
        alt="Trust Wallet"
      />
    ),
    installUrl: 'https://trustwallet.com/download',
    getMobileDeepLink: () => {
      const url = encodeURIComponent(getCurrentUrl());
      return `https://link.trustwallet.com/open_url?coin_id=60&url=${url}`;
    },
    detect: () => {
      const ethereum = getEthereum();
      return !!ethereum?.isTrustWallet;
    },
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: (
      <WalletIcon
        src="https://avatars.githubusercontent.com/u/18060234?s=200&v=4"
        alt="Coinbase Wallet"
      />
    ),
    installUrl: 'https://www.coinbase.com/wallet/downloads',
    getMobileDeepLink: () => {
      const url = encodeURIComponent(getCurrentUrl());
      return `https://go.cb-w.com/dapp?cb_url=${url}`;
    },
    detect: () => {
      const ethereum = getEthereum();
      return !!ethereum?.isCoinbaseWallet;
    },
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: (
      <WalletIcon
        src="https://avatars.githubusercontent.com/u/48327834?s=200&v=4"
        alt="Rainbow"
      />
    ),
    installUrl: 'https://rainbow.me/',
    getMobileDeepLink: () => {
      const url = encodeURIComponent(getCurrentUrl());
      return `https://rnbwapp.com/wc?uri=${url}`;
    },
    detect: () => {
      const ethereum = getEthereum();
      return !!ethereum?.isRainbow;
    },
  },
];

function SelectModal({
  isOpen,
  setIsOpen,
  onConnect,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConnect: () => void;
}) {
  const isMobile = isMobileDevice();

  if (!isOpen) return null;

  return (
    <div className="wallet-modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <h3>Connect Wallet</h3>

          <button type="button" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="wallet-modal-body">
          <p className="wallet-description">
            Choose your preferred wallet to connect
          </p>

          <div className="wallet-options">
            {walletOptions.map((wallet) => {
              const isDetected = wallet.detect();

              return (
                <button
                  key={wallet.id}
                  type="button"
                  className="wallet-option"
                  onClick={() => {
                    if (isDetected) {
                      onConnect();
                      setIsOpen(false);
                      return;
                    }

                    if (isMobile && wallet.getMobileDeepLink) {
                      window.location.href = wallet.getMobileDeepLink();
                      return;
                    }

                    window.open(
                      wallet.installUrl,
                      '_blank',
                      'noopener,noreferrer',
                    );
                  }}
                >
                  <div className="wallet-option-icon">{wallet.icon}</div>

                  <div className="w-full text-start">
                    <div className="text-sm font-medium text-white">
                      {wallet.name}
                    </div>

                    {isDetected ? (
                      <div className="wallet-detected">
                        <CheckCircle size={12} />
                        Detected
                      </div>
                    ) : (
                      <div className="wallet-not-detected">
                        {isMobile
                          ? 'Open wallet app'
                          : 'Not installed - Click to install'}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectModal;
