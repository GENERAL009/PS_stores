"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_staff) {
      router.push('/');
    } else {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = () => {
    api.get('products/products/').then(res => setProducts(res.data)).catch(console.error);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`products/products/${id}/`);
      fetchProducts();
    } catch (e) {
      alert('Error deleting product');
    }
  };

  if (!user?.is_staff) return <div className="mt-20 text-center animate-pulse">Checking permissions...</div>;

  return (
    <div className="mt-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-white">Manage Products</h1>
        <Link href="/management/products/new" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition-colors font-medium">
          + Add New Product
        </Link>
      </div>

      <div className="premium-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="p-4 text-slate-300">Name</th>
              <th className="p-4 text-slate-300">Model</th>
              <th className="p-4 text-slate-300">Price</th>
              <th className="p-4 text-slate-300">Category</th>
              <th className="p-4 text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-bold">{p.name}</td>
                <td className="p-4 text-slate-400">{p.model}</td>
                <td className="p-4 text-green-400 font-medium">${p.price}</td>
                <td className="p-4 text-slate-400">{p.category?.name || 'N/A'}</td>
                <td className="p-4 flex gap-3 justify-end">
                  <Link href={`/management/products/${p.id}/edit`} className="text-blue-400 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
