"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/store/useAuth";
import {
  ShoppingCart,
  ShieldCheck,
  Star,
  Users,
  MessageSquare,
  Lock,
  User,
  Plus,
  Minus,
  Maximize2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/useNotificationStore";
import Link from "next/link";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const { setItems } = useCart() as any;
  const { accessToken } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  // Gallery state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api
      .get(`products/products/${id}/`)
      .then((res) => {
        setProduct(res.data);
        setComments(res.data.comments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = async () => {
    if (!accessToken) {
      addNotification({ type: "warning", message: "Please log in first!" });
      router.push("/login");
      return;
    }
    try {
      await api.post("orders/cart/", { product_id: product.id });
      const res = await api.get("orders/cart/");
      setItems(res.data.items);
      addNotification({ type: "success", message: "Successfully added to cart!" });
    } catch (e: any) {
      console.error(e);
      const errorMsg = e.response?.data?.error || "Error adding to cart.";
      addNotification({ type: "error", message: errorMsg });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      const res = await api.post("products/comments/", {
        product: product.id,
        text: newComment,
      });
      setComments([res.data, ...comments]);
      setNewComment("");
      addNotification({ type: "success", message: "Comment deployed successfully." });
    } catch (err) {
      addNotification({ type: "error", message: "Failed to post comment." });
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20">
         <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest italic">Asset Not Found</h2>
      </div>
    );

  return (
    <div className="px-4 sm:px-0 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Side: Massive Image Gallery */}
        <div className="lg:col-span-7 space-y-8">
           <div className="relative group">
              <motion.div 
                layoutId="product-main-image"
                onClick={() => setIsModalOpen(true)}
                className="relative w-full aspect-square rounded-[3rem] bg-slate-950 border border-slate-900 overflow-hidden flex items-center justify-center p-12 cursor-zoom-in"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={product.images?.[0]?.image}
                  alt={product.name}
                  className="w-full h-full object-contain z-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Maximize Icon */}
                <div className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                   <Maximize2 className="text-white" size={20} />
                </div>
              </motion.div>
              
              {/* Image Sub-indicators */}
              <div className="flex gap-4 mt-6">
                 {product.images?.map((img: any, idx: number) => (
                    <div key={idx} className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 p-3 overflow-hidden opacity-50 hover:opacity-100 cursor-pointer transition-all">
                       <img src={img.image} className="w-full h-full object-contain" />
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Side: Deployment Config (Info) */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 text-blue-500 font-black text-[10px] tracking-widest uppercase rounded-lg">
                Verified Asset
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
            </div>

            <div className="space-y-2">
               <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                 {product.name}
               </h1>
               <div className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
                 <span>Model: {product.model}</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                 <span>ID: {product.id}</span>
               </div>
            </div>

            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-slate-800 shadow-2xl space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">Acquisition Value</p>
                <div className="flex items-start gap-1">
                  <span className="text-blue-600 text-xl font-black mt-2">$</span>
                  <span className="text-6xl font-black text-white tabular-nums tracking-tighter italic">
                    {product.price}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Logistics</p>
                <p className="text-emerald-500 font-black tracking-widest uppercase text-xs">Immediate Deployment</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-900 space-y-1">
                 <p className="text-[9px] font-black text-slate-600 uppercase">Availability</p>
                 <p className="text-white font-black italic">{product.stock > 0 ? "IN STOCK" : "DEPLETED"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-900 space-y-1">
                 <p className="text-[9px] font-black text-slate-600 uppercase">Warranty</p>
                 <p className="text-white font-black italic">GLOBAL ELITE</p>
              </div>
            </div>

            <button
              onClick={addToCart}
              className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-4 uppercase tracking-[0.3em] group active:scale-[0.98]"
            >
              <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
              Initialize Acquisition
            </button>
          </div>

          <div className="flex items-center gap-8 px-4 opacity-40">
             <div className="flex items-center gap-2">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Encrypted</span>
             </div>
             <div className="flex items-center gap-2">
                <Users size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Collective approved</span>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Section: Comments & Specs */}
      <div className="mt-32 space-y-16">
        <div className="flex items-center gap-6 mb-12">
           <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">COMMUNICATIONS</h2>
           <div className="flex-1 h-px bg-gradient-to-r from-slate-900 to-transparent"></div>
        </div>

        {accessToken ? (
          <form onSubmit={handleComment} className="max-w-3xl space-y-6 bg-slate-950 p-8 sm:p-12 rounded-[3.5rem] border border-slate-900 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-focus-within:opacity-10 transition-opacity">
               <MessageSquare size={120} />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/40">
                  <User size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signed In As</p>
                  <p className="text-sm font-black text-white italic uppercase tracking-tight">Active Operative</p>
               </div>
            </div>

            <textarea
              className="w-full bg-black/40 border-2 border-slate-900 rounded-[2rem] p-8 text-white placeholder-slate-700 outline-none focus:border-blue-600 transition-all min-h-[160px] resize-none text-lg font-medium"
              placeholder="Transmit your feedback to the collective..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            
            <button
              type="submit"
              className="px-12 py-5 bg-white text-black font-black rounded-[1.5rem] hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95"
            >
              Broadcast Message
            </button>
          </form>
        ) : (
          <div className="premium-card rounded-[3rem] p-12 sm:p-20 mt-12 text-center border-dashed border-blue-600/20 bg-blue-600/5 group">
             <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/40 group-hover:scale-110 transition-transform duration-500">
                <User className="text-white" size={40} />
             </div>
             <p className="text-slate-300 text-xl sm:text-2xl font-black mb-10 max-w-sm mx-auto uppercase italic tracking-tighter leading-tight">
               Authentification Required to Submit Data
             </p>
             <Link
               href="/login"
               className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-12 sm:px-16 py-4 sm:py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-2xl shadow-blue-600/50 uppercase tracking-[0.2em] hover:scale-105 active:scale-95"
             >
               Sign In
             </Link>
             <p className="mt-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Join the Elite Collective
             </p>
          </div>
        )}

        <div className="max-w-4xl space-y-10 mt-20">
          {comments.map((comment: any) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={comment.id} 
              className="flex gap-6 sm:gap-10 group"
            >
              <div className="flex flex-col items-center gap-4">
                 <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:border-blue-600 transition-all shadow-lg">
                   <User size={24} />
                 </div>
                 <div className="flex-1 w-px bg-slate-900"></div>
              </div>
              <div className="pb-10 space-y-3 flex-1 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-black text-white italic tracking-tight uppercase leading-none truncate">
                    {comment.user?.first_name || "Anonymous"} {comment.user?.last_name || "Operative"}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest shrink-0">
                    {new Date(comment.created_at).toLocaleDateString()} - Encrypted
                  </span>
                </div>
                <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed break-words">
                  {comment.text}
                </p>
              </div>
            </motion.div>
          ))}
          {comments.length === 0 && (
             <div className="py-20 text-center bg-slate-950/20 rounded-[3rem] border-2 border-dashed border-slate-900/50">
                <p className="text-slate-700 font-black tracking-[0.3em] uppercase text-xs">No logs detected for this asset.</p>
             </div>
          )}
        </div>
      </div>

      {/* Full-screen Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.button 
              className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors z-[110]"
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
            >
               <X className="text-white" size={30} />
            </motion.button>
            
            <motion.img
              layoutId="product-main-image"
              src={product.images?.[0]?.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain drop-shadow-[0_40px_100px_rgba(37,99,235,0.4)]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
