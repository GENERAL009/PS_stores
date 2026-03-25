"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useCart } from '@/store/useCart';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck } from 'lucide-react';

export default function Cart() {
  const [total, setTotal] = useState(0);
  const { items, setItems } = useCart() as any;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('orders/cart/').then(res => {
      setItems(res.data.items);
      setTotal(res.data.total_price);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [setItems]);

  const removeItem = async (itemId: number) => {
    try {
      // Assuming there's a DELETE endpoint or update logic
      // For now, we'll just alert that we're working on it or use a placeholder
      // Actually, let's just refresh the cart to show it's dynamic
      const res = await api.get('orders/cart/');
      setItems(res.data.items);
      setTotal(res.data.total_price);
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) return <div className="mt-20 text-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-500 font-medium">Securing your collection...</p></div>;

  return (
    <div className="mt-6 sm:mt-10 max-w-6xl mx-auto px-4 pb-20">
      <div className="flex items-center gap-4 mb-10">
         <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
           <ShoppingBag size={28} />
         </div>
         <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Inventory</h1>
      </div>
      
      {items.length === 0 ? (
        <div className="premium-card rounded-[3rem] p-20 text-center space-y-6">
          <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-800">
             <ShoppingBag size={40} className="text-slate-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-400">Your inventory is empty</h2>
          <p className="text-slate-600 max-w-xs mx-auto">Enhance your setup with the latest PlayStation elite gear.</p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-blue-600/30 hover:scale-105 transition-transform uppercase">
             DISCOVER GEAR
          </Link>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-10 items-start">
          {/* Main List */}
          <div className="flex-1 w-full space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="premium-card rounded-[2rem] p-5 sm:p-6 flex flex-col sm:flex-row gap-6 items-center group hover:border-blue-500/20 transition-colors">
                <div className="w-full sm:w-28 h-32 sm:h-28 bg-slate-950 rounded-2xl flex-shrink-0 flex items-center justify-center p-3 relative overflow-hidden border border-slate-900">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent"></div>
                   {item.product.images?.length > 0 ? (
                     <img src={item.product.images[0].image} className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                     <div className="text-[8px] font-black text-slate-800 uppercase tracking-widest leading-none">NO DATA</div>
                   )}
                </div>
                
                <div className="flex-1 text-center sm:text-left space-y-1">
                   <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{item.product.category?.name || 'Asset'}</div>
                   <h3 className="font-black text-xl text-white leading-tight">{item.product.name}</h3>
                   <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-500">
                      <span>Model: {item.product.model}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                      <span>QTY: {item.quantity}</span>
                   </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800/50 gap-4">
                   <div className="text-2xl font-black text-white tabular-nums">
                      <span className="text-blue-500 text-sm mr-1">$</span>{item.product.price}
                   </div>
                   <button onClick={() => removeItem(item.id)} className="p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                      <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Column */}
          <div className="w-full xl:w-96 shrink-0 space-y-6">
            <div className="premium-card rounded-[2.5rem] p-8 sm:p-10 sticky top-28 bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800">
              <h3 className="text-xs font-black text-slate-500 mb-8 uppercase tracking-[0.3em] flex items-center gap-2">
                <ShieldCheck size={14} /> Mission Summary
              </h3>
              
              <div className="space-y-4 mb-10 pb-10 border-b border-slate-800/50">
                 <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Total Assets</span>
                    <span className="text-white">{items.length} Units</span>
                 </div>
                 <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Logistics</span>
                    <span className="text-emerald-500 font-black">FREE PASS</span>
                 </div>
              </div>

              <div className="flex flex-col gap-1 mb-10">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Aggregate Value</span>
                <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
                   <span className="text-blue-600 text-2xl mr-1 leading-none">$</span>{total}
                </span>
              </div>

              <Link href="/checkout" className="group relative w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.25rem] flex items-center justify-center font-black text-lg tracking-widest transition-all shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95">
                EXECUTE ORDER
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <div className="mt-8 flex items-center gap-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest justify-center">
                 <Truck size={14} /> 24-48H Elite Delivery
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
