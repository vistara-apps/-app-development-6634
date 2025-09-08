import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ label, value, icon: Icon, change }) => {
  const isPositive = change && change.startsWith('+');
  
  return (
    <div className="glass rounded-lg p-4 neon-border">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-primary" />
        {change && (
          <div className={`flex items-center text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span className="ml-1">{change}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-accent mb-1">{value}</div>
      <div className="text-sm text-subtle">{label}</div>
    </div>
  );
};

export default StatsCard;