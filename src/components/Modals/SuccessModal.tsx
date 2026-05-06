import React from 'react';
import {
  REWARD_AMOUNT,
  TOKEN_SYMBOL,
  BONUS_AMOUNT,
  BONUS_SYMBOL,
} from '../../constants';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">🎉</div>
        <h2>Reward Claimed!</h2>
        <p>
          Your {REWARD_AMOUNT} {TOKEN_SYMBOL} + {BONUS_AMOUNT} {BONUS_SYMBOL}{' '}
          has been sent to your wallet.
        </p>
        <button className="btn-modal" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
};
