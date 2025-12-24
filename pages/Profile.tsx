
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center pt-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-4 border-yellow-500 p-1 bg-slate-900 shadow-2xl">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="absolute bottom-1 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-slate-950 shadow-lg"></div>
        </div>
        <h2 className="mt-5 text-2xl font-black uppercase italic tracking-tighter">{user.username}</h2>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">+91 {user.mobile}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-3xl flex flex-col items-center">
          <span className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">Balance</span>
          <span className="text-xl font-black text-green-500">₹{user.balance.toFixed(2)}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-3xl flex flex-col items-center">
          <span className="text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">Bonus</span>
          <span className="text-xl font-black text-yellow-500">₹{user.bonusBalance.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Rules Section */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-[2rem] p-6 space-y-4">
          <h3 className="text-[10px] font-black uppercase text-yellow-500 tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            🔐 Account & Wallet Rules
          </h3>
          <div className="space-y-3">
            {[
              { t: "One Account", d: "Strictly 1 account per mobile number." },
              { t: "Balance Continuity", d: "Your balance stays safe and carries forward forever." },
              { t: "Atomic Ledger", d: "Real-time updates for every win or loss." },
              { t: "No Negative Balance", d: "You can only play with what you have." }
            ].map((rule, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-yellow-500/40 font-black text-xs">{i+1}.</span>
                <div>
                  <p className="text-[10px] font-black text-slate-200 uppercase tracking-tighter">{rule.t}</p>
                  <p className="text-[9px] font-bold text-slate-500 leading-none mt-0.5">{rule.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full flex items-center justify-between p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl">📄</div>
              <span className="text-xs font-black uppercase tracking-widest">KYC Verification</span>
            </div>
            <span className="text-[9px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-black uppercase">Verified</span>
          </div>

          <div className="w-full flex items-center justify-between p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl">👥</div>
              <span className="text-xs font-black uppercase tracking-widest">Referral Code</span>
            </div>
            <span className="text-xs font-black text-yellow-500 italic uppercase">{user.referralCode}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-5 mt-6 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all active:scale-95"
      >
        Sign Out Securely
      </button>
      
      <p className="text-[8px] text-slate-700 font-black text-center uppercase tracking-widest">App Version 4.1.2-stable</p>
    </div>
  );
};

export default Profile;
