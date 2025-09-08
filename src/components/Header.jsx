import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Zap, Sword, ShoppingBag, Mail, Home } from 'lucide-react';

const Header = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'battle', label: 'Battle', icon: Sword },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'newsletter', label: 'Intel', icon: Mail },
  ];

  return (
    <header className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-accent animate-glow" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Nebula Arena
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary text-white shadow-focus'
                      : 'text-subtle hover:text-text hover:bg-surface'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <ConnectButton />
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex justify-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-subtle hover:text-text hover:bg-surface'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;