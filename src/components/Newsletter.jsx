import React, { useState } from 'react';
import { Mail, Star, Zap, Crown, Bell } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState('free');
  const [subscribed, setSubscribed] = useState(false);

  const tiers = [
    {
      id: 'free',
      name: 'Intel Basic',
      price: 'Free',
      icon: Mail,
      features: [
        'Weekly arena updates',
        'Basic strategy tips',
        'Community highlights',
        'New NFT announcements'
      ],
      color: 'text-blue-400 border-blue-400/50'
    },
    {
      id: 'premium',
      name: 'Intel Pro',
      price: '$0.01/month',
      icon: Star,
      features: [
        'All Basic features',
        'Daily market analysis',
        'Exclusive battle strategies',
        'Early access to new NFTs',
        'VIP community access'
      ],
      color: 'text-accent border-accent/50'
    },
    {
      id: 'elite',
      name: 'Intel Elite',
      price: '$0.03/month',
      icon: Crown,
      features: [
        'All Pro features',
        'Personal coaching tips',
        'Private tournament invites',
        'Beta feature access',
        'Direct line to developers',
        'Exclusive airdrops'
      ],
      color: 'text-purple-400 border-purple-400/50'
    }
  ];

  const recentUpdates = [
    {
      title: 'Arena Balance Update v2.1',
      date: '2 days ago',
      excerpt: 'Major adjustments to battle mechanics and NFT power scaling...',
      type: 'Update'
    },
    {
      title: 'Weekly Champion Spotlight',
      date: '5 days ago',
      excerpt: 'Meet CryptoMaster, this week\'s top arena combatant with a 92% win rate...',
      type: 'Community'
    },
    {
      title: 'New Legendary NFTs Released',
      date: '1 week ago',
      excerpt: 'The Cosmic Destroyer series is now available in the shop with limited quantities...',
      type: 'Release'
    }
  ];

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Welcome to Intel Network!
          </h1>
          <p className="text-subtle max-w-2xl mx-auto">
            You're now subscribed to {tiers.find(t => t.id === selectedTier)?.name}. 
            Get ready for exclusive arena insights delivered directly to your inbox.
          </p>
        </div>

        <div className="glass rounded-lg p-6 neon-border text-center">
          <Bell className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Subscription Confirmed</h3>
          <p className="text-subtle mb-4">
            Your first intel briefing will arrive within 24 hours.
          </p>
          <button
            onClick={() => setSubscribed(false)}
            className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-6 rounded-md transition-all duration-200"
          >
            Manage Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Exclusive Intel Network
        </h1>
        <p className="text-subtle max-w-2xl mx-auto">
          Stay ahead of the competition with insider knowledge, strategy guides, and exclusive updates delivered directly to your inbox.
        </p>
      </div>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.id}
              className={`glass rounded-lg p-6 neon-border cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedTier === tier.id ? 'ring-2 ring-accent shadow-glow' : ''
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              <div className="text-center mb-4">
                <Icon className={`h-12 w-12 mx-auto mb-2 ${tier.color.split(' ')[0]}`} />
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <div className="text-2xl font-bold text-accent mt-2">{tier.price}</div>
              </div>

              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <Zap className="h-3 w-3 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Subscription Form */}
      <div className="glass rounded-lg p-6 neon-border">
        <h3 className="text-xl font-semibold mb-4 text-accent">Subscribe to Intel Network</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-surface border border-white/20 rounded-md px-4 py-3 text-text placeholder-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-subtle">Selected Plan:</span>
              <div className="font-semibold text-accent">
                {tiers.find(t => t.id === selectedTier)?.name} - {tiers.find(t => t.id === selectedTier)?.price}
              </div>
            </div>
            
            <button
              onClick={handleSubscribe}
              disabled={!email}
              className="bg-accent hover:bg-accent/80 disabled:bg-surface disabled:text-subtle text-bg font-semibold py-3 px-6 rounded-md transition-all duration-200 shadow-focus hover:shadow-lg"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Recent Updates Preview */}
      <div className="glass rounded-lg p-6 neon-border">
        <h3 className="text-xl font-semibold mb-4 text-accent">Recent Intel Updates</h3>
        
        <div className="space-y-4">
          {recentUpdates.map((update, index) => (
            <div key={index} className="border-l-4 border-primary pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold">{update.title}</h4>
                <span className="text-xs text-subtle">{update.date}</span>
              </div>
              <p className="text-subtle text-sm mb-2">{update.excerpt}</p>
              <span className="inline-block bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                {update.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;