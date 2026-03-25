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
      // Backend returns { access, refresh }
      const res = await api.post("users/token/", { email, password });
      const { access, refresh } = res.data;

      // Fetch profile using the new access token
      const profile = await api.get("users/profile/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      // Save both tokens and user profile
      login(access, refresh, profile.data);
      addNotification({ type: "success", message: "Successfully signed in!" });
      router.push("/");
    } catch (error) {
      addNotification({ type: "error", message: "Invalid email or password" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="premium-card p-10 rounded-3xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-400 text-center mb-8">Sign in to your PlayStation Elite account.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/30 mt-4"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-slate-400 mt-6 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 ml-1">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
