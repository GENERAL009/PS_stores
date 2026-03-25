'use client';

import React, { useState } from 'react';
import { useCart } from '@/store/useCart';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lock, CreditCard, Smartphone, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, setItems } = useCart() as any;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Payment States
  const [step, setStep] = useState<'card' | 'otp'>('card');
  const [transactionId, setTransactionId] = useState('');
  
  // Card States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  
  // OTP State
  const [otpCode, setOtpCode] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-24 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
           <Wallet size={32} className="text-slate-600" />
        </div>
        <h1 className="text-3xl font-black text-white mb-4 italic tracking-tighter uppercase">Your vault is empty</h1>
        <p className="text-slate-500 mb-8 max-w-xs">Secure some elite gear before proceeding to checkout.</p>
        <button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl transition-all font-black text-sm tracking-widest shadow-xl shadow-blue-600/30 active:scale-95 uppercase">
          Return to Armory
        </button>
      </div>
    );
  }

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('orders/uzum/initialize/', {
        card_number: cardNumber.replace(/\s/g, ''),
        expiry
      });
      
      setTransactionId(data.transaction_id);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'To\'lovni boshlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('orders/verify/', {
        otp_code: otpCode,
        transaction_id: transactionId
      });
      
      setItems([]);
      alert("SUCCESS: Order Executed Successfully! 🎯");
      router.push('/profile');
    } catch (err: any) {
      setError(err.response?.data?.error || 'SMS kod noto\'g\'ri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-10 sm:pt-20 px-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-900 pb-10">
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
                 <ShieldCheck size={14} /> Encrypted Session
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">CHECKOUT</h1>
           </div>
           <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-black text-slate-400 tracking-widest uppercase mb-1">
              Mission: Finalize Order
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Side: Summary - Priority 2 on Mobile */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <div className="premium-card rounded-[2.5rem] p-8 sm:p-10 bg-gradient-to-br from-slate-900 to-black border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <Wallet size={80} />
              </div>
              
              <h2 className="text-xs font-black uppercase text-slate-500 mb-8 tracking-[0.3em] flex items-center gap-2">
                <CheckCircle size={14} /> Payload Summary
              </h2>
              
              <div className="space-y-6 mb-10">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                       <span className="text-white font-bold text-sm block leading-tight">{item.product.name}</span>
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-slate-200 font-black tabular-nums">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-800/80 pt-8 space-y-4">
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                    <span>Base Value</span>
                    <span>${total().toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest text-emerald-500">
                    <span>Logistics</span>
                    <span>$0.00</span>
                 </div>
                 <div className="flex justify-between items-center pt-4 border-t border-slate-900">
                    <span className="text-sm font-black text-white uppercase tracking-widest">Aggregate Total</span>
                    <span className="text-3xl font-black text-blue-500 tabular-nums tracking-tighter">${total().toFixed(2)}</span>
                 </div>
              </div>
            </div>

            <div className="px-8 py-6 rounded-[2rem] bg-slate-950 border border-slate-900 flex items-center gap-4 group">
               <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700">
                  <Lock size={20} />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Security Status</p>
                  <p className="text-xs font-bold text-slate-300">End-to-End Encryption Active</p>
               </div>
            </div>
          </div>

          {/* Right Side: Payment Form - Priority 1 on Mobile */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="premium-card rounded-[3rem] p-8 sm:p-12 relative overflow-hidden bg-slate-950 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 pointer-events-none">
                 <CreditCard size={150} className="text-blue-500" />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 border-b border-slate-900 pb-10">
                <div className="space-y-2">
                   <h2 className="text-3xl font-black text-white italic tracking-tighter">UZUM GATEWAY</h2>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Verified Merchant Terminal</span>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-10 w-24 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-600 tracking-widest italic">UZUM BANK</div>
                   <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                </div>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold rounded-2xl animate-shake flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center">!</div>
                  {error}
                </div>
              )}

              {step === 'card' ? (
                <form onSubmit={handleInitialize} className="space-y-8 max-w-xl">
                  <div className="space-y-4">
                    <label className="block text-[10px] uppercase text-slate-600 font-black mb-1 ml-1 tracking-[0.2em]">Asset Identifier (Card Number)</label>
                    <div className="relative group">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input
                        type="text"
                        placeholder="8600 0000 0000 0000"
                        className="w-full h-16 bg-black/40 border-2 border-slate-900 rounded-[1.25rem] pl-12 pr-6 text-white text-xl font-black placeholder-slate-800 outline-none focus:border-blue-600 transition-all tracking-widest tabular-nums"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] uppercase text-slate-600 font-black mb-1 ml-1 tracking-[0.2em]">Terminus (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full h-16 bg-black/40 border-2 border-slate-900 rounded-[1.25rem] px-6 text-white text-xl font-black placeholder-slate-800 outline-none focus:border-blue-600 transition-all tracking-widest tabular-nums"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col justify-end pb-2">
                       <p className="text-[9px] font-black text-slate-700 leading-tight uppercase tracking-widest">
                          MFA Protocol: SMS verification will be triggered upon initiation.
                       </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full h-18 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-800 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] flex items-center justify-center gap-3 mt-4 text-lg tracking-[0.2em]"
                  >
                    {loading ? 'INITIALIZING...' : 'START TRANSACTION'}
                    {!loading && <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-10 animate-fade-in max-w-xl mx-auto py-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center mx-auto border border-blue-500/20 shadow-inner">
                      <Smartphone className="text-blue-500" size={36} />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-white italic tracking-tighter">MFA VERIFICATION</h3>
                       <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">6-Digit Cipher Transmitted To Device</p>
                    </div>
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      className="w-full bg-black/40 border-2 border-slate-900 rounded-[2rem] py-8 text-center text-4xl font-black tracking-[0.5em] text-blue-500 outline-none focus:border-blue-600 transition-all placeholder-slate-900 tabular-nums shadow-inner shadow-black"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      autoFocus
                      required
                    />
                    <div className="absolute inset-x-0 -bottom-2 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30 blur-sm"></div>
                  </div>

                  <div className="space-y-4">
                     <button
                       type="submit"
                       disabled={loading || otpCode.length < 6}
                       className="w-full h-18 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-900 disabled:text-slate-800 text-white font-black rounded-[1.5rem] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-emerald-600/30 text-lg tracking-[0.2em]"
                     >
                       {loading ? 'VERIFYING...' : 'FINALIZE PROTOCOL'}
                     </button>
                     
                     <button 
                       type="button"
                       onClick={() => setStep('card')}
                       className="w-full text-[10px] font-black text-slate-700 hover:text-white transition-colors uppercase tracking-[0.3em]"
                       disabled={loading}
                     >
                       RE-ENTER IDENTIFIER
                     </button>
                  </div>
                </form>
              )}

              <footer className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-slate-700" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">End-to-End Encrypted Terminal</span>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="w-8 h-4 bg-slate-900 rounded-sm opacity-30"></div>
                    <div className="w-8 h-4 bg-slate-900 rounded-sm opacity-30"></div>
                    <div className="w-8 h-4 bg-slate-900 rounded-sm opacity-30"></div>
                 </div>
              </footer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
