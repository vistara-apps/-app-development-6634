import React, { useState, useEffect } from 'react';
import { Sword, Shield, Zap, Timer, Trophy, Loader2, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import NFTCard from './NFTCard';
import nftService from '../services/nftService';
import battleService from '../services/battleService';
import { useBaseMiniApp } from '../hooks/useBaseMiniApp';

const BattleArena = () => {
  const { address } = useAccount();
  const { setPrimaryButton, showNotification, triggerInFrameAction } = useBaseMiniApp();
  
  const [userNFTs, setUserNFTs] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [battleState, setBattleState] = useState('selection'); // selection, matchmaking, battling, result
  const [battleResult, setBattleResult] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [currentBattleId, setCurrentBattleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (address) {
      loadUserNFTs();
    }
  }, [address]);

  useEffect(() => {
    // Update primary button based on battle state
    updatePrimaryButton();
  }, [battleState, selectedNFT]);

  const loadUserNFTs = async () => {
    try {
      setLoading(true);
      setError(null);
      const nfts = await nftService.getUserNFTs(address);
      setUserNFTs(nfts);
      
      if (nfts.length === 0) {
        setError('No NFTs found. Visit the shop to acquire battle-ready NFTs.');
      }
    } catch (err) {
      console.error('Error loading NFTs:', err);
      setError('Failed to load your NFTs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updatePrimaryButton = () => {
    switch (battleState) {
      case 'selection':
        setPrimaryButton({
          text: selectedNFT ? 'Find Match' : 'Select NFT',
          action: selectedNFT ? findMatch : null,
          disabled: !selectedNFT
        });
        break;
      case 'matchmaking':
        setPrimaryButton({
          text: 'Finding Opponent...',
          disabled: true
        });
        break;
      case 'battling':
        setPrimaryButton({
          text: 'Battle in Progress...',
          disabled: true
        });
        break;
      case 'result':
        setPrimaryButton({
          text: 'Battle Again',
          action: resetBattle
        });
        break;
      default:
        setPrimaryButton({ text: 'Battle Arena' });
    }
  };

  const findMatch = async () => {
    if (!selectedNFT) return;

    try {
      setBattleState('matchmaking');
      showNotification('Searching for opponent...', 'info');
      
      const { battleId, opponent: foundOpponent } = await battleService.findMatch(selectedNFT, address);
      
      setCurrentBattleId(battleId);
      setOpponent(foundOpponent);
      setBattleState('battling');
      
      showNotification(`Opponent found: ${foundOpponent.owner}`, 'success');
      triggerInFrameAction('BATTLE_MATCHED', { opponent: foundOpponent.name });
      
      // Start the battle
      executeBattle(battleId);
    } catch (err) {
      console.error('Error finding match:', err);
      setError('Failed to find a match. Please try again.');
      setBattleState('selection');
      showNotification('Failed to find match', 'error');
    }
  };

  const executeBattle = async (battleId) => {
    try {
      setBattleLog([]);
      setPlayerHP(100);
      setOpponentHP(100);
      
      const result = await battleService.executeBattle(battleId);
      
      // Animate the battle rounds
      for (let i = 0; i < result.rounds.length; i++) {
        const round = result.rounds[i];
        
        // Add round to battle log
        setBattleLog(prev => [...prev, {
          round: round.round,
          text: `Round ${round.round}: ${round.winner === 'player' ? selectedNFT.name : opponent.name} ${round.action} for ${round.damage} damage!`,
          winner: round.winner,
          critical: round.critical
        }]);
        
        // Update HP
        if (round.winner === 'player') {
          setOpponentHP(prev => Math.max(prev - round.damage, 0));
        } else {
          setPlayerHP(prev => Math.max(prev - round.damage, 0));
        }
        
        // Wait between rounds for animation
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setBattleResult(result);
      setBattleState('result');
      
      const winMessage = result.winner === 'player' ? 'Victory!' : 'Defeat!';
      showNotification(winMessage, result.winner === 'player' ? 'success' : 'error');
      
      triggerInFrameAction('BATTLE_COMPLETED', { 
        winner: result.winner,
        experience: result.experience,
        rewards: result.rewards
      });
      
    } catch (err) {
      console.error('Error executing battle:', err);
      setError('Battle failed. Please try again.');
      setBattleState('selection');
      showNotification('Battle failed', 'error');
    }
  };

  const resetBattle = () => {
    setSelectedNFT(null);
    setOpponent(null);
    setBattleResult(null);
    setBattleLog([]);
    setPlayerHP(100);
    setOpponentHP(100);
    setCurrentBattleId(null);
    setBattleState('selection');
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-subtle">Loading your NFTs...</p>
        </div>
      </div>
    );
  }

  if (error && userNFTs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center glass rounded-lg p-8 max-w-md">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-semibold mb-2">No NFTs Available</h3>
          <p className="text-subtle mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '#shop'}
            className="bg-accent hover:bg-accent/80 text-bg font-semibold py-2 px-4 rounded-md transition-all duration-200"
          >
            Visit Shop
          </button>
        </div>
      </div>
    );
  }

  // Render battle selection screen
  if (battleState === 'selection') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Battle Arena
          </h1>
          <p className="text-subtle">Select your NFT warrior and enter the arena!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userNFTs.map((nft) => (
            <div
              key={nft.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedNFT?.id === nft.id
                  ? 'ring-2 ring-accent scale-105'
                  : 'hover:scale-102'
              }`}
              onClick={() => setSelectedNFT(nft)}
            >
              <NFTCard nft={nft} />
            </div>
          ))}
        </div>

        {selectedNFT && (
          <div className="glass rounded-lg p-6 neon-border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Selected Warrior</h3>
            <div className="flex items-center space-x-4">
              <img
                src={selectedNFT.image}
                alt={selectedNFT.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold">{selectedNFT.name}</h4>
                <p className="text-sm text-subtle">Power: {selectedNFT.power} | Level: {selectedNFT.level}</p>
                <div className="flex space-x-4 text-xs text-subtle mt-1">
                  <span>ATK: {selectedNFT.attributes.attack}</span>
                  <span>DEF: {selectedNFT.attributes.defense}</span>
                  <span>SPD: {selectedNFT.attributes.speed}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render matchmaking screen
  if (battleState === 'matchmaking') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center glass rounded-lg p-8 max-w-md">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-accent" />
          <h3 className="text-xl font-semibold mb-2">Finding Opponent</h3>
          <p className="text-subtle">Searching for a worthy challenger...</p>
        </div>
      </div>
    );
  }

  // Render battle screen
  if (battleState === 'battling') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Battle in Progress
          </h1>
        </div>

        {/* Battle Arena */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Player NFT */}
          <div className="glass rounded-lg p-6 neon-border">
            <div className="text-center">
              <img
                src={selectedNFT.image}
                alt={selectedNFT.name}
                className="w-24 h-24 mx-auto rounded-lg object-cover mb-4"
              />
              <h3 className="font-semibold text-accent">{selectedNFT.name}</h3>
              <div className="mt-2">
                <div className="bg-surface rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-500"
                    style={{ width: `${playerHP}%` }}
                  />
                </div>
                <p className="text-sm text-subtle mt-1">HP: {playerHP}/100</p>
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <div className="text-4xl font-bold text-accent animate-pulse">VS</div>
          </div>

          {/* Opponent NFT */}
          <div className="glass rounded-lg p-6 neon-border">
            <div className="text-center">
              <img
                src={opponent?.image}
                alt={opponent?.name}
                className="w-24 h-24 mx-auto rounded-lg object-cover mb-4"
              />
              <h3 className="font-semibold text-accent">{opponent?.name}</h3>
              <p className="text-xs text-subtle">{opponent?.owner}</p>
              <div className="mt-2">
                <div className="bg-surface rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-500"
                    style={{ width: `${opponentHP}%` }}
                  />
                </div>
                <p className="text-sm text-subtle mt-1">HP: {opponentHP}/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Log */}
        <div className="glass rounded-lg p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4 text-accent">Battle Log</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {battleLog.map((log, index) => (
              <div
                key={index}
                className={`text-sm p-2 rounded ${
                  log.winner === 'player'
                    ? 'bg-green-500/20 text-green-300'
                    : log.winner === 'opponent'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-surface text-subtle'
                } ${log.critical ? 'font-bold animate-pulse' : ''}`}
              >
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render battle result screen
  if (battleState === 'result' && battleResult) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className={`text-4xl font-bold mb-4 ${
            battleResult.winner === 'player' 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {battleResult.winner === 'player' ? '🏆 Victory!' : '💀 Defeat!'}
          </h1>
          <p className="text-subtle">
            {battleResult.winner === 'player' 
              ? 'Congratulations! You dominated the arena!' 
              : 'Better luck next time, warrior!'}
          </p>
        </div>

        {/* Battle Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-lg p-6 neon-border">
            <h3 className="text-lg font-semibold mb-4 text-accent">Battle Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Rounds:</span>
                <span>{battleResult.totalRounds}</span>
              </div>
              <div className="flex justify-between">
                <span>Your Final HP:</span>
                <span className="text-green-400">{battleResult.playerHP}</span>
              </div>
              <div className="flex justify-between">
                <span>Opponent Final HP:</span>
                <span className="text-red-400">{battleResult.opponentHP}</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-lg p-6 neon-border">
            <h3 className="text-lg font-semibold mb-4 text-accent">Rewards</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Experience:</span>
                <span className="text-blue-400">+{battleResult.experience} XP</span>
              </div>
              <div className="flex justify-between">
                <span>Coins:</span>
                <span className="text-yellow-400">+{battleResult.rewards.coins}</span>
              </div>
              {battleResult.rewards.items.length > 0 && (
                <div>
                  <span className="text-subtle">Items:</span>
                  {battleResult.rewards.items.map((item, index) => (
                    <div key={index} className="ml-4 text-purple-400">
                      {item.name} x{item.amount}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetBattle}
            className="bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-8 rounded-md transition-all duration-200 shadow-focus hover:shadow-lg"
          >
            Battle Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default BattleArena;
