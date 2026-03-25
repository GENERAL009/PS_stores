import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "@/components/Notifications/ToastContainer";

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
        <footer className="py-20 border-t border-slate-950 text-center space-y-4">
           <p className="text-[10px] font-black text-slate-800 tracking-[0.5em] uppercase">© 2026 PlayStation Store Elite Concept. Designed for greatness.</p>
           <div className="flex justify-center gap-6 opacity-20 hover:opacity-100 transition-opacity">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
           </div>
        </footer>
        <ToastContainer />
      </body>
    </html>
  );
}
