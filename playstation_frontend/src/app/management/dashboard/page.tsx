"use client";
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Package, Layers, Calendar, ChevronRight, PlusCircle, TrendingUp } from 'lucide-react';

export default function ManagementDashboard() {
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState('30');
  const [selectedCat, setSelectedCat] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_staff) {
      router.push('/');
      return;
    }
    fetchStats();
  }, [user, period, selectedCat]);

  const fetchStats = async () => {
    try {
      const res = await api.get('orders/stats/', {
        params: { period, category: selectedCat }
      });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  if (!user?.is_staff) return <div className="mt-20 text-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-500 font-medium">Verifying Credentials...</p></div>;

  const maxSold = data?.products?.reduce((max: number, p: any) => Math.max(max, p.total_sold), 0) || 1;

  return (
    <div className="mt-6 sm:mt-10 max-w-7xl mx-auto px-4 pb-20">
      {/* Header & Filter Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-8">
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <TrendingUp size={14} /> Control Center
           </div>
           <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">ANALYTICS</h1>
           <p className="text-slate-500 text-sm font-medium flex items-center gap-2 bg-slate-900/50 w-max px-3 py-1 rounded-lg border border-slate-800">
             <Calendar size={14} /> Reporting period: last {period} days
           </p>
        </div>
        
        <div className="w-full xl:w-auto overflow-x-auto no-scrollbar pb-2 xl:pb-0">
           <div className="flex bg-slate-950 p-1.5 rounded-[1.5rem] border border-slate-900 w-max min-w-full sm:min-w-0">
             {[
               { label: 'WEEK', value: '7' },
               { label: 'MONTH', value: '30' },
               { label: '6 MONTHS', value: '180' },
               { label: 'ANNUAL', value: '365' }
             ].map((p) => (
               <button
                 key={p.value}
                 onClick={() => setPeriod(p.value)}
                 className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${
                   period === p.value 
                     ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                     : 'text-slate-500 hover:text-white hover:bg-slate-900'
                 }`}
               >
                 {p.label}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
        {/* Sidebar Controls - Left on desktop, Top on mobile */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="premium-card rounded-[2.5rem] p-8">
            <h3 className="text-xs font-black text-slate-500 mb-6 uppercase tracking-[0.3em] flex items-center gap-2">
              <Layers size={14} /> Segment Filter
            </h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
              <button
                onClick={() => setSelectedCat('')}
                className={`whitespace-nowrap lg:whitespace-normal text-left px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                  selectedCat === '' 
                    ? 'bg-blue-600/10 border-2 border-blue-500 text-blue-400' 
                    : 'bg-slate-900/50 text-slate-500 hover:text-slate-300 border-2 border-transparent'
                }`}
              >
                Global Inventory
              </button>
              {data?.categories?.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`whitespace-nowrap lg:whitespace-normal flex justify-between items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                    selectedCat == cat.id 
                      ? 'bg-blue-600/10 border-2 border-blue-500 text-blue-400' 
                      : 'bg-slate-900/50 text-slate-500 hover:text-slate-300 border-2 border-transparent'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70 px-2 py-0.5 bg-slate-800 rounded-md">
                    {cat.total_sales || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="premium-card rounded-[2.5rem] p-8 bg-gradient-to-tr from-blue-600/5 to-purple-600/5 border-blue-600/10">
            <h3 className="text-xs font-black text-slate-500 mb-6 uppercase tracking-[0.3em]">Management Hub</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <Link href="/management/products" className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-800 transition-all text-sm font-bold text-slate-300 group">
                <span className="flex items-center gap-3"><Package size={18} className="text-blue-500" /> Stock Audit</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/management/products/new" className="flex items-center justify-between p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all text-sm font-black text-white shadow-xl shadow-blue-600/20 group">
                <span>NEW ASSET</span>
                <PlusCircle size={18} className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="/management/categories/new" className="sm:col-span-2 lg:col-span-1 flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all text-sm font-bold text-slate-400">
                <span className="flex items-center gap-3"><Layers size={18} className="text-purple-500" /> New Segment</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Analytics Main View - Right on desktop, Bottom on mobile */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          <div className="premium-card rounded-[3rem] p-6 am:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 pointer-events-none">
               <BarChart3 size={120} className="text-blue-400" />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                LEADERBOARD
              </h3>
              <div className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-900">
                 Asset Performance Matrix
              </div>
            </div>

            <div className="space-y-10">
              {data?.products?.map((item: any) => (
                <div key={item.product__id} className="group relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white group-hover:text-blue-500 transition-colors leading-tight capitalize">
                        {item.product__name}
                      </h4>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-900 rounded-md border border-slate-800">
                           {item.product__category__name}
                         </span>
                         <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                         <span className="text-[9px] font-bold text-slate-600">ID: #{item.product__id}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-3xl font-black text-white tabular-nums">{item.total_sold}</span>
                      <span className="text-[9px] text-slate-600 block uppercase tracking-[0.2em] font-black mt-1">Acquisitions</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                      style={{ width: `${(item.total_sold / maxSold) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {(!data || data.products.length === 0) && (
                <div className="text-center py-24 bg-slate-950/30 rounded-[3rem] border border-slate-900/50">
                  <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6 border border-slate-800">
                    <BarChart3 size={32} className="text-slate-700" />
                  </div>
                  <p className="text-slate-600 font-black tracking-widest text-xs uppercase">No Data Transmission Detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
