"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useAuth } from "@/store/useAuth";
import { useNotificationStore } from "@/store/useNotificationStore";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewCategory() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_staff) router.push("/");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("products/categories/", form);
      addNotification({ type: "success", message: "Category segment created successfully!" });
      router.push("/management/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Error creating category.";
      addNotification({ type: "error", message: errorMsg });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_staff) return <div className="mt-20 text-center animate-pulse text-slate-400">Checking access...</div>;

  return (
    <div className="mt-8 max-w-2xl mx-auto px-4 pb-20">
      <Link href="/management/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div className="premium-card rounded-3xl p-8 sm:p-12">
        <div className="space-y-1 mb-8">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Infrastructure Management</p>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Define New Segment</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Segment Name</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. PlayStation 5 Games"
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-600 transition-all font-bold" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Strategic Description</label>
            <textarea 
              rows={4} 
              placeholder="Define the scope of this asset segment..."
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-600 transition-all font-medium"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-800 text-white font-black rounded-xl transition-all shadow-2xl shadow-blue-600/30 mt-6 flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
            {loading ? "INITIALIZING..." : "COMMIT SEGMENT"}
          </button>
        </form>
      </div>
    </div>
  );
}
