"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useAuth } from '@/store/useAuth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewProduct() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', model: '', price: '', category: '', description: '', stock: '10' });
  const [images, setImages] = useState<FileList | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_staff) router.push('/');
    api.get('products/categories/').then(res => setCategories(res.data)).catch(console.error);
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('model', form.model);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('description', form.description);
      formData.append('category_id', form.category);
      
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append('uploaded_images', images[i]);
        }
      }

      await api.post('products/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product created successfully!');
      router.push('/management/products');
    } catch (err: any) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Error creating product. Please check the fields.';
      alert('Error: ' + errorMsg);
      console.error('Full Error:', err.response?.data);
    }
  };

  if (!user?.is_staff) return <div className="mt-20 text-center animate-pulse">Checking access...</div>;

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <Link href="/management/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div className="premium-card rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold text-white mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Model / SKU</label>
            <input required type="text" value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Price ($)</label>
            <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Stock Quantity</label>
            <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
              <option value="">Select Category</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Product Images (You can select multiple)</label>
            <input multiple type="file" accept="image/*" onChange={e => setImages(e.target.files)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/30 mt-6">
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
