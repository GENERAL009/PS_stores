"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useAuth } from "@/store/useAuth";
import { useNotificationStore } from "@/store/useNotificationStore";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProduct() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    model: "", 
    price: "", 
    category: "", 
    description: "", 
    stock: "10" 
  });
  const [images, setImages] = useState<FileList | null>(null);
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_staff) {
      router.push("/");
      return;
    }
    api.get("products/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error(err);
        addNotification({ type: "error", message: "Failed to load categories." });
      });
  }, [user, router, addNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("model", form.model);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      formData.append("category_id", form.category);
      
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("uploaded_images", images[i]);
        }
      }

      await api.post("products/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      addNotification({ type: "success", message: "Product created successfully!" });
      router.push("/management/products");
    } catch (err: any) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Error creating product. Please check the fields.";
      addNotification({ type: "error", message: "Error: " + errorMsg });
      console.error("Full Error:", err.response?.data);
    }
  };

  if (!user?.is_staff) return <div className="mt-20 text-center animate-pulse">Checking access...</div>;

  return (
    <div className="mt-8 max-w-2xl mx-auto px-4">
      <Link href="/management/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div className="premium-card rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold text-white mb-6 uppercase tracking-tighter italic">Register New Asset</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Asset Name</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-medium" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Model / SKU</label>
            <input required type="text" value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-medium" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Price ($)</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-bold" />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Stock Quantity</label>
              <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-bold" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Category Segment</label>
            <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-bold">
              <option value="">Select Category</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Detailed Intel</label>
            <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-medium"></textarea>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Visual Assets</label>
            <input multiple type="file" accept="image/*" onChange={e => setImages(e.target.files)} className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xs" />
          </div>
          <button type="submit" className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-xl shadow-blue-600/30 mt-6 uppercase tracking-[0.2em] active:scale-95">
            Initialize Asset
          </button>
        </form>
      </div>
    </div>
  );
}
