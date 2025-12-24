
import React, { useState } from 'react';
import { User, Transaction } from '../types';

interface WalletProps {
  user: User;
  updateWallet: (amt: number, type: any, game?: string, referenceId?: string, status?: Transaction['status']) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, updateWallet }) => {
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [depositStep, setDepositStep] = useState<1 | 2 | 3 | 4>(1); // 1: Amount, 2: QR, 3: UTR, 4: Success
  const [amount, setAmount] = useState<string>('');
  const [utr, setUtr] = useState<string>('');
  const [upiIdInput, setUpiIdInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const MERCHANT_UPI_ID = "7865859695-2@ybl";
  const MERCHANT_NAME = "WinRush Games Pvt Ltd";

  const handleNextStep = () => {
    if (depositStep === 1) {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt < 100) {
        alert("Minimum deposit amount: ₹100");
        return;
      }
      setDepositStep(2);
    } else if (depositStep === 2) {
      setDepositStep(3);
    }
  };

  const submitDepositRequest = () => {
    const amt = parseFloat(amount);
    if (utr.length < 10) {
      alert("Please enter a valid 12-digit UTR/Transaction ID");
      return;
    }

    setIsProcessing(true);
    // Simulate API call to register pending deposit
    setTimeout(() => {
      setIsProcessing(false);
      updateWallet(amt, 'deposit', undefined, utr, 'pending');
      setDepositStep(4);
    }, 1500);
  };

  const handleWithdrawal = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 130) {
      alert("Minimum withdrawal amount: ₹130");
      return;
    }
    if (amt > user.balance) {
      alert("Insufficient wallet balance");
      return;
    }
    if (!upiIdInput.includes('@')) {
      alert("Enter a valid UPI ID for receiving funds");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      updateWallet(-amt, 'withdrawal', undefined, "WD_" + Date.now(), 'pending');
      setIsProcessing(false);
      alert("Withdrawal request submitted successfully!");
      setAmount('');
      setUpiIdInput('');
    }, 2500);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(MERCHANT_UPI_ID).then(() => {
      alert("UPI ID copied to clipboard!");
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Wallet Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 border border-slate-700/30 shadow-2xl relative overflow-hidden">
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 block">Main Balance</span>
          <h2 className="text-2xl font-black text-white italic">₹{user.balance.toFixed(2)}</h2>
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
        </div>
        <div className="bg-slate-900/50 rounded-3xl p-5 border border-slate-800 shadow-xl">
          <span className="text-[9px] text-yellow-500/80 font-black uppercase tracking-widest mb-1 block">Bonus Wallet</span>
          <h2 className="text-2xl font-black text-slate-300 italic">₹{user.bonusBalance.toFixed(2)}</h2>
        </div>
      </div>

      {/* Primary Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-inner">
        <button 
          onClick={() => { setTab('deposit'); setDepositStep(1); }}
          className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'deposit' ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}
        >
          Deposit
        </button>
        <button 
          onClick={() => { setTab('withdraw'); setAmount(''); }}
          className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'withdraw' ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}
        >
          Withdraw
        </button>
      </div>

      {tab === 'deposit' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between px-4 pb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center gap-1.5 relative flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all z-10 ${
                  depositStep === s ? 'bg-yellow-500 border-yellow-500 text-slate-950 shadow-lg scale-110' : 
                  depositStep > s ? 'bg-green-500 border-green-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {depositStep > s ? '✓' : s}
                </div>
                <span className={`text-[7px] font-black uppercase tracking-widest text-center ${depositStep === s ? 'text-yellow-500' : 'text-slate-600'}`}>
                  {s === 1 ? 'Amount' : s === 2 ? 'Pay' : s === 3 ? 'UTR' : 'Status'}
                </span>
                {s < 4 && <div className={`absolute top-3.5 left-1/2 w-full h-[1px] -z-0 ${depositStep > s ? 'bg-green-500' : 'bg-slate-800'}`}></div>}
              </div>
            ))}
          </div>

          {depositStep === 1 && (
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 animate-slideIn">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">Select Deposit Amount</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-yellow-500 font-black text-4xl italic">₹</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-7 pl-16 pr-6 text-white font-black text-4xl focus:outline-none focus:border-yellow-500 transition-all placeholder:text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className={`py-3 rounded-xl border text-[11px] font-black transition-all ${amount === val.toString() ? 'bg-yellow-500 border-yellow-500 text-slate-950' : 'border-slate-800 text-slate-500'}`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleNextStep}
                className="w-full py-5 bg-yellow-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Proceed to Pay
              </button>
            </div>
          )}

          {depositStep === 2 && (
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 flex flex-col items-center animate-slideIn">
              <div className="w-full flex justify-between items-center mb-6">
                <button onClick={() => setDepositStep(1)} className="text-slate-500 p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
                <span className="text-[10px] font-black uppercase text-yellow-500 tracking-widest">Amount: ₹{amount}</span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">{MERCHANT_NAME}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Scan QR or Copy UPI ID to pay</p>
              </div>

              <div className="bg-white p-3 rounded-3xl mb-6 shadow-2xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${MERCHANT_UPI_ID}%26pn=${encodeURIComponent(MERCHANT_NAME)}%26am=${amount}%26cu=INR`} 
                  alt="Payment QR" 
                  className="w-52 h-52 object-contain" 
                />
              </div>

              <div 
                onClick={copyUpiId}
                className="w-full flex items-center justify-between py-4 px-6 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer active:scale-95 transition-all"
              >
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-600 uppercase">Merchant UPI ID</span>
                  <span className="text-xs font-black text-slate-300">{MERCHANT_UPI_ID}</span>
                </div>
                <div className="text-yellow-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></div>
              </div>

              <p className="mt-6 text-[9px] text-slate-600 font-bold uppercase text-center px-4 leading-tight">
                After payment is successful, please note down the 12-digit UTR/Transaction ID.
              </p>

              <button 
                onClick={handleNextStep}
                className="w-full mt-8 py-5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-green-900/10"
              >
                Next: Submit UTR
              </button>
            </div>
          )}

          {depositStep === 3 && (
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 animate-slideIn">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black uppercase tracking-widest text-white">Manual Verification</h3>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Enter the 12-digit UTR from your UPI app</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">12-Digit UTR Number</label>
                <input 
                  type="text" 
                  maxLength={12}
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter Transaction ID"
                  className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-6 px-8 text-white font-black text-xl text-center focus:outline-none focus:border-yellow-500 transition-all placeholder:text-slate-900 tracking-[0.2em]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setDepositStep(2)}
                  className="flex-1 py-5 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-700 transition-all"
                >
                  Back
                </button>
                <button 
                  disabled={isProcessing || utr.length < 10}
                  onClick={submitDepositRequest}
                  className="flex-[2] py-5 bg-yellow-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          )}

          {depositStep === 4 && (
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 flex flex-col items-center gap-8 shadow-2xl text-center animate-slideIn">
              <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center text-5xl animate-bounce ring-8 ring-blue-500/5">
                🛡️
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase tracking-[0.1em] text-white">Pending Approval</h3>
                <p className="text-[12px] font-bold text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Your deposit of <span className="text-yellow-500">₹{parseFloat(amount).toFixed(2)}</span> has been submitted for manual admin review.
                </p>
              </div>

              <div className="w-full bg-slate-950/50 rounded-3xl p-6 border border-slate-800/50 space-y-3 text-left">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-600">UTR ID</span>
                  <span className="text-slate-300 tabular-nums">{utr}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-600">Average ETA</span>
                  <span className="text-blue-400">10-30 Minutes</span>
                </div>
              </div>

              <button 
                onClick={() => setDepositStep(1)}
                className="text-[11px] font-black uppercase text-yellow-500 tracking-[0.25em] border-b border-yellow-500/30 pb-1.5 hover:text-yellow-400 transition-colors"
              >
                Create New Request
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Withdrawal Tab */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Withdraw Amount (Min ₹130)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500 font-black text-3xl italic">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 py-7 pl-16 pr-6 rounded-3xl focus:outline-none focus:border-red-500 font-black text-4xl text-white transition-all placeholder:text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination UPI ID</label>
              <input 
                type="text" 
                value={upiIdInput}
                onChange={(e) => setUpiIdInput(e.target.value)}
                placeholder="username@bank"
                className="w-full bg-slate-950 border border-slate-800 py-6 px-8 rounded-3xl focus:outline-none focus:border-blue-500 font-black text-lg text-white transition-all placeholder:text-slate-900 tracking-wide"
              />
            </div>

            <button 
              disabled={isProcessing}
              onClick={handleWithdrawal}
              className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl transition-all ${isProcessing ? 'bg-slate-800 text-slate-600' : 'bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white active:scale-95 shadow-red-500/10'}`}
            >
              {isProcessing ? 'Processing...' : 'Withdraw Cash'}
            </button>
          </div>
        </div>
      )}

      {/* Security Info Footer */}
      <div className="pt-8 border-t border-slate-900/50 flex flex-col items-center gap-8">
        <div className="flex items-center gap-12 opacity-15 grayscale">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-5" alt="UPI" />
        </div>
        <div className="text-center space-y-2 pb-6">
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.25em]">
            Atomic Ledger Settlement Protocol v4.0.1
          </p>
          <div className="flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">
               256-Bit SSL End-to-End Encrypted Secure Gateway
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
