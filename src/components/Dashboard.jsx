import React from 'react';
import { Sword, Trophy, Star, TrendingUp } from 'lucide-react';
import NFTCard from './NFTCard';
import StatsCard from './StatsCard';

const Dashboard = ({ onNavigate }) => {
  // Mock NFT data
  const userNFTs = [
    {
      id: 1,
      name: 'Cosmic Warrior',
      image: '/api/placeholder/200/200',
      power: 85,
      level: 12,
      rarity: 'Legendary',
      attributes: { attack: 92, defense: 78, speed: 88 }
    },
    {
      id: 2,
      name: 'Nebula Guardian',
      image: '/api/placeholder/200/200',
      power: 73,
      level: 8,
      rarity: 'Epic',
      attributes: { attack: 65, defense: 95, speed: 60 }
    },
    {
      id: 3,
      name: 'Stellar Knight',
      image: '/api/placeholder/200/200',
      power: 67,
      level: 6,
      rarity: 'Rare',
      attributes: { attack: 70, defense: 55, speed: 85 }
    }
  ];

  const stats = [
    { label: 'Total Battles', value: '47', icon: Sword, change: '+12%' },
    { label: 'Win Rate', value: '68%', icon: Trophy, change: '+5%' },
    { label: 'Arena Rank', value: '#342', icon: Star, change: '+23' },
    { label: 'Total Power', value: '225', icon: TrendingUp, change: '+8%' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Welcome to the Arena
        </h1>
        <p className="text-subtle max-w-2xl mx-auto">
          Dominate the NFT Arena with your collection. Battle other players, climb the ranks, and earn exclusive rewards.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-lg p-6 neon-border">
          <h3 className="text-xl font-semibold mb-4 text-accent">Quick Battle</h3>
          <p className="text-subtle mb-4">
            Jump into a match and test your NFTs against other players in the arena.
          </p>
          <button
            onClick={() => onNavigate('battle')}
            className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-md transition-all duration-200 shadow-focus hover:shadow-lg"
          >
            Find Match
          </button>
        </div>

        <div className="glass rounded-lg p-6 neon-border">
          <h3 className="text-xl font-semibold mb-4 text-accent">Upgrade Arsenal</h3>
          <p className="text-subtle mb-4">
            Visit the shop to acquire new NFTs or upgrade your existing collection.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full bg-accent hover:bg-accent/80 text-bg font-semibold py-3 px-6 rounded-md transition-all duration-200 shadow-focus hover:shadow-lg"
          >
            Browse Shop
          </button>
        </div>
      </div>

      {/* NFT Collection */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your NFT Collection</h2>
          <span className="text-subtle">{userNFTs.length} NFTs</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userNFTs.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>

        {userNFTs.length === 0 && (
          <div className="text-center py-12">
            <div className="glass rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">No NFTs Found</h3>
              <p className="text-subtle mb-4">
                Get started by acquiring your first battle-ready NFT from our shop.
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
              >
                Visit Shop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;