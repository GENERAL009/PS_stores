import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import { Instagram, Send } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PS ELITE | Premium Gaming Store",
  description: "Next-gen gaming gear for the elite collective.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-slate-300 min-h-screen selection:bg-blue-600 selection:text-white`}>
        <Navbar />
        <main className="max-w-7xl mx-auto min-h-screen">
          {children}
        </main>
        <footer className="py-24 border-t border-slate-950 text-center space-y-10 group/footer">
           <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-10">
                 <a
                   href="https://www.instagram.com/usmonov_a.a_?utm_source=qr&igsh=MW40dm5heXlxNnJmZw=="
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-500 hover:-translate-y-1"
                 >
                    <Instagram size={24} />
                 </a>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-900 group-hover/footer:bg-blue-600 transition-colors duration-1000"></div>
                 <a
                   href="https://t.me/Sa1nt_GHOST"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-500 hover:-translate-y-1"
                 >
                    <Send size={24} className="ml-0.5" />
                 </a>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-800 tracking-[0.5em] uppercase group-hover/footer:text-slate-700 transition-colors">2026 PlayStation Store Elite Concept. Designed for greatness.</p>
                 <div className="flex justify-center gap-6 opacity-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                 </div>
              </div>
           </div>
        </footer>
        <ToastContainer theme="dark" position="top-right" />
      </body>
    </html>
  );
}
