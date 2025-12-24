
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { GameStatus } from '../../App';

interface ColourPredictionProps {
  user: User;
  status?: GameStatus;
  onResult: (amt: number) => void;
  onBack: () => void;
}

const ColourPrediction: React.FC<ColourPredictionProps> = ({ user, status, onResult, onBack }) => {
  const [timer, setTimer] = useState(30);
  const [selectedColor, setSelectedColor] = useState<'red' | 'green' | 'violet' | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [betInput, setBetInput] = useState<string>('10');
  const [history, setHistory] = useState<Array<{color: string, number: number}>>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const totalBalance = user.balance + user.bonusBalance;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          processResult();
          return 30;
        }
        if (prev <= 5) setIsLocked(true);
        else setIsLocked(false);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedColor, betAmount]);

  const handleBetChange = (val: string) => {
    setBetInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setBetAmount(num);
    }
  };

  const processResult = () => {
    if (!selectedColor) {
      setTimer(30);
      setIsLocked(false);
      return;
    }

    const colors = ['red', 'green', 'violet'];
    const resultColor = colors[Math.floor(Math.random() * colors.length)];
    const resultNum = Math.floor(Math.random() * 10);
    
    setHistory(prev => [{color: resultColor, number: resultNum}, ...prev.slice(0, 9)]);

    if (selectedColor === resultColor) {
      const winMult = resultColor === 'violet' ? 4.5 : 2;
      onResult(betAmount * (winMult - 1));
    } else {
      onResult(-betAmount);
    }

    setSelectedColor(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
        <button onClick={onBack} className="text-slate-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black italic tracking-tighter uppercase">COLOUR WIN</h3>
          <button 
            onClick={() => setShowRules(true)}
            className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 hover:text-yellow-500 hover:border-yellow-500 transition-colors"
          >
            i
          </button>
        </div>
        <div className="text-right">
           <p className="text-[8px] font-black text-slate-500 uppercase leading-none">Wallet</p>
           <span className="text-xs font-black text-yellow-500">₹{totalBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">Winning Strategy</h2>
            <button onClick={() => setShowRules(false)} className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400">✕</button>
          </div>
          
          <div className="space-y-6 pb-12">
            <section className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">How it Works</h4>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs text-slate-300 font-bold leading-relaxed">Predict which color will appear at the end of the 30-second countdown. Results are generated via high-integrity random selection.</p>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Payout Ratios</h4>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-300">RED</span>
                  </div>
                  <span className="text-sm font-black text-white">2x Return</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-300">GREEN</span>
                  </div>
                  <span className="text-sm font-black text-white">2x Return</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-300">VIOLET</span>
                  </div>
                  <span className="text-sm font-black text-yellow-500">4.5x Return</span>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Game Cycle</h4>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex gap-3">
                  <span className="text-yellow-500 font-black">0-25s:</span>
                  <p className="text-xs text-slate-400 font-bold">Open Season. Place and modify your bets freely.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-500 font-black">25-30s:</span>
                  <p className="text-xs text-slate-400 font-bold">Lockdown. No new bets can be placed during this period.</p>
                </div>
              </div>
            </section>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <p className="text-[9px] text-slate-500 font-black uppercase text-center tracking-widest leading-tight">
                All bets are final once the Lockdown period begins.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowRules(false)}
            className="mt-auto w-full py-5 bg-yellow-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-xl"
          >
            Start Predicting
          </button>
        </div>
      )}

      <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
        <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 left-0 h-1 bg-yellow-500 transition-all duration-1000`} style={{ width: `${(timer/30)*100}%` }}></div>
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Next Round Starts In</span>
          <div className="text-5xl font-black italic text-white flex items-center gap-1">
             <span className="text-yellow-500 drop-shadow-glow">00</span>
             <span className="opacity-20">:</span>
             <span className={`${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{timer.toString().padStart(2, '0')}</span>
          </div>
          <p className="mt-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest">Period: 20250101-{timer}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(['green', 'violet', 'red'] as const).map(color => (
            <button 
              key={color}
              disabled={isLocked || totalBalance < betAmount || betAmount < 1}
              onClick={() => setSelectedColor(color)}
              className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedColor === color 
                  ? `bg-${color === 'violet' ? 'purple' : color}-500 text-white scale-105 ring-4 ring-${color === 'violet' ? 'purple' : color}-500/20` 
                  : `bg-slate-900 border border-${color === 'violet' ? 'purple' : color}-500/30 text-${color === 'violet' ? 'purple' : color}-500 active:scale-95`
              } disabled:opacity-20 disabled:grayscale`}
            >
              {color}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-inner">
          <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
             <span className="w-1 h-1 bg-slate-700 rounded-full"></span> Recent Statistics
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {history.map((h, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg ${
                h.color === 'green' ? 'bg-green-500' : h.color === 'red' ? 'bg-red-500' : 'bg-purple-500'
              }`}>
                {h.number}
              </div>
            ))}
            {history.length === 0 && <span className="text-[10px] text-slate-700 font-bold uppercase py-2 italic">Awaiting first result...</span>}
          </div>
        </div>
      </div>

      <div className="mt-auto bg-slate-900 p-6 space-y-4 border-t border-slate-800 rounded-t-[2.5rem] shadow-2xl">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stake (₹1 Min)</label>
               {betAmount > totalBalance && <span className="text-[9px] font-black text-red-500 uppercase italic">Balance Low</span>}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-black text-xl italic">₹</span>
              <input 
                type="number"
                disabled={isLocked}
                value={betInput}
                onChange={(e) => handleBetChange(e.target.value)}
                placeholder="10"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-10 pr-4 text-white font-black text-lg focus:outline-none focus:border-yellow-500 transition-all placeholder:text-slate-900 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
             {[10, 50, 100, 500].map(v => (
               <button 
                key={v} 
                disabled={isLocked}
                onClick={() => { setBetAmount(v); setBetInput(v.toString()); }} 
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border transition-all ${betAmount === v ? 'bg-yellow-500 text-slate-900 border-yellow-500' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
               >
                 ₹{v}
               </button>
             ))}
          </div>
        </div>
        
        {isLocked && (
          <div className="flex items-center justify-center gap-2 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
             <p className="text-[9px] text-red-500 font-black uppercase tracking-widest">Bets Closed for this Period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColourPrediction;
