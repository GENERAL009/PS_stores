"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";
import { useAuth } from "@/store/useAuth";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("users/token/", { email, password });
      const { access, refresh } = res.data;
      const profile = await api.get("users/profile/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      login(access, refresh, profile.data);
      addNotification({ type: "success", message: "Successfully signed in!" });
      router.push("/");
    } catch (error) {
      addNotification({ type: "error", message: "Invalid email or password" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[65vh] px-4 py-10">
      <div className="premium-card p-8 sm:p-10 rounded-3xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 text-center uppercase tracking-tight">Welcome Back</h2>
        <p className="text-slate-400 text-center mb-8 text-sm sm:text-base">Sign in to your PlayStation Elite account.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
            />
          </div>
          <button
            type="submit"
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-xl shadow-blue-600/30 mt-4 uppercase tracking-widest active:scale-95"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-slate-400 mt-8 text-xs font-bold">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline ml-1">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
