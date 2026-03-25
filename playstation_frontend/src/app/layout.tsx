import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "@/components/Notifications/ToastContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlayStation Store Elite",
  description: "Next-gen E-Commerce aesthetic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <ToastContainer />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto p-6">
          {children}
        </main>
        <footer className="py-8 text-center text-sm text-slate-500 glass mt-auto border-t-0">
          © 2026 PlayStation Store Elite Concept. Designed for greatness.
        </footer>
      </body>
    </html>
  );
}
