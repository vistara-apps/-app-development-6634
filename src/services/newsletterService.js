class NewsletterService {
  constructor() {
    this.subscribers = new Map();
    this.newsletters = this.generateMockNewsletters();
    this.subscriptionTiers = {
      free: {
        id: 'free',
        name: 'Intel Basic',
        price: 0,
        features: [
          'Weekly arena updates',
          'Basic strategy tips',
          'Community highlights',
          'New NFT announcements'
        ]
      },
      premium: {
        id: 'premium',
        name: 'Intel Pro',
        price: 0.01,
        features: [
          'All Basic features',
          'Daily market analysis',
          'Exclusive battle strategies',
          'Early access to new NFTs',
          'VIP community access'
        ]
      },
      elite: {
        id: 'elite',
        name: 'Intel Elite',
        price: 0.03,
        features: [
          'All Pro features',
          'Personal coaching tips',
          'Private tournament invites',
          'Beta feature access',
          'Direct line to developers',
          'Exclusive airdrops'
        ]
      }
    };
  }

  generateMockNewsletters() {
    const newsletters = [];
    const titles = [
      'Arena Weekly: New Champions Rise',
      'Battle Strategies: Mastering the Meta',
      'NFT Spotlight: Legendary Drops',
      'Community Roundup: Player Achievements',
      'Developer Update: New Features Coming',
      'Market Analysis: Trending NFTs',
      'Tournament Results: Epic Battles',
      'Strategy Guide: Advanced Tactics'
    ];

    const content = [
      'This week saw incredible battles in the Nebula Arena with new champions emerging from every corner of the galaxy...',
      'Learn the latest meta strategies that top players are using to dominate the arena. Our analysis reveals...',
      'Discover the most sought-after NFTs this week and what makes them special in battle scenarios...',
      'Celebrating our amazing community members who achieved remarkable milestones this week...',
      'Exciting new features are coming to Nebula Arena! Get a sneak peek at what\'s in development...',
      'Market trends show interesting patterns in NFT trading. Here\'s what you need to know...',
      'Recap of this week\'s tournaments with highlights from the most epic battles...',
      'Advanced tactics and strategies from pro players to help you climb the ranks...'
    ];

    for (let i = 0; i < 8; i++) {
      newsletters.push({
        id: `newsletter_${i + 1}`,
        title: titles[i],
        content: content[i],
        excerpt: content[i].substring(0, 120) + '...',
        publishedAt: Date.now() - (i * 7 * 24 * 60 * 60 * 1000), // Weekly intervals
        tier: i % 3 === 0 ? 'free' : i % 3 === 1 ? 'premium' : 'elite',
        readTime: Math.floor(Math.random() * 5) + 3, // 3-7 minutes
        tags: this.generateTags(i),
        author: 'Nebula Arena Team',
        featured: i < 2
      });
    }

    return newsletters.sort((a, b) => b.publishedAt - a.publishedAt);
  }

  generateTags(index) {
    const allTags = [
      'Strategy', 'NFTs', 'Battles', 'Community', 'Updates', 'Analysis',
      'Tournament', 'Tips', 'Meta', 'Legendary', 'Trading', 'Rankings'
    ];
    
    const numTags = Math.floor(Math.random() * 3) + 2; // 2-4 tags
    const tags = [];
    
    for (let i = 0; i < numTags; i++) {
      const tag = allTags[(index + i) % allTags.length];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    return tags;
  }

  async subscribe(email, walletAddress, tier = 'free') {
    if (!email || !walletAddress) {
      throw new Error('Email and wallet address are required');
    }

    if (!this.subscriptionTiers[tier]) {
      throw new Error('Invalid subscription tier');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const subscription = {
      id: this.generateSubscriptionId(),
      email,
      walletAddress,
      tier,
      subscribedAt: Date.now(),
      active: true,
      preferences: {
        frequency: tier === 'elite' ? 'daily' : tier === 'premium' ? 'weekly' : 'weekly',
        topics: ['battles', 'nfts', 'community'],
        notifications: true
      },
      stats: {
        emailsReceived: 0,
        emailsOpened: 0,
        lastOpened: null
      }
    };

    this.subscribers.set(walletAddress, subscription);
    
    // Simulate sending welcome email
    await this.sendWelcomeEmail(subscription);
    
    return subscription;
  }

  async unsubscribe(walletAddress) {
    const subscription = this.subscribers.get(walletAddress);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.active = false;
    subscription.unsubscribedAt = Date.now();
    
    return { success: true, message: 'Successfully unsubscribed' };
  }

  async updateSubscription(walletAddress, updates) {
    const subscription = this.subscribers.get(walletAddress);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Update tier if provided
    if (updates.tier && this.subscriptionTiers[updates.tier]) {
      subscription.tier = updates.tier;
    }

    // Update preferences if provided
    if (updates.preferences) {
      subscription.preferences = { ...subscription.preferences, ...updates.preferences };
    }

    subscription.updatedAt = Date.now();
    
    return subscription;
  }

  getSubscription(walletAddress) {
    return this.subscribers.get(walletAddress) || null;
  }

  getNewsletters(tier = 'free', limit = 10) {
    const tierHierarchy = {
      'free': ['free'],
      'premium': ['free', 'premium'],
      'elite': ['free', 'premium', 'elite']
    };

    const allowedTiers = tierHierarchy[tier] || ['free'];
    
    return this.newsletters
      .filter(newsletter => allowedTiers.includes(newsletter.tier))
      .slice(0, limit);
  }

  getNewsletterById(id, userTier = 'free') {
    const newsletter = this.newsletters.find(n => n.id === id);
    if (!newsletter) {
      return null;
    }

    const tierHierarchy = {
      'free': ['free'],
      'premium': ['free', 'premium'],
      'elite': ['free', 'premium', 'elite']
    };

    const allowedTiers = tierHierarchy[userTier] || ['free'];
    
    if (!allowedTiers.includes(newsletter.tier)) {
      return {
        ...newsletter,
        content: 'This content is available for premium subscribers only. Upgrade your subscription to access exclusive content.',
        locked: true
      };
    }

    return newsletter;
  }

  async sendWelcomeEmail(subscription) {
    // Simulate sending welcome email
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const welcomeContent = {
      subject: `Welcome to Nebula Arena ${this.subscriptionTiers[subscription.tier].name}!`,
      content: `
        Welcome to the Nebula Arena community!
        
        You've successfully subscribed to our ${this.subscriptionTiers[subscription.tier].name} newsletter.
        
        Here's what you can expect:
        ${this.subscriptionTiers[subscription.tier].features.map(feature => `• ${feature}`).join('\n        ')}
        
        Your first newsletter will arrive soon. Get ready to dominate the arena!
        
        Best regards,
        The Nebula Arena Team
      `,
      tier: subscription.tier
    };

    // In a real implementation, this would integrate with an email service
    console.log('Welcome email sent:', welcomeContent);
    
    subscription.stats.emailsReceived += 1;
    
    return welcomeContent;
  }

  async sendNewsletter(newsletterId, targetTier = 'free') {
    const newsletter = this.newsletters.find(n => n.id === newsletterId);
    if (!newsletter) {
      throw new Error('Newsletter not found');
    }

    const subscribers = Array.from(this.subscribers.values())
      .filter(sub => sub.active && this.canAccessTier(sub.tier, targetTier));

    // Simulate sending to all subscribers
    const results = {
      sent: subscribers.length,
      failed: 0,
      newsletter: newsletter.title
    };

    // Update subscriber stats
    subscribers.forEach(sub => {
      sub.stats.emailsReceived += 1;
    });

    return results;
  }

  canAccessTier(userTier, contentTier) {
    const tierLevels = { 'free': 0, 'premium': 1, 'elite': 2 };
    return tierLevels[userTier] >= tierLevels[contentTier];
  }

  getSubscriptionStats() {
    const subscribers = Array.from(this.subscribers.values());
    const activeSubscribers = subscribers.filter(sub => sub.active);
    
    const tierCounts = {
      free: activeSubscribers.filter(sub => sub.tier === 'free').length,
      premium: activeSubscribers.filter(sub => sub.tier === 'premium').length,
      elite: activeSubscribers.filter(sub => sub.tier === 'elite').length
    };

    const totalRevenue = activeSubscribers.reduce((sum, sub) => {
      return sum + this.subscriptionTiers[sub.tier].price;
    }, 0);

    return {
      totalSubscribers: activeSubscribers.length,
      tierCounts,
      totalRevenue,
      averageOpenRate: this.calculateAverageOpenRate(activeSubscribers),
      recentGrowth: this.calculateRecentGrowth(subscribers)
    };
  }

  calculateAverageOpenRate(subscribers) {
    if (subscribers.length === 0) return 0;
    
    const totalOpenRate = subscribers.reduce((sum, sub) => {
      const openRate = sub.stats.emailsReceived > 0 
        ? (sub.stats.emailsOpened / sub.stats.emailsReceived) * 100 
        : 0;
      return sum + openRate;
    }, 0);

    return Math.round(totalOpenRate / subscribers.length);
  }

  calculateRecentGrowth(subscribers) {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentSubscribers = subscribers.filter(sub => sub.subscribedAt > oneWeekAgo);
    return recentSubscribers.length;
  }

  generateSubscriptionId() {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Search newsletters
  searchNewsletters(query, tier = 'free', limit = 10) {
    const newsletters = this.getNewsletters(tier, 100); // Get more for searching
    const searchTerm = query.toLowerCase();
    
    const results = newsletters.filter(newsletter => 
      newsletter.title.toLowerCase().includes(searchTerm) ||
      newsletter.content.toLowerCase().includes(searchTerm) ||
      newsletter.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    return results.slice(0, limit);
  }

  // Get newsletters by tag
  getNewslettersByTag(tag, tier = 'free', limit = 10) {
    const newsletters = this.getNewsletters(tier, 100);
    
    const results = newsletters.filter(newsletter => 
      newsletter.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );

    return results.slice(0, limit);
  }

  // Mark newsletter as read
  markAsRead(walletAddress, newsletterId) {
    const subscription = this.subscribers.get(walletAddress);
    if (subscription) {
      subscription.stats.emailsOpened += 1;
      subscription.stats.lastOpened = Date.now();
    }
  }
}

export const newsletterService = new NewsletterService();
export default newsletterService;
