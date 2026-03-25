"use client";
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { User, Package, Calendar, Clock, ChevronRight, Award, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api.get('users/profile/')
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          logout();
          router.push('/login');
        }
        setLoading(false);
      });
  }, [router, logout]);

  if (loading) return (
    <div className="mt-20 text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing User Profile...</p>
    </div>
  );

  if (!profile) return (
    <div className="mt-20 text-center py-20 bg-slate-900/50 rounded-[3rem] max-w-2xl mx-auto border border-slate-800">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldCheck size={32} className="text-slate-600" />
      </div>
      <h2 className="text-2xl font-black text-white mb-2 italic">Access Denied</h2>
      <p className="text-slate-500 mb-8">Please re-authenticate to access your elite profile.</p>
      <Link href="/login" className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-blue-600/30">Sign In</Link>
    </div>
  );

  return (
    <div className="mt-6 sm:mt-10 max-w-6xl mx-auto px-4 pb-20 space-y-12">
      {/* Header Section */}
      <div className="premium-card rounded-[3rem] p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-end gap-8 relative overflow-hidden bg-gradient-to-br from-slate-900 to-black">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none -rotate-12">
           <User size={150} />
        </div>

        <div className="relative group">
           <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-5xl font-black text-white shadow-[0_0_50px_rgba(37,99,235,0.3)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
             {profile?.username ? profile.username[0].toUpperCase() : '?'}
           </div>
           <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-xl border-4 border-slate-950 flex items-center justify-center shadow-lg">
              <Award size={14} className="text-white" />
           </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-4">
          <div className="space-y-1">
             <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
                <ShieldCheck size={14} /> Verified Member
             </div>
             <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">{profile.username}</h1>
             <p className="text-slate-400 font-bold">{profile.email}</p>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
             <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Calendar size={12} /> Joined: {new Date(profile.date_joined).toLocaleDateString()}
             </div>
             <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Package size={12} /> Orders: {profile.orders?.length || 0}
             </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-900 pb-8">
           <h2 className="text-3xl font-black text-white flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                 <Clock size={28} />
              </div>
              Acquisition History
           </h2>
        </div>

        {profile.orders && profile.orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.orders.map((order: any) => (
              <div key={order.id} className="premium-card p-8 rounded-[2rem] hover:border-blue-500/30 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Transaction ID</p>
                    <h3 className="text-xl font-black text-white">ORD-{order.id.toString().padStart(5, '0')}</h3>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    order.status === 'completed' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {order.status}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                   {order.items?.map((io: any) => (
                      <div key={io.id} className="flex items-center gap-3 text-sm font-bold text-slate-400">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                         <span className="flex-1 truncate">{io.product_name}</span>
                         <span className="text-slate-600">x{io.quantity}</span>
                      </div>
                   ))}
                </div>

                <div className="flex justify-between items-end border-t border-slate-900 pt-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Value Transferred</p>
                    <div className="text-2xl font-black text-white flex items-start gap-1">
                       <span className="text-sm mt-1 text-blue-500">$</span>
                       {order.total_price}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                     <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-slate-950/30 rounded-[3rem] border-2 border-dashed border-slate-900 flex flex-col items-center justify-center">
             <Package size={48} className="text-slate-800 mb-6" />
             <p className="text-slate-600 font-black tracking-[0.3em] uppercase text-xs mb-4">No Data in History</p>
             <Link href="/" className="text-blue-500 font-bold hover:underline">Start Your First Discovery</Link>
          </div>
        )}
      </div>
    </div>
  );
}
