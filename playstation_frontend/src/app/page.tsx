"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    api.get('products/categories/').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const url = activeCategory ? `products/products/?category=${activeCategory}` : 'products/products/';
    api.get(url).then(res => setProducts(res.data)).catch(console.error);
  }, [activeCategory]);

  return (
    <div className="flex flex-col lg:flex-row gap-10 mt-6 sm:mt-10 mb-20 px-4 sm:px-0">
      {/* Sidebar / Category Filter */}
      <aside className="w-full lg:w-72 shrink-0">
        <h2 className="text-[10px] font-black mb-6 text-slate-500 hidden lg:block tracking-[0.3em] uppercase">Tactical Segments</h2>
        
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 no-scrollbar">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`whitespace-nowrap lg:whitespace-normal text-left px-6 py-4 rounded-2xl transition-all duration-300 text-xs font-black uppercase tracking-widest border-2 ${!activeCategory ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30 scale-[1.02]' : 'bg-slate-900/50 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-200'}`}
          >
            All Collections
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap lg:whitespace-normal text-left px-6 py-4 rounded-2xl transition-all duration-300 text-xs font-black uppercase tracking-widest border-2 ${activeCategory === cat.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30 scale-[1.02]' : 'bg-slate-900/50 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </aside>
      
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
           <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
                 <div className="w-8 h-px bg-blue-600"></div> Latest Drops
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic">
                DISCOVER <span className="text-blue-600">ELITE</span>
              </h1>
           </div>
           <div className="px-4 py-2 bg-slate-950 border border-slate-900 rounded-xl text-[9px] font-black text-slate-600 tracking-[0.3em] uppercase">
              Global Inventory System
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
          {products.map(product => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <motion.div 
                whileHover={{ y: -10 }}
                className="premium-card rounded-[2.5rem] p-6 am:p-8 flex flex-col h-full hover:border-blue-600/40 transition-all duration-500 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] bg-gradient-to-br from-slate-900 to-black overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 pointer-events-none text-blue-500 group-hover:opacity-10 transition-opacity">
                   <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/><path d="m14.14 4.93-9.21 9.21"/><path d="m19.07 9.93-9.14 9.14"/></svg>
                </div>

                <div className="relative w-full h-64 sm:h-72 mb-8 rounded-[2rem] overflow-hidden bg-black flex items-center justify-center p-8 border-2 border-slate-900/50 group-hover:border-blue-600/20 transition-all">
                   <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   {product.images?.length > 0 ? (
                     <img 
                       src={product.images[0].image} 
                       alt={product.name} 
                       className="object-contain w-full h-full z-10 drop-shadow-[0_20px_40px_rgba(37,99,235,0.3)] group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700" 
                     />
                   ) : (
                     <div className="text-slate-800 font-black italic tracking-[0.3em] text-[10px] uppercase opacity-50">Null Pointer</div>
                   )}
                </div>
                
                <div className="flex-1 space-y-3 relative z-10">
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg uppercase tracking-widest">{product.category?.name || 'Asset'}</span>
                      <span className={`text-[9px] font-black tracking-widest uppercase ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-600'}`}>
                         {product.stock > 0 ? `Stock: ${product.stock}` : 'Depleted'}
                      </span>
                   </div>
                   <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors truncate uppercase italic tracking-tighter">{product.name}</h3>
                   <p className="text-slate-500 text-xs font-bold truncate tracking-widest uppercase">{product.model}</p>
                </div>

                <div className="flex justify-between items-end mt-10 relative z-10">
                   <div>
                      <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mb-1">Value Agent</p>
                      <span className="text-3xl font-black text-white flex items-start gap-1">
                        <span className="text-blue-600 text-sm mt-1">$</span>
                        {product.price}
                      </span>
                   </div>
                   <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 shadow-xl group-hover:shadow-blue-600/30">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:translate-x-1 transition-transform">
                         <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                   </div>
                </div>
              </motion.div>
            </Link>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-slate-950/20 rounded-[4rem] border-2 border-dashed border-slate-900 group">
               <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 text-slate-700 group-hover:scale-110 transition-transform duration-500">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
               </div>
               <p className="text-slate-600 font-black tracking-[0.4em] uppercase text-xs mb-6">No Assets Detected in this Segment</p>
               <button onClick={() => setActiveCategory(null)} className="text-blue-500 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2">
                 <div className="w-8 h-px bg-blue-600"></div> Re-initialize Discovery
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
