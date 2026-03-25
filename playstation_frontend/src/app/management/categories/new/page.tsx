"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useAuth } from '@/store/useAuth';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewCategory() {
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_staff) router.push('/');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('products/categories/', form);
      alert('Category created successfully!');
      router.push('/management/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error creating category.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_staff) return <div className="mt-20 text-center animate-pulse text-slate-400">Checking access...</div>;

  return (
    <div className="mt-8 max-w-2xl mx-auto px-4">
      <Link href="/management/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div className="premium-card rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold text-white mb-6">Create New Category</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. PlayStation 5 Games"
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea 
              rows={4} 
              placeholder="Describe what kind of products this category will contain..."
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-6 flex items-center justify-center gap-2"
          >
            {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : <Save size={20} />}
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  );
}
