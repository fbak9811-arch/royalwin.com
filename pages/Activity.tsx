
import React from 'react';
import { Transaction } from '../types';

interface ActivityProps {
  transactions: Transaction[];
}

const Activity: React.FC<ActivityProps> = ({ transactions }) => {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-black italic tracking-tight">TRANSACTION LEDGER</h3>
      
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-600">
          <div className="text-4xl mb-2">📜</div>
          <p className="text-xs font-bold">No activity yet. Start playing!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  tx.type === 'win' ? 'bg-green-500/20 text-green-500' : 
                  tx.type === 'loss' ? 'bg-red-500/20 text-red-500' : 
                  tx.type === 'deposit' ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tx.type === 'win' ? '💰' : tx.type === 'loss' ? '💀' : tx.type === 'deposit' ? '📥' : '📤'}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight">{tx.gameName || tx.type}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-black ${
                  tx.type === 'win' || tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {tx.type === 'win' || tx.type === 'deposit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                </span>
                <p className={`text-[8px] font-black uppercase ${
                  tx.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
