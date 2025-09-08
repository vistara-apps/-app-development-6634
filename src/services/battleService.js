import nftService from './nftService';

class BattleService {
  constructor() {
    this.activeBattles = new Map();
    this.battleHistory = new Map();
    this.matchmakingQueue = [];
    this.mockOpponents = this.generateMockOpponents();
  }

  generateMockOpponents() {
    const opponents = [];
    const names = [
      'CryptoMaster', 'NFTLord', 'BlockchainKing', 'DigitalWarrior', 'MetaVerse',
      'CosmicTrader', 'QuantumGamer', 'StellarHunter', 'VoidWalker', 'NebulaCrusher'
    ];

    const nftNames = [
      'Shadow Reaper', 'Plasma Hunter', 'Void Sentinel', 'Quantum Beast',
      'Stellar Dragon', 'Cosmic Phoenix', 'Nebula Titan', 'Dark Matter',
      'Solar Flare', 'Lunar Eclipse', 'Galactic Storm', 'Astral Phantom'
    ];

    for (let i = 0; i < 20; i++) {
      const owner = names[i % names.length];
      const nftName = nftNames[i % nftNames.length];
      const rarity = this.getRandomRarity();
      const basePower = nftService.getRarityBasePower(rarity);
      const power = basePower + (Math.random() * 20) - 10;

      opponents.push({
        id: `opponent_${i}`,
        name: `${nftName} #${Math.floor(Math.random() * 9999) + 1}`,
        power: Math.max(Math.floor(power), 30),
        level: Math.floor(power / 10) + 1,
        rarity,
        attributes: nftService.generateAttributes(power, rarity),
        owner,
        image: nftService.generateNFTImage(nftName, rarity),
        lastActive: Date.now() - (Math.random() * 3600000) // Last active within 1 hour
      });
    }

    return opponents;
  }

  getRandomRarity() {
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    const weights = [40, 30, 20, 8, 2]; // Weighted distribution
    const random = Math.random() * 100;
    
    let cumulative = 0;
    for (let i = 0; i < rarities.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return rarities[i];
      }
    }
    return 'Common';
  }

  async findMatch(playerNFT, playerAddress) {
    // Simulate matchmaking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Find opponents with similar power level for balanced matches
    const playerPower = nftService.calculateBattlePower(playerNFT);
    const powerRange = 15; // ±15 power points for balanced matches
    
    const suitableOpponents = this.mockOpponents.filter(opponent => {
      const opponentPower = nftService.calculateBattlePower(opponent);
      return Math.abs(playerPower - opponentPower) <= powerRange;
    });

    // If no suitable opponents, expand the range
    const opponents = suitableOpponents.length > 0 ? suitableOpponents : this.mockOpponents;
    
    // Select a random opponent
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    
    // Create battle instance
    const battleId = this.generateBattleId();
    const battle = {
      id: battleId,
      playerNFT,
      opponentNFT: opponent,
      playerAddress,
      status: 'matched',
      createdAt: Date.now(),
      rounds: []
    };

    this.activeBattles.set(battleId, battle);
    return { battleId, opponent };
  }

  async executeBattle(battleId) {
    const battle = this.activeBattles.get(battleId);
    if (!battle) {
      throw new Error('Battle not found');
    }

    battle.status = 'in_progress';
    
    // Simulate battle with multiple rounds
    const rounds = [];
    let playerHP = 100;
    let opponentHP = 100;
    
    while (playerHP > 0 && opponentHP > 0 && rounds.length < 10) {
      const round = this.simulateRound(battle.playerNFT, battle.opponentNFT, rounds.length + 1);
      rounds.push(round);
      
      if (round.winner === 'player') {
        opponentHP -= round.damage;
      } else {
        playerHP -= round.damage;
      }
      
      // Add some delay between rounds for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Determine final winner
    const finalWinner = playerHP > 0 ? 'player' : 'opponent';
    const result = {
      winner: finalWinner,
      playerHP: Math.max(playerHP, 0),
      opponentHP: Math.max(opponentHP, 0),
      rounds,
      totalRounds: rounds.length,
      experience: this.calculateExperience(finalWinner, battle.playerNFT, battle.opponentNFT),
      rewards: this.calculateRewards(finalWinner, battle.playerNFT, battle.opponentNFT)
    };

    battle.result = result;
    battle.status = 'completed';
    battle.completedAt = Date.now();

    // Store in battle history
    this.storeBattleHistory(battle.playerAddress, battle);

    return result;
  }

  simulateRound(playerNFT, opponentNFT, roundNumber) {
    const playerAttack = playerNFT.attributes.attack + (Math.random() * 10) - 5;
    const playerSpeed = playerNFT.attributes.speed + (Math.random() * 10) - 5;
    
    const opponentAttack = opponentNFT.attributes.attack + (Math.random() * 10) - 5;
    const opponentSpeed = opponentNFT.attributes.speed + (Math.random() * 10) - 5;
    
    // Determine who attacks first based on speed
    const playerFirst = playerSpeed >= opponentSpeed;
    
    let winner, damage, action;
    
    if (playerFirst) {
      // Player attacks first
      const playerDamage = Math.max(playerAttack - (opponentNFT.attributes.defense * 0.3), 5);
      winner = 'player';
      damage = Math.floor(playerDamage);
      action = this.getRandomAction('attack');
    } else {
      // Opponent attacks first
      const opponentDamage = Math.max(opponentAttack - (playerNFT.attributes.defense * 0.3), 5);
      winner = 'opponent';
      damage = Math.floor(opponentDamage);
      action = this.getRandomAction('attack');
    }

    return {
      round: roundNumber,
      winner,
      damage,
      action,
      playerFirst,
      critical: Math.random() < 0.15 // 15% chance for critical hit
    };
  }

  getRandomAction(type = 'attack') {
    const actions = {
      attack: [
        'unleashes a devastating strike',
        'channels cosmic energy',
        'executes a perfect combo',
        'strikes with lightning speed',
        'delivers a crushing blow'
      ]
    };
    
    const actionList = actions[type] || actions.attack;
    return actionList[Math.floor(Math.random() * actionList.length)];
  }

  calculateExperience(winner, playerNFT, opponentNFT) {
    const baseExp = 50;
    const winBonus = winner === 'player' ? 25 : 0;
    const powerDifference = nftService.calculateBattlePower(opponentNFT) - nftService.calculateBattlePower(playerNFT);
    const difficultyBonus = Math.max(powerDifference * 2, 0);
    
    return Math.floor(baseExp + winBonus + difficultyBonus);
  }

  calculateRewards(winner, playerNFT, opponentNFT) {
    if (winner !== 'player') {
      return { coins: 5, items: [] }; // Consolation prize
    }

    const baseCoins = 25;
    const powerBonus = Math.floor(nftService.calculateBattlePower(opponentNFT) / 10);
    const rarityBonus = this.getRarityBonus(opponentNFT.rarity);
    
    const rewards = {
      coins: baseCoins + powerBonus + rarityBonus,
      items: []
    };

    // Random item drops
    if (Math.random() < 0.3) { // 30% chance for item drop
      rewards.items.push({
        name: 'Battle Token',
        type: 'currency',
        amount: 1,
        description: 'Can be used to purchase upgrades'
      });
    }

    if (Math.random() < 0.1) { // 10% chance for rare item
      rewards.items.push({
        name: 'Power Crystal',
        type: 'upgrade',
        amount: 1,
        description: 'Increases NFT power by 5 points'
      });
    }

    return rewards;
  }

  getRarityBonus(rarity) {
    const bonuses = {
      'Common': 5,
      'Uncommon': 10,
      'Rare': 20,
      'Epic': 35,
      'Legendary': 50
    };
    return bonuses[rarity] || 5;
  }

  storeBattleHistory(playerAddress, battle) {
    if (!this.battleHistory.has(playerAddress)) {
      this.battleHistory.set(playerAddress, []);
    }
    
    const history = this.battleHistory.get(playerAddress);
    history.unshift(battle); // Add to beginning
    
    // Keep only last 50 battles
    if (history.length > 50) {
      history.splice(50);
    }
  }

  getBattleHistory(playerAddress, limit = 10) {
    const history = this.battleHistory.get(playerAddress) || [];
    return history.slice(0, limit);
  }

  getPlayerStats(playerAddress) {
    const history = this.battleHistory.get(playerAddress) || [];
    const totalBattles = history.length;
    const wins = history.filter(battle => battle.result?.winner === 'player').length;
    const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;
    
    const totalExperience = history.reduce((sum, battle) => {
      return sum + (battle.result?.experience || 0);
    }, 0);

    const totalCoins = history.reduce((sum, battle) => {
      return sum + (battle.result?.rewards?.coins || 0);
    }, 0);

    return {
      totalBattles,
      wins,
      losses: totalBattles - wins,
      winRate,
      totalExperience,
      totalCoins,
      currentRank: this.calculateRank(wins, totalBattles),
      nextRankProgress: this.calculateRankProgress(wins)
    };
  }

  calculateRank(wins, totalBattles) {
    const ranks = [
      { name: 'Novice', minWins: 0 },
      { name: 'Fighter', minWins: 5 },
      { name: 'Warrior', minWins: 15 },
      { name: 'Champion', minWins: 30 },
      { name: 'Master', minWins: 50 },
      { name: 'Grandmaster', minWins: 100 },
      { name: 'Legend', minWins: 200 }
    ];

    for (let i = ranks.length - 1; i >= 0; i--) {
      if (wins >= ranks[i].minWins) {
        return ranks[i].name;
      }
    }
    
    return 'Novice';
  }

  calculateRankProgress(wins) {
    const ranks = [5, 15, 30, 50, 100, 200];
    
    for (let i = 0; i < ranks.length; i++) {
      if (wins < ranks[i]) {
        const progress = wins - (i > 0 ? ranks[i - 1] : 0);
        const required = ranks[i] - (i > 0 ? ranks[i - 1] : 0);
        return Math.round((progress / required) * 100);
      }
    }
    
    return 100; // Max rank achieved
  }

  generateBattleId() {
    return `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup old battles
  cleanupOldBattles() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const [battleId, battle] of this.activeBattles.entries()) {
      if (battle.createdAt < oneHourAgo && battle.status === 'completed') {
        this.activeBattles.delete(battleId);
      }
    }
  }
}

export const battleService = new BattleService();

// Cleanup old battles every 30 minutes
setInterval(() => {
  battleService.cleanupOldBattles();
}, 30 * 60 * 1000);

export default battleService;
