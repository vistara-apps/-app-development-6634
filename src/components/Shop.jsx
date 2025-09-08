import React, { useState } from 'react';
import { ShoppingBag, Star, Zap, Shield, Wind } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const Shop = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchased, setPurchased] = useState(new Set());
  const { createSession } = usePaymentContext();

  const shopItems = [
    {
      id: 1,
      name: 'Quantum Destroyer',
      price: '$0.05',
      rarity: 'Legendary',
      power: 95,
      attributes: { attack: 98, defense: 85, speed: 92 },
      description: 'A devastating cosmic warrior with unmatched offensive capabilities.'
    },
    {
      id: 2,
      name: 'Void Sentinel',
      price: '$0.03',
      rarity: 'Epic',
      power: 88,
      attributes: { attack: 75, defense: 98, speed: 82 },
      description: 'An impenetrable guardian that excels in defensive strategies.'
    },
    {
      id: 3,
      name: 'Lightning Striker',
      price: '$0.02',
      rarity: 'Rare',
      power: 82,
      attributes: { attack: 85, defense: 70, speed: 99 },
      description: 'Swift and agile, perfect for hit-and-run tactics.'
    },
    {
      id: 4,
      name: 'Cosmic Blade',
      price: '$0.01',
      rarity: 'Uncommon',
      power: 75,
      attributes: { attack: 88, defense: 65, speed: 78 },
      description: 'A balanced fighter with solid all-around capabilities.'
    },
    {
      id: 5,
      name: 'Nebula Scout',
      price: '$0.005',
      rarity: 'Common',
      power: 68,
      attributes: { attack: 70, defense: 60, speed: 85 },
      description: 'A reliable starter NFT for new arena combatants.'
    },
    {
      id: 6,
      name: 'Power Upgrade Kit',
      price: '$0.01',
      rarity: 'Enhancement',
      power: '+10',
      attributes: { attack: '+5', defense: '+3', speed: '+2' },
      description: 'Enhance your existing NFT with this power boost package.'
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-accent border-accent/50 bg-accent/10';
      case 'epic': return 'text-purple-400 border-purple-400/50 bg-purple-400/10';
      case 'rare': return 'text-blue-400 border-blue-400/50 bg-blue-400/10';
      case 'uncommon': return 'text-green-400 border-green-400/50 bg-green-400/10';
      case 'enhancement': return 'text-orange-400 border-orange-400/50 bg-orange-400/10';
      default: return 'text-subtle border-subtle/50 bg-subtle/10';
    }
  };

  const handlePurchase = async (item) => {
    try {
      await createSession();
      setPurchased(prev => new Set([...prev, item.id]));
      setSelectedItem(null);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Cosmic Shop
        </h1>
        <p className="text-subtle max-w-2xl mx-auto">
          Acquire powerful NFTs and upgrades to dominate the arena. Each purchase is secured on the Base blockchain.
        </p>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item) => {
          const isPurchased = purchased.has(item.id);
          
          return (
            <div
              key={item.id}
              className={`glass rounded-lg p-6 neon-border transition-all duration-200 hover:scale-105 cursor-pointer ${
                selectedItem?.id === item.id ? 'ring-2 ring-accent shadow-glow' : ''
              } ${isPurchased ? 'opacity-75' : ''}`}
              onClick={() => !isPurchased && setSelectedItem(item)}
            >
              {/* Item Image */}
              <div className="relative mb-4">
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-md flex items-center justify-center">
                  <div className="text-6xl">
                    {item.rarity === 'Enhancement' ? '⚡' : '🚀'}
                  </div>
                </div>
                {isPurchased && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
                    Owned
                  </div>
                )}
                <div className={`absolute top-2 right-2 rounded-full px-2 py-1 ${getRarityColor(item.rarity)}`}>
                  <span className="text-xs font-semibold">{item.rarity}</span>
                </div>
              </div>

              {/* Item Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-subtle text-sm">{item.description}</p>
                </div>

                {/* Power Score */}
                <div className="flex items-center justify-between">
                  <span className="text-subtle text-sm">
                    {item.rarity === 'Enhancement' ? 'Boost' : 'Power Score'}
                  </span>
                  <span className="font-bold text-accent text-lg">{item.power}</span>
                </div>

                {/* Attributes */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-red-400" />
                    <span>{item.attributes.attack}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-blue-400" />
                    <span>{item.attributes.defense}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind className="h-3 w-3 text-green-400" />
                    <span>{item.attributes.speed}</span>
                  </div>
                </div>

                {/* Price and Purchase */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent">{item.price}</span>
                    {!isPurchased && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchase(item);
                        }}
                        className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 flex items-center space-x-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Buy</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Purchase Modal */}
      {selectedItem && !purchased.has(selectedItem.id) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-lg p-6 max-w-md w-full neon-border">
            <h3 className="text-xl font-semibold mb-4 text-accent">Confirm Purchase</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Item:</span>
                <span className="font-semibold">{selectedItem.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-bold text-accent">{selectedItem.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span>Base Chain</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 bg-surface hover:bg-surface/80 text-text font-semibold py-3 px-4 rounded-md transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePurchase(selectedItem)}
                className="flex-1 bg-accent hover:bg-accent/80 text-bg font-semibold py-3 px-4 rounded-md transition-all duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;