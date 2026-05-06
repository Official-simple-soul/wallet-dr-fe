import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🔬</span>
          <h1>Wallet Drainer Simulator</h1>
        </div>
        <div className="badge-container">
          <span className="badge badge-danger">SECURITY AWARENESS</span>
          <span className="badge badge-warning">EDUCATIONAL ONLY</span>
        </div>
      </div>
      <p className="subtitle">
        Learn how to protect yourself from crypto wallet drainers
      </p>
    </div>
  );
};
