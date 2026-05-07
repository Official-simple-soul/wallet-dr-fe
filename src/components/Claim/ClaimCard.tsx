import React from 'react';
import {
  Gift,
  Sparkles,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Wallet,
  X,
} from 'lucide-react';
import {
  REWARD_AMOUNT,
  TOKEN_SYMBOL,
  BONUS_AMOUNT,
  BONUS_SYMBOL,
} from '../../constants';
import type { ClaimStatus } from '../../types';
import { ConnectButton } from '../Wallet/ConnectButton';

interface ClaimCardProps {
  claimStatus: ClaimStatus;
  showSuccessModal: boolean;
  onClaim: () => void;
  onConnect: () => void;
  onClearError?: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({
  claimStatus,
  showSuccessModal,
  onClaim,
  isConnected,
  isConnecting,
  onClearError,
  setIsOpen,
}) => {
  console.log('connection state', isConnected);
  console.log('connection status', claimStatus);
  // Show different UI based on connection state
  if (!isConnected) {
    return (
      <div className="claim-card">
        <div className="reward-amount">
          <Gift size={28} />
          <div>
            <div className="reward-label">Your Reward</div>
            <div className="reward-value">
              {REWARD_AMOUNT} {TOKEN_SYMBOL}
            </div>
          </div>
        </div>

        <div className="bonus-row">
          <Sparkles size={16} />
          <span>
            + {BONUS_AMOUNT} {BONUS_SYMBOL} Bonus
          </span>
        </div>

        <div className="connect-prompt">
          <Wallet size={48} strokeWidth={1.5} />
          <h3>Connect Wallet to Claim</h3>
          <p>Connect your wallet to verify eligibility and claim your reward</p>
        </div>

        <ConnectButton
          setIsOpen={setIsOpen}
          isConnecting={isConnecting}
          className="w-full py-4! flex items-center justify-center"
        />

        <p className="claim-note">
          Connect wallet to receive your reward. One claim per wallet.
        </p>
      </div>
    );
  }

  // Connected state - show claim button
  return (
    <div className="claim-card">
      <div className="reward-amount">
        <Gift size={28} />
        <div>
          <div className="reward-label">Your Reward</div>
          <div className="reward-value">
            {REWARD_AMOUNT} {TOKEN_SYMBOL}
          </div>
        </div>
      </div>

      <div className="bonus-row">
        <Sparkles size={16} />
        <span>
          + {BONUS_AMOUNT} {BONUS_SYMBOL} Bonus
        </span>
      </div>

      <div className="claim-info">
        <div className="info-row">
          <Lock size={14} />
          <span>Secure smart contract</span>
        </div>
        <div className="info-row">
          <Shield size={14} />
          <span>Audited by CertiK</span>
        </div>
      </div>

      {/* Error Message with Dismiss Button */}
      {claimStatus.status === 'error' && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span className="flex-1">{claimStatus.message}</span>
          <button
            onClick={onClearError}
            className="ml-2 p-1 hover:bg-white/10 rounded transition"
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {claimStatus.status === 'success' && !showSuccessModal && (
        <div className="success-message">
          <CheckCircle size={16} />
          {claimStatus.message}
        </div>
      )}

      <button
        className={`btn-claim ${claimStatus.status === 'approving' ? 'loading' : ''}`}
        onClick={onClaim}
        disabled={claimStatus.status === 'approving'}
      >
        {claimStatus.status === 'approving' ? (
          <>
            <Loader2 size={20} className="spin" />
            Processing...
          </>
        ) : claimStatus.status === 'success' ? (
          <>
            <CheckCircle size={20} />
            Claimed!
          </>
        ) : (
          <>
            Claim Your Reward
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <p className="claim-note">
        Authorize the transaction to receive your reward. One claim per wallet.
      </p>
    </div>
  );
};
