import React from 'react';

export const WarningBanner: React.FC = () => {
  return (
    <div className="warning-banner">
      <div className="warning-content">
        <span className="warning-icon">⚠️</span>
        <div className="warning-text">
          <strong>Educational Simulation Only</strong> - No real transactions
          are executed. This tool is designed to teach you about wallet drainer
          attack patterns.
        </div>
      </div>
    </div>
  );
};
