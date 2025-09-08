import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BattleArena from './components/BattleArena';
import Shop from './components/Shop';
import Newsletter from './components/Newsletter';
import FloatingParticles from './components/FloatingParticles';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isConnected } = useAccount();

  const renderContent = () => {
    switch (activeTab) {
      case 'battle':
        return <BattleArena />;
      case 'shop':
        return <Shop />;
      case 'newsletter':
        return <Newsletter />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text relative overflow-hidden">
      <FloatingParticles />
      <div className="relative z-10">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {isConnected ? (
            renderContent()
          ) : (
            <div className="text-center py-20">
              <div className="glass rounded-lg p-8 max-w-md mx-auto neon-border">
                <h2 className="text-2xl font-bold mb-4 text-accent">Welcome to Nebula Arena</h2>
                <p className="text-subtle mb-6">Connect your wallet to start battling with NFTs and dominating the arena!</p>
                <div className="text-sm text-subtle">
                  Click "Connect Wallet" in the header to begin your journey.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;