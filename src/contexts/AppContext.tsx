import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Token {
  id: string;
  name: string;
  description: string;
  emoji: string;
  coins: number;
  status: 'pending' | 'done';
  type: 'work' | 'physical';
  createdAt: string;
  completedAt?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  tokens: Token[];
  shoppingItems: ShoppingItem[];
  walletBalance: number;
  transactions: Transaction[];
  streak: number;
  addToken: (token: Omit<Token, 'id' | 'status' | 'createdAt'>) => void;
  completeToken: (id: string) => void;
  deleteToken: (id: string) => void;
  editToken: (id: string, updates: Partial<Omit<Token, 'id' | 'status' | 'createdAt' | 'completedAt'>>) => void;
  addShoppingItem: (item: Omit<ShoppingItem, 'id'>) => void;
  deleteShoppingItem: (id: string) => void;
  purchaseItem: (itemId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('isAuthenticated');
    return saved === 'true';
  });
  
  const [tokens, setTokens] = useState<Token[]>(() => {
    const saved = localStorage.getItem('tokens');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tokens from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shoppingItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse shoppingItems from localStorage', e);
        return [
          { id: '1', name: 'Coffee Break', emoji: '☕', price: 5 },
          { id: '2', name: 'Movie Night', emoji: '🎬', price: 15 },
          { id: '3', name: 'Gaming Session', emoji: '🎮', price: 10 },
        ];
      }
    }
    return [
      { id: '1', name: 'Coffee Break', emoji: '☕', price: 5 },
      { id: '2', name: 'Movie Night', emoji: '🎬', price: 15 },
      { id: '3', name: 'Gaming Session', emoji: '🎮', price: 10 },
    ];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse transactions from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('walletBalance');
    if (saved) {
      const parsed = parseInt(saved);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    if (saved) {
      const parsed = parseInt(saved);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  });

  const [lastCompletionDate, setLastCompletionDate] = useState(() => {
    const saved = localStorage.getItem('lastCompletionDate');
    return saved || null;
  });

  useEffect(() => {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('shoppingItems', JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('walletBalance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    if (lastCompletionDate) {
      localStorage.setItem('lastCompletionDate', lastCompletionDate);
    } else {
      localStorage.removeItem('lastCompletionDate');
    }
  }, [lastCompletionDate]);

  const login = (username: string, password: string) => {
    if (username === 'priyam' && password === 'priyam@2653') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const addToken = (tokenData: Omit<Token, 'id' | 'status' | 'createdAt'>) => {
    const newToken: Token = {
      ...tokenData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTokens(prev => [...prev, newToken]);
  };

  const completeToken = (id: string) => {
    const token = tokens.find(t => t.id === id);
    if (!token) return;

    const now = new Date();
    const today = now.toDateString();
    
    // Update streak
    if (lastCompletionDate) {
      const lastDate = new Date(lastCompletionDate);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate.toDateString() === today) {
        // Same day, don't update streak
      } else if (lastDate.toDateString() === yesterday.toDateString()) {
        // Consecutive day
        setStreak(prev => prev + 1);
        setLastCompletionDate(now.toISOString());
      } else {
        // Streak broken
        setStreak(1);
        setLastCompletionDate(now.toISOString());
      }
    } else {
      // First completion
      setStreak(1);
      setLastCompletionDate(now.toISOString());
    }

    setTokens(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: 'done' as const, completedAt: new Date().toISOString() }
        : t
    ));

    setWalletBalance(prev => prev + token.coins);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'earn',
      amount: token.coins,
      description: `Completed: ${token.name}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteToken = (id: string) => {
    setTokens(prev => prev.filter(t => t.id !== id));
  };

  const editToken = (id: string, updates: Partial<Omit<Token, 'id' | 'status' | 'createdAt' | 'completedAt'>>) => {
    setTokens(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const addShoppingItem = (itemData: Omit<ShoppingItem, 'id'>) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: Date.now().toString(),
    };
    setShoppingItems(prev => [...prev, newItem]);
  };

  const deleteShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.filter(i => i.id !== id));
  };

  const purchaseItem = (itemId: string) => {
    const item = shoppingItems.find(i => i.id === itemId);
    if (!item || walletBalance < item.price) return false;

    setWalletBalance(prev => prev - item.price);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'spend',
      amount: item.price,
      description: `Purchased: ${item.name}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    return true;
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        tokens,
        shoppingItems,
        walletBalance,
        transactions,
        streak,
        addToken,
        completeToken,
        deleteToken,
        editToken,
        addShoppingItem,
        deleteShoppingItem,
        purchaseItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
