import React, { useState, useEffect } from 'react';
import { Sword, Trophy, Star, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import NFTCard from './NFTCard';
import StatsCard from './StatsCard';
import nftService from '../services/nftService';
import battleService from '../services/battleService';
import { useBaseMiniApp } from '../hooks/useBaseMiniApp';

const Dashboard = ({ onNavigate }) => {
  const { address } = useAccount();
  const { setPrimaryButton, showNotification } = useBaseMiniApp();
  const [userNFTs, setUserNFTs] = useState([]);
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (address) {
      loadDashboardData();
    }
  }, [address]);

  useEffect(() => {
    // Set primary button for Base MiniApp
    setPrimaryButton({
      text: 'Find Battle',
      action: () => onNavigate('battle')
    });
  }, [setPrimaryButton, onNavigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load NFTs and battle stats in parallel
      const [nfts, stats] = await Promise.all([
        nftService.getUserNFTs(address),
        battleService.getPlayerStats(address)
      ]);

      setUserNFTs(nfts);
      setPlayerStats(stats);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatsData = () => {
    if (!playerStats) {
      return [
        { label: 'Total Battles', value: '0', icon: Sword, change: '+0%' },
        { label: 'Win Rate', value: '0%', icon: Trophy, change: '+0%' },
        { label: 'Arena Rank', value: 'Novice', icon: Star, change: '+0' },
        { label: 'Total Power', value: '0', icon: TrendingUp, change: '+0%' }
      ];
    }

    const totalPower = userNFTs.reduce((sum, nft) => sum + nft.power, 0);
    
    return [
      { 
        label: 'Total Battles', 
        value: playerStats.totalBattles.toString(), 
        icon: Sword, 
        change: `+${Math.max(playerStats.totalBattles - 5, 0)}` 
      },
      { 
        label: 'Win Rate', 
        value: `${playerStats.winRate}%`, 
        icon: Trophy, 
        change: `+${Math.max(playerStats.winRate - 50, 0)}%` 
      },
      { 
        label: 'Arena Rank', 
        value: playerStats.currentRank, 
        icon: Star, 
        change: `${playerStats.nextRankProgress}%` 
      },
      { 
        label: 'Total Power', 
        value: totalPower.toString(), 
        icon: TrendingUp, 
        change: `+${Math.floor(totalPower * 0.1)}` 
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-subtle">Loading your arena data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center glass rounded-lg p-8 max-w-md">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-subtle mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        {getStatsData().map((stat, index) => (
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
