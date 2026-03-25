"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '+998',
    password: ''
  });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple phone validation
    if (!/^\+998\d{9}$/.test(formData.phone_number)) {
        alert("Phone number must be in format +998XXXXXXXXX");
        return;
    }

    try {
      await api.post('users/register/', formData);
      alert("Registration successful! Please login.");
      router.push('/login');
    } catch (error: any) {
      const msg = error.response?.data ? JSON.stringify(error.response.data) : "Failed to register.";
      alert(msg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-10">
      <div className="premium-card p-10 rounded-3xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Join Elite</h2>
        <p className="text-slate-400 text-center mb-8">Elevate your gaming experience.</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
              <input name="first_name" type="text" required value={formData.first_name} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
              <input name="last_name" type="text" required value={formData.last_name} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
            <input name="phone_number" type="text" required placeholder="+998901234567" value={formData.phone_number} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-purple-500/30 mt-6">
            Create Account
          </button>
        </form>
        <p className="text-center text-slate-400 mt-6 text-sm">
          Already a member? <Link href="/login" className="text-purple-400 hover:text-purple-300 ml-1">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
