
import React from 'react';
import { User, GameView } from '../types';

interface NavbarProps {
  user: User;
  onAdmin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onAdmin }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 flex items-center justify-between px-4 z-50 max-w-md mx-auto">
      <div className="flex items-center gap-2" onClick={onAdmin}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center font-bold text-slate-900">
          R
        </div>
        <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent italic">
          ROYAL WIN
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Main Wallet</span>
          <span className="text-sm font-bold text-yellow-500">₹{user.balance.toLocaleString('en-IN')}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
           <img src={`https://picsum.photos/seed/${user.id}/100/100`} alt="Avatar" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
