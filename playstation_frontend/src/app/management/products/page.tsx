"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { useAuth } from "@/store/useAuth";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Plus, Search, Edit3, Trash2, ChevronRight, BarChart2 } from "lucide-react";

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_staff) {
      router.push("/");
      return;
    }
    fetchProducts();
  }, [user, router]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("products/products/");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to decommission this asset?")) return;
    try {
      await api.delete(`products/products/${id}/`);
      addNotification({ type: "success", message: "Asset decommissioned successfully." });
      fetchProducts();
    } catch (err) {
      addNotification({ type: "error", message: "Failed to decommission asset." });
    }
  };

  if (!user?.is_staff) return null;

  return (
    <div className="mt-6 sm:mt-10 max-w-7xl mx-auto px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <BarChart2 size={14} /> Inventory Protocol
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Asset Audit</h1>
        </div>
        
        <Link 
          href="/management/products/new" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl transition-all font-black text-sm tracking-widest shadow-xl shadow-blue-600/30 flex items-center gap-3 uppercase active:scale-95"
        >
          <Plus size={20} /> Register New Asset
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((p) => (
          <div key={p.id} className="premium-card rounded-[2rem] p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-blue-600/30 transition-all">
            <div className="w-20 h-20 bg-slate-950 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 border border-slate-900 group-hover:scale-105 transition-transform">
               {p.images?.length > 0 ? (
                 <img src={p.images[0].image} className="w-full h-full object-contain" />
               ) : (
                 <Package className="text-slate-800" size={32} />
               )}
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-1">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.category?.name || 'Uncategorized'}</div>
               <h3 className="font-extrabold text-xl text-white">{p.name}</h3>
               <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-500">
                  <span>Model: {p.model}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                  <span className={p.stock > 0 ? "text-emerald-500" : "text-rose-500"}>Stock: {p.stock}</span>
               </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-900 pt-4 sm:pt-0 mt-4 sm:mt-0">
               <div className="text-2xl font-black text-white tabular-nums px-6 border-r border-slate-900 hidden sm:block">
                  <span className="text-blue-500 text-sm mr-1">$</span>{p.price}
               </div>
               
               <div className="flex items-center gap-2">
                 <Link 
                   href={`/management/products/${p.id}/edit`}
                   className="p-3 bg-slate-900 hover:bg-blue-600 text-slate-500 hover:text-white rounded-xl transition-all"
                 >
                   <Edit3 size={18} />
                 </Link>
                 <button 
                   onClick={() => deleteProduct(p.id)}
                   className="p-3 bg-slate-900 hover:bg-rose-600 text-slate-500 hover:text-white rounded-xl transition-all"
                 >
                   <Trash2 size={18} />
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
