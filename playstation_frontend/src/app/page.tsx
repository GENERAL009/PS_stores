"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/axios';

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
    <div className="flex flex-col lg:flex-row gap-10 mt-6 sm:mt-10">
      {/* Sidebar / Category Filter */}
      <aside className="w-full lg:w-72 shrink-0">
        <h2 className="text-xl font-black mb-6 text-white hidden lg:block tracking-widest uppercase text-xs opacity-50">Filter by Arena</h2>
        
        {/* Mobile: Horizontal Scroll, Desktop: Vertical Stack */}
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`whitespace-nowrap lg:whitespace-normal text-left px-5 py-3 rounded-2xl transition-all duration-300 text-sm font-bold border-2 ${!activeCategory ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-[1.02]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
          >
            All Collections
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap lg:whitespace-normal text-left px-5 py-3 rounded-2xl transition-all duration-300 text-sm font-bold border-2 ${activeCategory === cat.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-[1.02]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </aside>
      
      <main className="flex-1">
        <div className="flex items-center justify-between mb-10">
           <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">
             DISCOVER <span className="text-blue-600">ELITE</span>
           </h1>
           <div className="hidden sm:block text-[10px] font-black text-slate-600 tracking-[0.4em] uppercase">Latest Arrivals</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map(product => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <div className="premium-card rounded-[2rem] p-6 flex flex-col h-full hover:border-blue-500/50 transition-all duration-500 hover:translate-y-[-8px]">
                <div className="relative w-full h-56 mb-6 rounded-3xl overflow-hidden bg-slate-900 flex items-center justify-center p-6 border border-slate-800/50">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   {product.images?.length > 0 ? (
                     <img src={product.images[0].image} alt={product.name} className="object-contain w-full h-full z-10 drop-shadow-xl group-hover:scale-110 transition-transform duration-700" />
                   ) : (
                     <div className="text-slate-700 font-black italic tracking-widest text-xs uppercase opacity-30">No Visualization</div>
                   )}
                </div>
                
                <div className="flex-1 space-y-2">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{product.category?.name || 'Item'}</span>
                      <span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {product.stock > 0 ? 'IN STOCK' : 'OUT'}
                      </span>
                   </div>
                   <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors truncate">{product.name}</h3>
                   <p className="text-slate-500 text-sm font-medium truncate">{product.model}</p>
                </div>

                <div className="flex justify-between items-end mt-8">
                   <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Price</p>
                      <span className="text-2xl font-black text-white">${product.price}</span>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                         <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                   </div>
                </div>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800">
               <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-600">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
               </div>
               <p className="text-slate-500 font-bold text-lg">No Items in this Arena</p>
               <button onClick={() => setActiveCategory(null)} className="mt-4 text-blue-500 font-black uppercase text-xs tracking-widest hover:underline">Reset Filters</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
