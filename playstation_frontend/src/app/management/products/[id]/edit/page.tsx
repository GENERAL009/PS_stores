"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useAuth } from "@/store/useAuth";
import { useNotificationStore } from "@/store/useNotificationStore";
import { ArrowLeft, Save, Upload, Package } from "lucide-react";
import Link from "next/link";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !user.is_staff) {
      router.push("/");
      return;
    }
    
    Promise.all([
      api.get("products/categories/"),
      api.get(`products/products/${id}/`)
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data);
      const p = prodRes.data;
      setFormData({
        name: p.name,
        model: p.model,
        description: p.description,
        price: p.price,
        stock: p.stock,
        category: p.category?.id || "",
      });
      setLoading(false);
    }).catch(console.error);
  }, [id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`products/products/${id}/`, formData);
      addNotification({ type: "success", message: "Asset updated successfully!" });
      router.push("/management/products");
    } catch (err) {
      addNotification({ type: "error", message: "Failed to update asset." });
    }
  };

  if (loading) return <div className="mt-20 text-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="mt-6 sm:mt-10 max-w-4xl mx-auto px-4 pb-20">
      <Link href="/management/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-8">
        <ArrowLeft size={18} /> Back to Audit
      </Link>

      <div className="premium-card rounded-[2.5rem] p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-10">
           <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
              <Package size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Asset Management</p>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Modify Record</h1>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Asset Name</label>
              <input
                type="text"
                className="w-full bg-slate-950 border-2 border-slate-900 rounded-2xl px-5 py-4 text-white focus:border-blue-600 outline-none transition-all font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Model / Serial</label>
              <input
                type="text"
                className="w-full bg-slate-950 border-2 border-slate-900 rounded-2xl px-5 py-4 text-white focus:border-blue-600 outline-none transition-all font-bold"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Database Description</label>
            <textarea
              className="w-full bg-slate-950 border-2 border-slate-900 rounded-2xl px-5 py-4 text-white focus:border-blue-600 outline-none transition-all min-h-[150px] font-medium"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Value ($)</label>
              <input
                type="number"
                className="w-full bg-slate-950 border-2 border-slate-900 rounded-2xl px-5 py-4 text-white focus:border-blue-600 outline-none transition-all font-bold"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Stock Level</label>
              <input
                type="number"
                className="w-full bg-slate-950 border-2 border-slate-900 rounded-2xl px-5 py-4 text-white focus:border-blue-600 outline-none transition-all font-bold"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Arena Segment</label>
              <select
                className="w-full bg-slate-950 border-2 border-slate-900 rounded-2xl px-5 py-4 text-white focus:border-blue-600 outline-none transition-all font-bold appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg tracking-widest shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Save size={22} /> COMMIT CHANGES
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
