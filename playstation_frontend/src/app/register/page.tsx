"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "+998",
    password: "",
  });
  const addNotification = useNotificationStore((state) => state.addNotification);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\+998\d{9}$/.test(formData.phone_number)) {
      addNotification({
        type: "warning",
        message: "Format: +998XXXXXXXXX",
      });
      return;
    }
    try {
      await api.post("users/register/", formData);
      addNotification({
        type: "success",
        message: "Registration successful! Login now.",
      });
      router.push("/login");
    } catch (error: any) {
      addNotification({ type: "error", message: "Failed to register." });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-10">
      <div className="premium-card p-8 sm:p-10 rounded-3xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 text-center uppercase tracking-tight">Join Elite</h2>
        <p className="text-slate-400 text-center mb-8 text-sm sm:text-base">Elevate your gaming experience.</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
              <input
                name="first_name"
                type="text"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
              <input
                name="last_name"
                type="text"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
            <input
              name="phone_number"
              type="text"
              required
              placeholder="+998901234567"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
            />
          </div>
          <button
            type="submit"
            className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl transition-all shadow-xl shadow-purple-500/30 mt-6 uppercase tracking-widest active:scale-95"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-slate-400 mt-8 text-xs font-bold">
          Already a member?{" "}
          <Link href="/login" className="text-purple-500 hover:underline ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
