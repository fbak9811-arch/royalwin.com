
import React, { useState, useEffect } from 'react';
import { GameView, User } from '../types';
import { GameStatus } from '../App';

interface HomeProps {
  onSelectGame: (view: GameView) => void;
  user: User;
  gamesStatus: Record<string, GameStatus>;
}

const Home: React.FC<HomeProps> = ({ onSelectGame, user, gamesStatus }) => {
  const [showBonusToast, setShowBonusToast] = useState(false);
  const [showLinkToast, setShowLinkToast] = useState(false);
  const [payoutTicker, setPayoutTicker] = useState(1245000);

  useEffect(() => {
    if (user.bonusBalance === 20) {
      setShowBonusToast(true);
      const timer = setTimeout(() => setShowBonusToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [user.bonusBalance]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPayoutTicker(prev => prev + Math.floor(Math.random() * 500));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/join?ref=${user.referralCode}`;
    const shareData = {
      title: 'Join ROYAL WIN',
      text: `Hey! Use my code ${user.referralCode} to get a ₹20 welcome bonus on ROYAL WIN!`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShowLinkToast(true);
        setTimeout(() => setShowLinkToast(false), 3000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const games = [
    { id: 'chicken', name: 'Chicken Road', icon: '🐔', path: GameView.CHICKEN_ROAD, color: 'group-hover:text-amber-400', category: 'High Stakes' },
    { id: 'colour', name: 'Colour Win', icon: '🎨', path: GameView.COLOUR_PREDICTION, color: 'group-hover:text-purple-400', category: 'Prediction' },
    { id: 'mines', name: 'Mines Boom', icon: '💣', path: GameView.HOME, color: 'group-hover:text-red-400', category: 'Risk' },
    { id: 'aviator', name: 'Aviator', icon: '✈️', path: GameView.HOME, color: 'group-hover:text-blue-400', category: 'Crash' },
    { id: 'rummy', name: 'Rummy', icon: '🃏', path: GameView.HOME, color: 'group-hover:text-green-400', category: 'Skill' },
    { id: 'carrom', name: 'Carrom', icon: '🎯', path: GameView.HOME, color: 'group-hover:text-orange-400', category: 'Arcade' },
    { id: 'dice', name: 'Dice Roll', icon: '🎲', path: GameView.HOME, color: 'group-hover:text-pink-400', category: 'Chance' },
    { id: 'spin', name: 'Spin Wheel', icon: '🎡', path: GameView.HOME, color: 'group-hover:text-indigo-400', category: 'Jackpot' },
  ];

  const handleGameClick = (game: typeof games[0]) => {
    const status = gamesStatus[game.id];
    if (!status || !status.isActive) {
      alert("This game is temporarily unavailable. Please try again later.");
      return;
    }
    if (status.isMaintenance) {
      alert("Under Maintenance: We are upgrading the server for a better experience. Back soon!");
      return;
    }
    onSelectGame(game.path);
  };

  return (
    <div className="p-4 space-y-6 relative">
      {/* Toast Notifications */}
      {showBonusToast && (
        <div className="fixed top-20 left-4 right-4 z-[100] animate-bounce-in">
          <div className="bg-slate-900/90 backdrop-blur-md border border-yellow-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-yellow-500/10"></div>
            <div className="text-3xl relative z-10">👑</div>
            <div className="flex-1 relative z-10">
              <h4 className="text-yellow-500 font-black text-sm uppercase tracking-widest">Royal Welcome</h4>
              <p className="text-slate-300 text-xs font-bold">₹20 Bonus Credits Added</p>
            </div>
            <button onClick={() => setShowBonusToast(false)} className="text-slate-500 hover:text-white relative z-10">✕</button>
          </div>
        </div>
      )}

      {showLinkToast && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] animate-slide-up">
          <div className="bg-green-500 text-slate-950 p-3 rounded-xl shadow-2xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest">
            <span>✅</span> Link Copied to Clipboard
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative h-48 rounded-[2rem] overflow-hidden bg-gradient-to-br from-yellow-600 via-amber-400 to-yellow-700 shadow-2xl shadow-amber-500/20 group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-center z-20">
          <div className="bg-black/20 backdrop-blur-sm self-start px-3 py-1 rounded-full border border-black/10 mb-2">
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">Premium Access</span>
          </div>
          <h2 className="text-3xl font-black italic text-slate-900 leading-none tracking-tighter drop-shadow-sm">
            ROYAL<br/>JACKPOT
          </h2>
          <p className="text-slate-800 text-xs font-bold mt-2 uppercase tracking-wide max-w-[70%]">
            Daily Rewards up to ₹10 Lakhs. <br/>Play like a King.
          </p>
          <button 
            onClick={() => handleGameClick(games[0])}
            className="mt-4 bg-slate-900 text-yellow-500 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all w-fit border border-yellow-500/50 hover:bg-slate-800"
          >
            Enter Arena
          </button>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-25 select-none grayscale-0 brightness-110 drop-shadow-lg rotate-12 transition-transform group-hover:rotate-0 duration-500">👑</div>
        <div className="absolute right-4 top-4 w-16 h-16 bg-white/20 rounded-full blur-2xl"></div>
      </div>

      {/* Live Ticker Bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Payouts</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-black text-yellow-500 tabular-nums">₹{payoutTicker.toLocaleString()}</span>
          <span className="text-[9px] text-slate-600 font-bold">PAID TODAY</span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-tight text-white">
            <span className="text-lg">💠</span>
            Top Games
          </h3>
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest border border-slate-800 px-2 py-1 rounded-lg">
            2.4K Playing Now
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {games.map(game => {
            const status = gamesStatus[game.id];
            const isActive = status?.isActive && !status?.isMaintenance;
            
            return (
              <button
                key={game.id}
                onClick={() => handleGameClick(game)}
                className={`group relative aspect-[1.1/1] rounded-[1.5rem] p-4 flex flex-col justify-between overflow-hidden transition-all duration-300 active:scale-95
                  ${isActive 
                    ? 'bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/5' 
                    : 'bg-slate-900/50 border border-slate-800/50 opacity-80 cursor-not-allowed'
                  }
                `}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${isActive ? 'from-yellow-500/5' : 'from-slate-500/5'} to-transparent rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-100 transition-opacity`}></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-colors ${game.color} ${isActive ? 'group-hover:bg-slate-800' : ''}`}>
                    {game.icon}
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  )}
                </div>
                <div className="text-left relative z-10">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">{game.category}</span>
                  <span className={`text-sm font-black uppercase tracking-tight text-slate-200 group-hover:text-white transition-colors`}>
                    {game.name}
                  </span>
                </div>
                {status?.isMaintenance && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 border border-yellow-500/20 rounded-[1.5rem]">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">⚠️</div>
                    <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Maintenance</span>
                  </div>
                )}
                {!status?.isActive && !status?.isMaintenance && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex items-center justify-center border border-slate-800 rounded-[1.5rem]">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">Soon</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Promo */}
      <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-0.5">
        <div className="bg-slate-950 rounded-[14px] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">
            🤝
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Royal Affiliate</h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Invite elites. Earn 10% Lifetime Royalty.</p>
          </div>
          <button 
            onClick={handleShare}
            className="bg-slate-800 hover:bg-slate-700 text-yellow-500 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors border border-slate-700"
          >
            Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
