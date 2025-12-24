
import React, { useMemo } from 'react';
import { User, LeaderboardEntry } from '../types';

interface LeaderboardProps {
  user: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ user }) => {
  // Mocking high-roller data simulated as global state
  const mockLeaders: LeaderboardEntry[] = useMemo(() => {
    const saved = localStorage.getItem('winrush_mock_leaderboard');
    if (saved) return JSON.parse(saved);

    const names = ["Aryan K.", "Priya S.", "Rahul M.", "Ishita G.", "Sanjay V.", "Anita R.", "Vikram T.", "Sneha P.", "Rajesh L.", "Kavita J."];
    const initial = names.map((name, i) => ({
      userId: `mock_${i}`,
      username: name,
      totalWinnings: 50000 - (i * 4500) + (Math.random() * 1000),
      avatarSeed: name
    }));
    
    localStorage.setItem('winrush_mock_leaderboard', JSON.stringify(initial));
    return initial;
  }, []);

  // Merge current user into leaderboard simulation
  const sortedLeaders = useMemo(() => {
    // In a real app, we'd calculate user's total winnings from transactions
    // For this simulation, we'll assign the user a competitive score
    const userWinnings = (user.balance > 0 ? user.balance * 12 : 1250); 
    
    const all = [
      ...mockLeaders,
      { 
        userId: user.id, 
        username: "You", 
        totalWinnings: userWinnings, 
        avatarSeed: user.id 
      }
    ].sort((a, b) => b.totalWinnings - a.totalWinnings);

    return all;
  }, [mockLeaders, user]);

  const userRank = sortedLeaders.findIndex(l => l.userId === user.id) + 1;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center pt-4">
        <div className="text-4xl mb-2">🏆</div>
        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">CHAMPIONS LEAGUE</h2>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Top Earnings This Week</p>
      </div>

      <div className="space-y-3">
        {sortedLeaders.map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.userId === user.id;

          return (
            <div 
              key={entry.userId} 
              className={`relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border transition-all ${
                isCurrentUser 
                  ? 'bg-yellow-500/10 border-yellow-500/50 scale-[1.02] shadow-xl shadow-yellow-500/5' 
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {isCurrentUser && (
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-yellow-500 text-slate-950 text-[8px] font-black rounded-bl-lg">
                  YOU
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                    rank === 1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-slate-900 shadow-lg shadow-yellow-500/20' :
                    rank === 2 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900' :
                    rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-slate-900' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {rank <= 3 ? (rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉') : rank}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.avatarSeed}`} 
                    className="w-10 h-10 rounded-full bg-slate-800 p-0.5 border border-slate-700" 
                    alt="avatar" 
                  />
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-tight ${isCurrentUser ? 'text-yellow-500' : 'text-slate-200'}`}>
                      {entry.username}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Pro Player</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black italic text-white">
                  ₹{entry.totalWinnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">Winnings</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating My Rank Banner */}
      <div className="fixed bottom-20 left-4 right-4 z-40 animate-slideUp">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center font-black text-yellow-500 text-xs">
              #{userRank}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Current Position</span>
          </div>
          <button className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] animate-pulse">
            Keep Winning!
          </button>
        </div>
      </div>
      <div className="h-20"></div> {/* Spacer for bottom float */}
    </div>
  );
};

export default Leaderboard;
