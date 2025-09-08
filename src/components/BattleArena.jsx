import React, { useState, useEffect } from 'react';
import { Sword, Shield, Zap, Timer, Trophy } from 'lucide-react';
import NFTCard from './NFTCard';

const BattleArena = () => {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [battleState, setBattleState] = useState('selection'); // selection, battling, result
  const [battleLog, setBattleLog] = useState([]);
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);

  // Mock user NFTs
  const userNFTs = [
    {
      id: 1,
      name: 'Cosmic Warrior',
      power: 85,
      level: 12,
      rarity: 'Legendary',
      attributes: { attack: 92, defense: 78, speed: 88 }
    },
    {
      id: 2,
      name: 'Nebula Guardian',
      power: 73,
      level: 8,
      rarity: 'Epic',
      attributes: { attack: 65, defense: 95, speed: 60 }
    },
    {
      id: 3,
      name: 'Stellar Knight',
      power: 67,
      level: 6,
      rarity: 'Rare',
      attributes: { attack: 70, defense: 55, speed: 85 }
    }
  ];

  // Mock opponents
  const mockOpponents = [
    {
      id: 101,
      name: 'Shadow Reaper',
      power: 78,
      level: 10,
      rarity: 'Epic',
      attributes: { attack: 85, defense: 65, speed: 75 },
      owner: 'CryptoMaster'
    },
    {
      id: 102,
      name: 'Void Hunter',
      power: 82,
      level: 11,
      rarity: 'Legendary',
      attributes: { attack: 88, defense: 70, speed: 82 },
      owner: 'NFTWarrior'
    }
  ];

  const findMatch = () => {
    if (!selectedNFT) return;
    
    setBattleState('searching');
    setBattleLog(['🔍 Searching for opponent...']);
    
    setTimeout(() => {
      const randomOpponent = mockOpponents[Math.floor(Math.random() * mockOpponents.length)];
      setOpponent(randomOpponent);
      setBattleState('ready');
      setBattleLog(prev => [...prev, `⚔️ Opponent found: ${randomOpponent.name} (${randomOpponent.owner})`]);
    }, 2000);
  };

  const startBattle = () => {
    setBattleState('battling');
    setPlayerHP(100);
    setOpponentHP(100);
    setBattleLog(['⚡ Battle begins!']);
    
    // Simulate battle rounds
    const battleInterval = setInterval(() => {
      setBattleLog(prev => {
        const newLog = [...prev];
        
        // Player attack
        const playerDamage = Math.floor((selectedNFT.attributes.attack / 100) * (20 + Math.random() * 20));
        const opponentNewHP = Math.max(0, opponentHP - playerDamage);
        setOpponentHP(opponentNewHP);
        newLog.push(`🗡️ ${selectedNFT.name} attacks for ${playerDamage} damage!`);
        
        if (opponentNewHP <= 0) {
          newLog.push(`🏆 Victory! ${selectedNFT.name} wins!`);
          setBattleState('victory');
          clearInterval(battleInterval);
          return newLog;
        }
        
        // Opponent attack
        const opponentDamage = Math.floor((opponent.attributes.attack / 100) * (20 + Math.random() * 20));
        const playerNewHP = Math.max(0, playerHP - opponentDamage);
        setPlayerHP(playerNewHP);
        newLog.push(`⚔️ ${opponent.name} attacks for ${opponentDamage} damage!`);
        
        if (playerNewHP <= 0) {
          newLog.push(`💀 Defeat! ${opponent.name} wins!`);
          setBattleState('defeat');
          clearInterval(battleInterval);
        }
        
        return newLog;
      });
    }, 2000);
  };

  const resetBattle = () => {
    setBattleState('selection');
    setOpponent(null);
    setBattleLog([]);
    setPlayerHP(100);
    setOpponentHP(100);
  };

  if (battleState === 'selection') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Battle Arena
          </h1>
          <p className="text-subtle max-w-2xl mx-auto">
            Select your NFT and enter the arena. Battle other players to climb the leaderboard and earn rewards.
          </p>
        </div>

        <div className="glass rounded-lg p-6 neon-border">
          <h2 className="text-xl font-semibold mb-4 text-accent">Choose Your Fighter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {userNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                onSelect={setSelectedNFT}
                isSelected={selectedNFT?.id === nft.id}
              />
            ))}
          </div>

          {selectedNFT && (
            <div className="text-center space-y-4">
              <div className="glass rounded-lg p-4">
                <h3 className="font-semibold text-accent mb-2">Selected: {selectedNFT.name}</h3>
                <div className="flex justify-center items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-red-400" />
                    <span>ATK: {selectedNFT.attributes.attack}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span>DEF: {selectedNFT.attributes.defense}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Timer className="h-4 w-4 text-green-400" />
                    <span>SPD: {selectedNFT.attributes.speed}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={findMatch}
                className="bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-8 rounded-md transition-all duration-200 shadow-focus hover:shadow-lg flex items-center space-x-2 mx-auto"
              >
                <Sword className="h-5 w-5" />
                <span>Find Match</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Battle Arena
        </h1>
      </div>

      {/* Battle Status */}
      <div className="glass rounded-lg p-6 neon-border">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <h3 className="font-semibold text-accent">{selectedNFT?.name}</h3>
            <div className="w-full bg-surface rounded-full h-3 mt-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${playerHP}%` }}
              />
            </div>
            <span className="text-sm text-subtle">{playerHP}/100 HP</span>
          </div>

          <div className="text-center">
            <div className="text-2xl">⚔️</div>
            <div className="text-sm text-accent font-semibold">
              {battleState === 'searching' && 'Searching...'}
              {battleState === 'ready' && 'Ready!'}
              {battleState === 'battling' && 'Fighting!'}
              {battleState === 'victory' && 'Victory!'}
              {battleState === 'defeat' && 'Defeat!'}
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-accent">{opponent?.name || '???'}</h3>
            <div className="w-full bg-surface rounded-full h-3 mt-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${opponentHP}%` }}
              />
            </div>
            <span className="text-sm text-subtle">{opponent ? `${opponentHP}/100 HP` : '---'}</span>
          </div>
        </div>

        {battleState === 'ready' && (
          <div className="text-center">
            <button
              onClick={startBattle}
              className="bg-accent hover:bg-accent/80 text-bg font-semibold py-3 px-8 rounded-md transition-all duration-200 shadow-focus hover:shadow-lg"
            >
              Start Battle!
            </button>
          </div>
        )}

        {(battleState === 'victory' || battleState === 'defeat') && (
          <div className="text-center space-y-4">
            <div className={`text-xl font-bold ${battleState === 'victory' ? 'text-green-400' : 'text-red-400'}`}>
              {battleState === 'victory' ? (
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="h-6 w-6" />
                  <span>Victory!</span>
                </div>
              ) : (
                <span>Defeat!</span>
              )}
            </div>
            <button
              onClick={resetBattle}
              className="bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-8 rounded-md transition-all duration-200"
            >
              Battle Again
            </button>
          </div>
        )}
      </div>

      {/* Battle Log */}
      <div className="glass rounded-lg p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4 text-accent">Battle Log</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {battleLog.map((log, index) => (
            <div key={index} className="text-sm text-subtle p-2 bg-surface/50 rounded">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleArena;