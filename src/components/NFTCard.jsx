import React from 'react';
import { Star, Zap, Shield, Wind } from 'lucide-react';

const NFTCard = ({ nft, onSelect, isSelected = false }) => {
  const getRarityColor = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-accent border-accent/50';
      case 'epic': return 'text-purple-400 border-purple-400/50';
      case 'rare': return 'text-blue-400 border-blue-400/50';
      default: return 'text-subtle border-subtle/50';
    }
  };

  return (
    <div 
      className={`glass rounded-lg p-4 neon-border transition-all duration-200 hover:scale-105 cursor-pointer ${
        isSelected ? 'ring-2 ring-accent shadow-glow' : ''
      }`}
      onClick={() => onSelect && onSelect(nft)}
    >
      {/* NFT Image */}
      <div className="relative mb-4">
        <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-md flex items-center justify-center">
          <div className="text-6xl">🚀</div>
        </div>
        <div className="absolute top-2 right-2 bg-surface/80 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs font-semibold text-accent">Lvl {nft.level}</span>
        </div>
      </div>

      {/* NFT Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg truncate">{nft.name}</h3>
          <div className={`text-sm font-medium ${getRarityColor(nft.rarity)}`}>
            {nft.rarity}
          </div>
        </div>

        {/* Power Score */}
        <div className="flex items-center justify-between">
          <span className="text-subtle text-sm">Power Score</span>
          <span className="font-bold text-accent text-lg">{nft.power}</span>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3 text-red-400" />
            <span>{nft.attributes.attack}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3 text-blue-400" />
            <span>{nft.attributes.defense}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="h-3 w-3 text-green-400" />
            <span>{nft.attributes.speed}</span>
          </div>
        </div>

        {/* Power Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-subtle">
            <span>Battle Ready</span>
            <span>{nft.power}%</span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(nft.power, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;