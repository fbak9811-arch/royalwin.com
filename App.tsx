
import React, { useState, useEffect, useCallback } from 'react';
import { GameView, User, Transaction } from './types';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Activity from './pages/Activity';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import ChickenRoad from './pages/games/ChickenRoad';
import ColourPrediction from './pages/games/ColourPrediction';
import AdminPanel from './pages/AdminPanel';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

export interface GameStatus {
  id: string;
  isActive: boolean;
  isMaintenance: boolean;
  minBet: number;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameView>(GameView.AUTH);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [config, setConfig] = useState({
    welcomeBonusEnabled: true,
    bonusAmount: 20
  });

  const [gamesStatus, setGamesStatus] = useState<Record<string, GameStatus>>({
    chicken: { id: 'chicken', isActive: true, isMaintenance: false, minBet: 1 },
    colour: { id: 'colour', isActive: true, isMaintenance: false, minBet: 1 },
    mines: { id: 'mines', isActive: false, isMaintenance: false, minBet: 10 },
    aviator: { id: 'aviator', isActive: true, isMaintenance: true, minBet: 10 },
    rummy: { id: 'rummy', isActive: false, isMaintenance: false, minBet: 100 },
    carrom: { id: 'carrom', isActive: false, isMaintenance: false, minBet: 10 },
    dice: { id: 'dice', isActive: false, isMaintenance: false, minBet: 5 },
    spin: { id: 'spin', isActive: false, isMaintenance: false, minBet: 5 },
  });

  const getGlobalUsers = (): Record<string, { user: User, transactions: Transaction[] }> => {
    const data = localStorage.getItem('winrush_global_registry');
    return data ? JSON.parse(data) : {};
  };

  const saveToGlobalRegistry = (mobile: string, userData: User, txs: Transaction[]) => {
    const registry = getGlobalUsers();
    registry[mobile] = { user: userData, transactions: txs };
    localStorage.setItem('winrush_global_registry', JSON.stringify(registry));
  };

  useEffect(() => {
    const activeSession = localStorage.getItem('winrush_active_session');
    if (activeSession) {
      const registry = getGlobalUsers();
      const sessionData = registry[activeSession];
      if (sessionData) {
        setUser(sessionData.user);
        setTransactions(sessionData.transactions);
        setCurrentView(GameView.HOME);
      }
    }
    // Load game config from local storage if exists
    const savedGames = localStorage.getItem('winrush_games_config');
    if (savedGames) setGamesStatus(JSON.parse(savedGames));
  }, []);

  useEffect(() => {
    if (user) {
      saveToGlobalRegistry(user.mobile, user, transactions);
    }
  }, [user, transactions]);

  useEffect(() => {
    localStorage.setItem('winrush_games_config', JSON.stringify(gamesStatus));
  }, [gamesStatus]);

  const handleLogin = (mobile: string, name: string) => {
    const registry = getGlobalUsers();
    const existing = registry[mobile];

    if (existing) {
      setUser(existing.user);
      setTransactions(existing.transactions);
      localStorage.setItem('winrush_active_session', mobile);
      setCurrentView(GameView.HOME);
    } else {
      const newUser: User = {
        id: 'u' + Math.random().toString(36).substr(2, 5),
        mobile,
        username: name,
        balance: 0,
        bonusBalance: 0,
        kycStatus: 'unverified',
        referralCode: 'WIN' + Math.random().toString(36).substr(2, 5).toUpperCase()
      };

      let initialTxs: Transaction[] = [];
      if (config.welcomeBonusEnabled) {
        newUser.bonusBalance = config.bonusAmount;
        initialTxs.push({
          id: 'tx_welcome_' + Date.now(),
          userId: newUser.id,
          amount: config.bonusAmount,
          type: 'bonus_credit',
          status: 'completed',
          timestamp: Date.now(),
          referenceId: 'WELCOME_BONUS',
          walletType: 'bonus'
        });
      }

      setUser(newUser);
      setTransactions(initialTxs);
      localStorage.setItem('winrush_active_session', mobile);
      saveToGlobalRegistry(mobile, newUser, initialTxs);
      setCurrentView(GameView.HOME);
    }
  };

  const updateWallet = useCallback((amount: number, type: Transaction['type'], game?: string, referenceId?: string, status: Transaction['status'] = 'completed') => {
    if (!user) return;
    
    // Core Bet Rule Validation
    if (type === 'bet') {
      if (Math.abs(amount) < 1) {
        console.error("Bet below minimum threshold of ₹1");
        return;
      }
    }

    // Rule 4: No Negative Balance Protection
    if (type === 'bet' || type === 'withdrawal' || (amount < 0 && type === 'loss')) {
      const totalAvailable = user.balance + user.bonusBalance;
      if (totalAvailable < Math.abs(amount)) {
        console.error("Insufficient balance for operation");
        return;
      }
    }

    const timestamp = Date.now();
    const id = 'tx_' + Math.random().toString(36).substr(2, 9);
    
    const newTx: Transaction = {
      id,
      userId: user.id,
      amount: Math.abs(amount),
      type,
      status,
      gameName: game,
      timestamp,
      referenceId: referenceId,
      utr: referenceId
    };

    setTransactions(prev => [newTx, ...prev]);

    setUser(prev => {
      if (!prev) return null;
      let newBalance = prev.balance;
      let newBonus = prev.bonusBalance;

      const shouldApplyBalance = (type === 'deposit' && status === 'completed') || 
                                (type !== 'deposit');

      if (shouldApplyBalance) {
        if (type === 'bet') {
          if (newBonus >= Math.abs(amount)) {
            newBonus += amount;
          } else {
            const remaining = Math.abs(amount) - newBonus;
            newBonus = 0;
            newBalance -= remaining;
          }
        } else if (type === 'win' || (type === 'deposit' && status === 'completed')) {
          newBalance += amount;
        } else if (type === 'withdrawal' || type === 'loss') {
          newBalance += amount; 
        } else if (type === 'bonus_credit') {
          newBonus += amount;
        }
      }

      return {
        ...prev,
        balance: parseFloat(Math.max(0, newBalance).toFixed(2)),
        bonusBalance: parseFloat(Math.max(0, newBonus).toFixed(2))
      };
    });
  }, [user]);

  const finalizeTransaction = (txId: string, newStatus: 'completed' | 'rejected') => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        if (tx.type === 'deposit' && tx.status === 'pending' && newStatus === 'completed' && user && tx.userId === user.id) {
          setUser(u => u ? { ...u, balance: u.balance + tx.amount } : null);
        }
        return { ...tx, status: newStatus };
      }
      return tx;
    }));
  };

  const handleLogout = () => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('winrush_active_session');
    setCurrentView(GameView.AUTH);
  };

  const renderView = () => {
    if (!user && currentView !== GameView.AUTH) return null;
    
    switch (currentView) {
      case GameView.AUTH:
        return <Auth onLogin={handleLogin} />;
      case GameView.HOME:
        return <Home onSelectGame={(v) => setCurrentView(v)} user={user!} gamesStatus={gamesStatus} />;
      case GameView.WALLET:
        return <Wallet user={user!} updateWallet={updateWallet} />;
      case GameView.ACTIVITY:
        return <Activity transactions={transactions} />;
      case GameView.LEADERBOARD:
        return <Leaderboard user={user!} />;
      case GameView.PROFILE:
        return <Profile user={user!} onLogout={handleLogout} />;
      case GameView.CHICKEN_ROAD:
        return <ChickenRoad user={user!} status={gamesStatus.chicken} onResult={(amt) => updateWallet(amt, amt > 0 ? 'win' : 'bet', 'Chicken Road')} onBack={() => setCurrentView(GameView.HOME)} />;
      case GameView.COLOUR_PREDICTION:
        return <ColourPrediction user={user!} status={gamesStatus.colour} onResult={(amt) => updateWallet(amt, amt > 0 ? 'win' : 'bet', 'Colour Prediction')} onBack={() => setCurrentView(GameView.HOME)} />;
      case GameView.ADMIN:
        return <AdminPanel transactions={transactions} config={config} setConfig={setConfig} gamesStatus={gamesStatus} setGamesStatus={setGamesStatus} onBack={() => setCurrentView(GameView.HOME)} onFinalize={finalizeTransaction} />;
      default:
        return <Home onSelectGame={(v) => setCurrentView(v)} user={user!} gamesStatus={gamesStatus} />;
    }
  };

  const isGameView = currentView.startsWith('game_');
  const isAuthView = currentView === GameView.AUTH;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {!isGameView && !isAuthView && user && <Navbar user={user} onAdmin={() => setCurrentView(GameView.ADMIN)} />}
      
      <main className={`flex-1 overflow-y-auto custom-scrollbar ${!isGameView && !isAuthView ? 'pb-20 pt-16' : ''}`}>
        {renderView()}
      </main>

      {!isGameView && !isAuthView && <BottomNav activeView={currentView} setView={setCurrentView} />}
      
      {!isAuthView && (
        <div className="fixed bottom-24 right-4 z-40">
          <p className="text-[10px] text-slate-500 bg-black/50 px-2 py-1 rounded-full border border-slate-800">18+ Play Responsibly</p>
        </div>
      )}
    </div>
  );
};

export default App;
