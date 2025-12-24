
import React, { useState, useEffect, useRef } from 'react';

interface AuthProps {
  onLogin: (mobile: string, name: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Simulated Secure States (In a real app, these would be on the server)
  const [serverOtp, setServerOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [showSms, setShowSms] = useState(false);

  // Resend timer logic
  useEffect(() => {
    let timer: number;
    if (resendTimer > 0) {
      timer = window.setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setServerOtp(newOtp);
    setOtpExpiry(Date.now() + 3 * 60 * 1000); // 3 minutes
    setResendTimer(30);
    setAttemptsLeft(3);
    setOtpInput('');
    
    // Simulate SMS arrival
    setShowSms(true);
    setTimeout(() => setShowSms(false), 8000);
    console.log(`[SECURE SMS]: Your login OTP is ${newOtp}. This OTP is valid for 3 minutes. Do not share it with anyone.`);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) return alert("Enter valid 10-digit mobile number");
    if (!name) return alert("Enter your name");
    
    setLoading(true);
    setTimeout(() => {
      generateOtp();
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length !== 6) return alert("Enter 6-digit OTP");

    if (attemptsLeft <= 0) {
      alert("Max attempts reached. Please request a new OTP.");
      return;
    }

    if (otpExpiry && Date.now() > otpExpiry) {
      alert("OTP has expired. Please request a new one.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (otpInput === serverOtp) {
        onLogin(mobile, name);
      } else {
        const newAttempts = attemptsLeft - 1;
        setAttemptsLeft(newAttempts);
        setLoading(false);
        if (newAttempts > 0) {
          alert(`Incorrect OTP! ${newAttempts} attempts remaining.`);
        } else {
          alert("Incorrect OTP. Attempts exhausted. Request a new OTP.");
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse"></div>

      {/* Simulated SMS Notification */}
      {showSms && (
        <div className="fixed top-6 left-6 right-6 z-[100] animate-bounce">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-start gap-4 ring-2 ring-yellow-500/20">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl shrink-0">💬</div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Messages • Just Now</p>
              <p className="text-xs font-bold text-slate-200 leading-relaxed">
                Your login OTP is <span className="text-yellow-500 font-black">{serverOtp}</span>. Valid for 3 mins. Do not share.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="z-10 w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 via-orange-500 to-orange-600 rounded-[2.5rem] flex items-center justify-center font-black text-slate-950 text-5xl italic shadow-2xl shadow-orange-500/30 mb-6 transition-transform hover:scale-105 duration-500">
            R
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
            ROYAL WIN PRO
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Skill-Based Gaming Platform</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-[3rem] p-8 shadow-2xl ring-1 ring-white/5">
          {step === 'mobile' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Player Identity</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Full Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4.5 px-6 text-white font-bold focus:outline-none focus:border-yellow-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Access</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-black">+91</span>
                    <input 
                      type="tel" 
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4.5 pl-16 pr-6 text-white font-black tracking-widest focus:outline-none focus:border-yellow-500/50 transition-all placeholder:text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 p-5 rounded-[2rem] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-2xl shadow-inner">🎁</div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-yellow-500 uppercase tracking-wider">Welcome Gift</p>
                  <p className="text-xs font-bold text-slate-300">₹20 BONUS WAITING!</p>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl text-slate-950 font-black uppercase tracking-[0.2em] shadow-xl shadow-yellow-500/10 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Request Secure OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center space-y-2 mb-4">
                <p className="text-xs text-slate-400 font-medium">Verify code sent to</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white font-black tracking-widest">+91 {mobile}</span>
                  <button type="button" onClick={() => setStep('mobile')} className="p-1 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center block">Enter 6-Digit Passcode</label>
                  <input 
                    type="tel" 
                    maxLength={6}
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-6 px-6 text-white text-center text-4xl font-black tracking-[0.5em] focus:outline-none focus:border-yellow-500/50 transition-all placeholder:text-slate-900"
                  />
                </div>
                
                <div className="flex justify-between items-center px-1">
                  <p className="text-[10px] font-black uppercase text-slate-500">
                    Attempts: <span className={`${attemptsLeft === 1 ? 'text-red-500 animate-pulse' : 'text-slate-300'}`}>{attemptsLeft}/3</span>
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase">
                    <span className="text-slate-600">Expires in</span>
                    <span className="text-orange-500 tabular-nums">
                      {otpExpiry ? Math.max(0, Math.floor((otpExpiry - Date.now()) / 1000)) : 0}s
                    </span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || attemptsLeft === 0}
                className="w-full py-5 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 rounded-2xl text-slate-950 font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? 'Authenticating...' : 'Secure Access'}
              </button>
              
              <div className="pt-2">
                {resendTimer > 0 ? (
                  <p className="text-[10px] text-slate-600 text-center font-black uppercase tracking-widest">
                    Resend code in <span className="text-slate-400 tabular-nums">{resendTimer}s</span>
                  </p>
                ) : (
                  <button 
                    type="button" 
                    onClick={generateOtp}
                    className="w-full text-[11px] text-yellow-500 hover:text-yellow-400 font-black uppercase tracking-widest text-center transition-colors"
                  >
                    Request New OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="space-y-4 px-4 text-center">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight leading-relaxed">
            Royal Win follows strict data safety standards. <br/>
            Secure TLS 1.3 Encryption Enabled.
          </p>
          <div className="flex items-center justify-center gap-6 opacity-20 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="MC" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2.5" alt="VISA" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-3" alt="UPI" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
