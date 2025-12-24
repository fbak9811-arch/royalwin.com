
import React, { useState } from 'react';
import { Transaction } from '../types';
import { GameStatus } from '../App';

interface AdminPanelProps {
  transactions: Transaction[];
  config: { welcomeBonusEnabled: boolean, bonusAmount: number };
  setConfig: (c: any) => void;
  gamesStatus: Record<string, GameStatus>;
  setGamesStatus: (s: Record<string, GameStatus>) => void;
  onBack: () => void;
  onFinalize: (txId: string, status: 'completed' | 'rejected') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ transactions, config, setConfig, gamesStatus, setGamesStatus, onBack, onFinalize }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'approvals' | 'games'>('stats');

  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');

  const stats = [
    { label: 'Total Revenue', value: '₹42,500', color: 'text-green-500' },
    { label: 'Active Users', value: '1,284', color: 'text-blue-500' },
    { label: 'Pending Deposits', value: pendingDeposits.length.toString(), color: 'text-yellow-500' },
    { label: 'Daily Profit', value: '₹8,920', color: 'text-purple-500' },
  ];

  const toggleGameActive = (id: string) => {
    const updated = { ...gamesStatus };
    updated[id].isActive = !updated[id].isActive;
    setGamesStatus(updated);
  };

  const toggleGameMaintenance = (id: string) => {
    const updated = { ...gamesStatus };
    updated[id].isMaintenance = !updated[id].isMaintenance;
    setGamesStatus(updated);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black italic tracking-tight uppercase">Admin Console</h2>
        <button onClick={onBack} className="text-xs bg-slate-800 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-slate-400">Exit</button>
      </div>

      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-slate-800 text-yellow-500 shadow-lg' : 'text-slate-600'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('games')}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'games' ? 'bg-slate-800 text-yellow-500 shadow-lg' : 'text-slate-600'}`}
        >
          Games
        </button>
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'approvals' ? 'bg-slate-800 text-yellow-500 shadow-lg' : 'text-slate-600'}`}
        >
          Approvals
          {pendingDeposits.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center animate-bounce">{pendingDeposits.length}</span>}
        </button>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-2 gap-3">
            {stats.map(s => (
              <div key={s.label} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">{s.label}</p>
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-2xl">
            <h3 className="text-xs font-black uppercase text-yellow-500 tracking-[0.2em] mb-4">Platform Config</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-200 uppercase">Sign-up Bonus</p>
                <p className="text-[9px] text-slate-500 font-bold">New users get ₹{config.bonusAmount}</p>
              </div>
              <button 
                onClick={() => setConfig({...config, welcomeBonusEnabled: !config.welcomeBonusEnabled})}
                className={`w-12 h-6 rounded-full transition-all relative ${config.welcomeBonusEnabled ? 'bg-yellow-500' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.welcomeBonusEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'games' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-4">
             <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Admin Checklist</h4>
             <p className="text-[9px] text-slate-400 font-bold">✓ Minimum Bet ₹1 | ✓ Wallet Auth | ✓ Maintenance Toggle</p>
          </div>
          
          <div className="space-y-3">
            {/* Fix: Explicitly cast to GameStatus[] to resolve property access on 'unknown' from Object.values */}
            {(Object.values(gamesStatus) as GameStatus[]).map(game => (
              <div key={game.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black uppercase tracking-tight text-white italic">{game.id} Road</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${game.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {game.isActive ? 'Active' : 'Offline'}
                    </span>
                    {game.isMaintenance && <span className="text-[8px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded font-black uppercase">Maint.</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => toggleGameActive(game.id)}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${game.isActive ? 'bg-slate-800 text-slate-400' : 'bg-green-500 text-slate-950'}`}
                   >
                     {game.isActive ? 'Disable Game' : 'Enable Game'}
                   </button>
                   <button 
                    onClick={() => toggleGameMaintenance(game.id)}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${game.isMaintenance ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                   >
                     {game.isMaintenance ? 'Finish Maint.' : 'Start Maint.'}
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-2">Pending Manual Verification</h3>
          {pendingDeposits.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-4">
              <span className="text-4xl block">✅</span>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">All Clear! No pending requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDeposits.map(tx => (
                <div key={tx.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-black text-white uppercase tracking-tighter">Amount: ₹{tx.amount}</span>
                      <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">UTR: <span className="text-yellow-500 select-all tabular-nums tracking-widest">{tx.utr}</span></p>
                    </div>
                    <span className="text-[8px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full font-black uppercase tracking-widest">Review</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onFinalize(tx.id, 'rejected')}
                      className="flex-1 py-2.5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => onFinalize(tx.id, 'completed')}
                      className="flex-[2] py-2.5 bg-green-500 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Verify & Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
