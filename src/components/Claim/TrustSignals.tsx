import React from 'react';

const signals = [
  { icon: '🛡️', label: 'Audited Contract' },
  { icon: '🔒', label: 'Secure Connection' },
  { icon: '⏱️', label: 'Instant Payout' },
  { icon: '🌊', label: 'Liquidity Locked' },
];

export const TrustSignals: React.FC = () => {
  return (
    <div className="trust-signals">
      {signals.map((signal, index) => (
        <div key={index} className="trust-item">
          <div className="trust-icon">{signal.icon}</div>
          <span>{signal.label}</span>
        </div>
      ))}
    </div>
  );
};
