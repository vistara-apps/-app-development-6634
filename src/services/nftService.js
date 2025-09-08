import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Create a public client for Base chain
const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

// Mock NFT contract addresses for demo purposes
const MOCK_NFT_CONTRACTS = [
  '0x1234567890123456789012345678901234567890',
  '0x2345678901234567890123456789012345678901',
  '0x3456789012345678901234567890123456789012'
];

class NFTService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async getUserNFTs(walletAddress) {
    if (!walletAddress) return [];

    const cacheKey = `nfts_${walletAddress}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      // In a real implementation, you would query actual NFT contracts
      // For now, we'll return mock data with some randomization based on wallet
      const mockNFTs = await this.generateMockNFTs(walletAddress);
      
      this.cache.set(cacheKey, {
        data: mockNFTs,
        timestamp: Date.now()
      });

      return mockNFTs;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return this.getFallbackNFTs();
    }
  }

  async generateMockNFTs(walletAddress) {
    // Generate deterministic NFTs based on wallet address
    const seed = this.hashCode(walletAddress);
    const nftCount = (seed % 5) + 1; // 1-5 NFTs
    
    const nfts = [];
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    const names = [
      'Cosmic Warrior', 'Nebula Guardian', 'Stellar Knight', 'Void Sentinel',
      'Quantum Destroyer', 'Lightning Striker', 'Shadow Reaper', 'Plasma Hunter',
      'Galactic Defender', 'Astral Mage', 'Solar Paladin', 'Lunar Assassin'
    ];

    for (let i = 0; i < nftCount; i++) {
      const nftSeed = seed + i;
      const rarity = rarities[nftSeed % rarities.length];
      const name = names[nftSeed % names.length];
      
      // Calculate power based on rarity
      const basePower = this.getRarityBasePower(rarity);
      const power = basePower + (nftSeed % 20) - 10; // ±10 variation
      
      const nft = {
        id: `${walletAddress}_${i}`,
        name: `${name} #${(nftSeed % 9999) + 1}`,
        image: this.generateNFTImage(name, rarity),
        power: Math.max(power, 30),
        level: Math.floor(power / 10) + 1,
        rarity,
        attributes: this.generateAttributes(power, rarity),
        contractAddress: MOCK_NFT_CONTRACTS[i % MOCK_NFT_CONTRACTS.length],
        tokenId: (nftSeed % 10000).toString(),
        metadata: {
          description: `A powerful ${rarity.toLowerCase()} warrior from the Nebula Arena`,
          traits: this.generateTraits(rarity)
        }
      };
      
      nfts.push(nft);
    }

    return nfts.sort((a, b) => b.power - a.power);
  }

  getRarityBasePower(rarity) {
    const powerMap = {
      'Common': 45,
      'Uncommon': 60,
      'Rare': 75,
      'Epic': 85,
      'Legendary': 95
    };
    return powerMap[rarity] || 50;
  }

  generateAttributes(power, rarity) {
    const multiplier = this.getRarityMultiplier(rarity);
    const base = Math.floor(power * 0.8);
    
    return {
      attack: Math.floor(base + (Math.random() * 20 * multiplier)),
      defense: Math.floor(base + (Math.random() * 20 * multiplier)),
      speed: Math.floor(base + (Math.random() * 20 * multiplier))
    };
  }

  getRarityMultiplier(rarity) {
    const multipliers = {
      'Common': 0.8,
      'Uncommon': 0.9,
      'Rare': 1.0,
      'Epic': 1.1,
      'Legendary': 1.2
    };
    return multipliers[rarity] || 1.0;
  }

  generateTraits(rarity) {
    const traits = [
      { trait_type: 'Rarity', value: rarity },
      { trait_type: 'Element', value: ['Fire', 'Water', 'Earth', 'Air', 'Dark', 'Light'][Math.floor(Math.random() * 6)] },
      { trait_type: 'Class', value: ['Warrior', 'Mage', 'Archer', 'Assassin', 'Paladin'][Math.floor(Math.random() * 5)] },
      { trait_type: 'Origin', value: ['Nebula', 'Cosmic', 'Stellar', 'Void', 'Quantum'][Math.floor(Math.random() * 5)] }
    ];
    
    return traits;
  }

  generateNFTImage(name, rarity) {
    // In a real implementation, this would return actual IPFS URLs
    // For now, return placeholder images with different colors based on rarity
    const colors = {
      'Common': '808080',
      'Uncommon': '00ff00',
      'Rare': '0080ff',
      'Epic': '8000ff',
      'Legendary': 'ffd700'
    };
    
    const color = colors[rarity] || '808080';
    return `https://via.placeholder.com/300x300/${color}/ffffff?text=${encodeURIComponent(name)}`;
  }

  getFallbackNFTs() {
    return [
      {
        id: 'fallback_1',
        name: 'Cosmic Warrior #1',
        image: 'https://via.placeholder.com/300x300/ffd700/ffffff?text=Cosmic+Warrior',
        power: 85,
        level: 12,
        rarity: 'Legendary',
        attributes: { attack: 92, defense: 78, speed: 88 },
        contractAddress: MOCK_NFT_CONTRACTS[0],
        tokenId: '1',
        metadata: {
          description: 'A legendary warrior from the cosmos',
          traits: [
            { trait_type: 'Rarity', value: 'Legendary' },
            { trait_type: 'Element', value: 'Light' },
            { trait_type: 'Class', value: 'Warrior' }
          ]
        }
      }
    ];
  }

  async getNFTMetadata(contractAddress, tokenId) {
    try {
      // In a real implementation, you would call the tokenURI function
      // and fetch metadata from IPFS
      return {
        name: `NFT #${tokenId}`,
        description: 'A battle-ready NFT from Nebula Arena',
        image: `https://via.placeholder.com/300x300/0080ff/ffffff?text=NFT+${tokenId}`,
        attributes: []
      };
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      return null;
    }
  }

  // Utility function to generate deterministic hash from string
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Battle-related methods
  calculateBattlePower(nft) {
    const { attack, defense, speed } = nft.attributes;
    return Math.floor((attack * 0.4) + (defense * 0.3) + (speed * 0.3));
  }

  simulateBattle(playerNFT, opponentNFT) {
    const playerPower = this.calculateBattlePower(playerNFT);
    const opponentPower = this.calculateBattlePower(opponentNFT);
    
    // Add some randomness to battles
    const playerRoll = playerPower + (Math.random() * 20) - 10;
    const opponentRoll = opponentPower + (Math.random() * 20) - 10;
    
    const winner = playerRoll > opponentRoll ? 'player' : 'opponent';
    const margin = Math.abs(playerRoll - opponentRoll);
    
    return {
      winner,
      playerScore: Math.round(playerRoll),
      opponentScore: Math.round(opponentRoll),
      margin: Math.round(margin),
      decisive: margin > 15
    };
  }
}

export const nftService = new NFTService();
export default nftService;
