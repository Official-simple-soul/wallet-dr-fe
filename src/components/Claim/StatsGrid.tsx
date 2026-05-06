import React from 'react';
import { Users, TrendingUp, Coins } from 'lucide-react';

const stats = [
  { icon: Users, value: '12,847', label: 'Claimed' },
  { icon: TrendingUp, value: '$4.2M', label: 'Distributed' },
  { icon: Coins, value: '5,000', label: 'USDT Reward' },
];

export const StatsGrid: React.FC = () => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <stat.icon size={20} />
          <div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
