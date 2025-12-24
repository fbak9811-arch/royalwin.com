
import React, { useState } from 'react';
import { User } from '../../types';
import { GameStatus } from '../../App';

interface ChickenRoadProps {
  user: User;
  status?: GameStatus;
  onResult: (amt: number) => void;
  onBack: () => void;
}

const ChickenRoad: React.FC<ChickenRoadProps> = ({ user, status, onResult, onBack }) => {
  const [bet, setBet] = useState<number>(10);
  const [betInput, setBetInput] = useState<string>('10');
  const [gameStatus, setGameStatus] = useState<'betting' | 'playing' | 'won' | 'lost'>('betting');
  const [currentRow, setCurrentRow] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [selections, setSelections] = useState<number[]>([]); 
  const [bombs, setBombs] = useState<number[]>([]); 
  const [showRules, setShowRules] = useState(false);

  const ROWS = 5;
  const COLS = 2; 

  const totalBalance = user.balance + user.bonusBalance;

  const handleBetChange = (val: string) => {
    setBetInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setBet(num);
    }
  };

  const startNewGame = () => {
    if (!status?.isActive || status.isMaintenance) {
      alert("This game is currently undergoing maintenance. No bets have been deducted.");
      onBack();
      return;
    }
    if (bet < 1) {
      alert("Minimum bet is ₹1");
      return;
    }
    if (totalBalance < bet) {
      alert("Insufficient Balance");
      return;
    }
    const newBombs = Array.from({ length: ROWS }, () => Math.floor(Math.random() * COLS));
    setBombs(newBombs);
    setSelections([]);
    setCurrentRow(0);
    setMultiplier(1);
    setGameStatus('playing');
  };

  const handlePick = (colIndex: number) => {
    if (gameStatus !== 'playing') return;

    const isBomb = bombs[currentRow] === colIndex;
    
    if (isBomb) {
      setGameStatus('lost');
      onResult(-bet);
    } else {
      const nextMultiplier = multiplier * 1.95;
      setMultiplier(nextMultiplier);
      setSelections([...selections, colIndex]);
      
      if (currentRow === ROWS - 1) {
        handleCashout(nextMultiplier);
      } else {
        setCurrentRow(currentRow + 1);
      }
    }
  };

  const handleCashout = (finalMult?: number) => {
    const mult = finalMult || multiplier;
    const winAmt = (bet * mult) - bet; 
    setGameStatus('won');
    onResult(winAmt);
  };

  // Immediate Maintenance Block
  if (status?.isMaintenance && gameStatus === 'betting') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-950 p-10 text-center space-y-6">
        <div className="text-6xl animate-pulse">🛠️</div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-yellow-500 uppercase tracking-widest">Under Maintenance</h2>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">Admin has temporarily paused this game for optimization. Your balance is safe.</p>
        </div>
        <button onClick={onBack} className="bg-slate-900 border border-slate-800 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Back to Lobby</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
        <button onClick={onBack} className="text-slate-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black italic tracking-tight">CHICKEN ROAD</h3>
          <button 
            onClick={() => setShowRules(true)}
            className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 hover:text-yellow-500 hover:border-yellow-500 transition-colors"
          >
            i
          </button>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[9px] font-black text-slate-500 leading-none uppercase">Available</span>
           <span className="text-xs font-black text-yellow-500">₹{totalBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">How to Play</h2>
            <button onClick={() => setShowRules(false)} className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400">✕</button>
          </div>
          
          <div className="space-y-6 pb-12">
            <section className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Game Objective</h4>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-xs text-slate-300 font-bold leading-relaxed">Guide the chicken across the road by picking safe spots in each row. Avoid the hidden bombs to multiply your winnings!</p>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Gameplay Rules</h4>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex gap-3">
                  <span className="text-yellow-500 font-black">1.</span>
                  <p className="text-xs text-slate-400 font-bold">There are 5 rows. Each row has 1 safe spot and 1 bomb.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-yellow-500 font-black">2.</span>
                  <p className="text-xs text-slate-400 font-bold">Progressing to the next row escalates your current multiplier by 1.95x.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-yellow-500 font-black">3.</span>
                  <p className="text-xs text-slate-400 font-bold">Hitting a bomb results in an immediate loss of the current stake.</p>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Betting Policies</h4>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Min Bet</span>
                  <span className="text-xs font-black text-white">₹1.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Cashout Rule</span>
                  <span className="text-xs font-black text-white">Anytime after Row 1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Max Multiplier</span>
                  <span className="text-xs font-black text-green-500">~27.5x (All 5 Rows)</span>
                </div>
              </div>
            </section>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
              <p className="text-[9px] text-yellow-500 font-black uppercase text-center tracking-widest leading-tight">
                Safety Guarantee: Your balance is only deducted when the game successfully initializes.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowRules(false)}
            className="mt-auto w-full py-5 bg-yellow-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-xl"
          >
            Got It, Let's Win
          </button>
        </div>
      )}

      {/* Game Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-4">
        <div className="text-center mb-4">
          {gameStatus === 'playing' && <div className="text-4xl font-black text-yellow-500 italic animate-pulse">×{multiplier.toFixed(2)}</div>}
          {gameStatus === 'won' && <div className="text-4xl font-black text-green-500 animate-bounce">WIN! ×{multiplier.toFixed(2)}</div>}
          {gameStatus === 'lost' && <div className="text-4xl font-black text-red-500 italic">BOOM!</div>}
          {gameStatus === 'betting' && (
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Select Stake & Play</div>
              {bet < 1 && <p className="text-[8px] text-red-500 font-black uppercase">Min Bet ₹1 Required</p>}
            </div>
          )}
        </div>

        <div className="grid grid-rows-5 gap-2 w-full max-w-xs">
          {[...Array(ROWS)].map((_, rIdx) => {
            const rowNumber = ROWS - 1 - rIdx;
            const isCurrent = gameStatus === 'playing' && currentRow === rowNumber;
            const isPassed = currentRow > rowNumber;

            return (
              <div key={rIdx} className={`grid grid-cols-2 gap-2 h-16 rounded-2xl transition-all ${
                isCurrent ? 'bg-slate-900 border-2 border-yellow-500/50 scale-[1.03] shadow-lg shadow-yellow-500/10' : 'bg-slate-900/40 border border-slate-800'
              }`}>
                {[0, 1].map(cIdx => {
                  const isCorrect = isPassed && selections[rowNumber] === cIdx;
                  const isBomb = gameStatus !== 'playing' && bombs[rowNumber] === cIdx;

                  return (
                    <button
                      key={cIdx}
                      disabled={!isCurrent}
                      onClick={() => handlePick(cIdx)}
                      className={`flex items-center justify-center rounded-xl transition-all ${
                        isCurrent ? 'bg-slate-800 hover:bg-slate-700' : 
                        isCorrect ? 'bg-green-500/20' : 
                        isBomb ? 'bg-red-500/40' : 'bg-transparent opacity-20'
                      }`}
                    >
                      {isCorrect ? '🐔' : isBomb ? '💣' : isCurrent ? '❓' : ''}
                    </button>
                  );
                })}
              </div>
            );
          }).reverse()}
        </div>
      </div>

      {/* Betting Controls */}
      <div className="bg-slate-900 p-6 space-y-5 border-t border-slate-800 rounded-t-[2.5rem] shadow-2xl">
        {gameStatus === 'betting' || gameStatus === 'won' || gameStatus === 'lost' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Custom Bet Amount</label>
                {bet > totalBalance && <span className="text-[9px] font-black text-red-500 uppercase animate-pulse">Insufficient Funds</span>}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-black text-xl italic">₹</span>
                <input 
                  type="number"
                  value={betInput}
                  onChange={(e) => handleBetChange(e.target.value)}
                  placeholder="1.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-10 pr-4 text-white font-black text-lg focus:outline-none focus:border-yellow-500 transition-all placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
               {[10, 50, 100, 500].map(v => (
                 <button 
                  key={v} 
                  onClick={() => { setBet(v); setBetInput(v.toString()); }} 
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all border ${bet === v ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-lg' : 'border-slate-800 text-slate-500'}`}
                >
                  ₹{v}
                </button>
               ))}
            </div>

            <button 
              onClick={startNewGame}
              disabled={bet < 1 || bet > totalBalance}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all ${
                bet < 1 || bet > totalBalance ? 'bg-slate-800 text-slate-600 grayscale cursor-not-allowed' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-950 active:scale-95'
              }`}
            >
              Play (Stake ₹{bet || 0})
            </button>
          </div>
        ) : (
          <div className="space-y-3">
             <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Locked Stake</span>
                <span className="text-sm font-black text-white italic">₹{bet.toFixed(2)}</span>
             </div>
             <button 
              onClick={() => handleCashout()}
              className="w-full py-6 bg-green-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-green-500/20 active:scale-95 transition-all flex flex-col items-center group"
            >
              <span className="group-active:scale-90 transition-transform">Cash Out Profit</span>
              <span className="text-sm font-black drop-shadow-md">₹{(bet * multiplier).toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChickenRoad;
