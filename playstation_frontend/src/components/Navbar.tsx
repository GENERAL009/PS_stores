"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { api } from '@/lib/axios';

export default function Navbar() {
  const { token, logout, user, login } = useAuth();
  const { items } = useCart() as any;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) {
      api.get('users/profile/')
        .then(res => login(storedToken, res.data))
        .catch(() => logout());
    }
  }, [user, login, logout]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tighter">
          PS ELITE
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-bold text-slate-300 hover:text-white transition-colors">Products</Link>
          {token ? (
            <>
              {user?.is_staff && (
                <Link href="/management/dashboard" className="bg-purple-600/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-purple-600/30 transition-all">
                  Management
                </Link>
              )}
              <Link href="/cart" className="relative text-slate-300 hover:text-white transition-all">
                <ShoppingCart size={22} />
                {items?.length > 0 && <span className="absolute -top-2 -right-2 bg-blue-600 text-[10px] font-black text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-blue-600/40">{items.length}</span>}
              </Link>
              <Link href="/profile" className="text-slate-300 hover:text-white transition-all"><User size={22} /></Link>
              <button onClick={logout} className="text-slate-300 hover:text-red-400 transition-all"><LogOut size={22} /></button>
            </>
          ) : (
            <>
              <Link href="/login" className="font-bold text-slate-300 hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl transition-all font-black text-sm shadow-xl shadow-blue-600/30">BECOME A MEMBER</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
           {token && (
              <Link href="/cart" className="relative text-slate-300 p-2">
                <ShoppingCart size={22} />
                {items?.length > 0 && <span className="absolute top-1 right-1 bg-blue-600 text-[9px] font-black text-white rounded-full w-4 h-4 flex items-center justify-center">{items.length}</span>}
              </Link>
           )}
           <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 bg-slate-900 rounded-xl">
             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden" onClick={closeMenu}>
           <div className="absolute right-0 top-0 h-full w-[80%] max-w-[300px] bg-slate-950 shadow-2xl p-8 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                 <span className="font-black text-blue-500 italic tracking-widest">MENU</span>
                 <button onClick={closeMenu} className="p-2 bg-slate-900 rounded-full"><X size={20} /></button>
              </div>

              <div className="flex flex-col gap-4">
                 <Link href="/" onClick={closeMenu} className="flex items-center justify-between text-xl font-bold text-white p-4 bg-white/5 rounded-2xl">
                    Discovery <ChevronRight size={18} className="text-slate-600" />
                 </Link>
                 
                 {token ? (
                    <>
                       {user?.is_staff && (
                          <Link href="/management/dashboard" onClick={closeMenu} className="flex items-center justify-between text-xl font-bold text-purple-400 p-4 bg-purple-500/10 rounded-2xl">
                             Management <ChevronRight size={18} className="text-purple-900" />
                          </Link>
                       )}
                       <Link href="/profile" onClick={closeMenu} className="flex items-center justify-between text-xl font-bold text-white p-4 bg-white/5 rounded-2xl">
                          My Profile <ChevronRight size={18} className="text-slate-600" />
                       </Link>
                       <button onClick={() => { logout(); closeMenu(); }} className="flex items-center justify-between text-xl font-bold text-rose-500 p-4 bg-rose-500/10 rounded-2xl text-left">
                          Sign Out <LogOut size={18} />
                       </button>
                    </>
                 ) : (
                    <>
                       <Link href="/login" onClick={closeMenu} className="flex items-center justify-between text-xl font-bold text-white p-4 bg-white/5 rounded-2xl">
                          Sign In <ChevronRight size={18} className="text-slate-600" />
                       </Link>
                       <Link href="/register" onClick={closeMenu} className="flex items-center justify-between text-xl font-bold text-blue-400 p-4 bg-blue-500/10 rounded-2xl">
                          Join Elite <ChevronRight size={18} className="text-blue-900" />
                       </Link>
                    </>
                 )}
              </div>

              <div className="mt-auto py-8 text-center border-t border-slate-900">
                 <p className="text-[10px] font-black text-slate-700 tracking-[0.3em] uppercase">PlayStation Elite Store</p>
                 <p className="text-[10px] text-slate-800 mt-2">v2.1.0 Ready</p>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
}
