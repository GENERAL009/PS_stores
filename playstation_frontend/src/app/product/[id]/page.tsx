"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  ArrowLeft,
  MessageSquare,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  X,
  Maximize2,
} from "lucide-react";
import { api } from "@/lib/axios";
import { useAuth } from "@/store/useAuth";
import { useCart } from "@/store/useCart";
import { useNotificationStore } from "@/store/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { accessToken } = useAuth();
  const { setItems } = useCart() as any;
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    api
      .get(`products/products/${id}/`)
      .then((res) => {
        setProduct(res.data);
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
    } catch (e) {
      console.error(e);
      addNotification({ type: "error", message: "Error adding to cart." });
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommenting(true);
    try {
      await api.post(`products/products/${id}/comment/`, { text: newComment });
      setNewComment("");
      const res = await api.get(`products/products/${id}/`);
      setProduct(res.data);
      addNotification({ type: "success", message: "Review posted successfully!" });
    } catch (e) {
      console.error(e);
      addNotification({ type: "error", message: "Error posting review." });
    } finally {
      setCommenting(false);
    }
  };

  if (loading)
    return (
      <div className="mt-20 text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 animate-pulse font-medium text-xs tracking-[0.2em] uppercase">Initializing Armory...</p>
      </div>
    );
  if (!product)
    return (
      <div className="mt-20 text-center py-20 bg-slate-900/50 rounded-3xl max-w-2xl mx-auto border border-slate-800 px-4">
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter italic">Data Lost</h2>
        <p className="text-slate-500 mb-6">
          The asset you're looking for is no longer in the segment.
        </p>
        <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest">
          Discovery Root
        </Link>
      </div>
    );

  const descriptionLimit = 300;
  const isDescriptionLong = product.description.length > descriptionLimit;

  return (
    <div className="mt-8 max-w-7xl mx-auto px-4 pb-20 overflow-hidden sm:overflow-visible">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-10 group"
      >
        <div className="p-2 rounded-full bg-slate-900 group-hover:bg-slate-800 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-bold text-sm tracking-widest uppercase">Discovery</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <div 
            onClick={() => setIsModalOpen(true)}
            className="premium-card rounded-[2.5rem] p-4 sm:p-10 relative overflow-hidden flex items-center justify-center min-h-[400px] sm:min-h-[550px] cursor-zoom-in group/img"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 z-0"></div>
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20">
                Official Gear
              </span>
            </div>
            
            <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover/img:opacity-100 transition-opacity bg-slate-950/80 p-3 rounded-2xl border border-white/10 text-white">
               <Maximize2 size={20} />
            </div>

            <div className="w-full max-w-[500px] sm:max-w-[450px] aspect-square flex items-center justify-center relative">
              {product.images?.length > 0 ? (
                <motion.img
                  layoutId="product-main-image"
                  src={product.images[activeImg]?.image}
                  alt={product.name}
                  className="object-contain w-full h-full z-10 drop-shadow-[0_25px_60px_rgba(37,99,235,0.4)] group-hover/img:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-slate-900/50 rounded-3xl border border-slate-800 flex items-center justify-center italic text-slate-700 font-medium text-center px-4">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar scroll-smooth">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(idx)}
                  className={`relative shrink-0 w-24 h-24 p-2 rounded-2xl bg-slate-900 border-2 transition-all overflow-hidden ${
                    activeImg === idx
                      ? "border-blue-500 ring-4 ring-blue-500/10"
                      : "border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.image} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Purchase */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 tracking-wider uppercase">
              <Star size={14} className="fill-blue-400" />
              Elite Grade Record
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight uppercase italic">
              {product.name}
            </h1>
            <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6 gap-4">
              <div>
                <p className="text-slate-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Model Spec</p>
                <p className="text-slate-200 font-black text-base sm:text-lg">{product.model}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Availability</p>
                <p
                  className={`font-black text-base sm:text-lg ${
                    product.stock > 0 ? "text-emerald-400" : "text-rose-500"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} Units` : "Empty"}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <h3 className="text-[10px] font-black uppercase text-slate-600 mb-3 tracking-[0.3em]">
              Documentation
            </h3>
            <p className="text-slate-400 leading-relaxed font-medium text-sm sm:text-base italic">
              {isDescriptionLong && !isExpanded
                ? `${product.description.substring(0, descriptionLimit)}...`
                : product.description}
            </p>
            {isDescriptionLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-500 font-black text-[10px] uppercase tracking-widest mt-3 hover:text-blue-400 transition-colors py-1 inline-flex items-center gap-1"
              >
                {isExpanded ? "Close Entry" : "Expand Data"}
              </button>
            )}
          </div>

          <div className="premium-card rounded-[2.5rem] p-8 sm:p-10 space-y-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="flex justify-between items-end gap-2">
              <div>
                <p className="text-slate-500 text-[10px] sm:text-xs font-black mb-1 uppercase tracking-[0.3em]">
                  Acquisition Value
                </p>
                <div className="text-5xl sm:text-6xl font-black text-white flex items-start gap-1 tracking-tighter">
                  <span className="text-2xl mt-1 text-blue-600 font-black">$</span>
                  {product.price}
                </div>
              </div>
              <div className="text-[10px] text-slate-600 font-black text-right bg-slate-950 border border-slate-900 px-4 py-2 rounded-xl uppercase tracking-widest">
                Protected
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`group w-full h-18 sm:h-20 rounded-2xl flex items-center justify-center gap-4 transition-all text-xl font-black shadow-2xl ${
                product.stock === 0
                  ? "bg-slate-900 text-slate-700 grayscale cursor-not-allowed border border-slate-800"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/40 hover:scale-[1.01] active:scale-95"
              }`}
            >
              <ShoppingCart
                size={22}
                className={product.stock > 0 ? "group-hover:rotate-12 transition-transform" : ""}
              />
              {product.stock === 0 ? "OUT OF FREQUENCY" : "EXECUTE ORDER"}
            </button>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-slate-900 bg-black/40">
                <ShieldCheck size={18} className="text-blue-500 mb-2" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                  Secure
                </span>
              </div>
              <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-slate-900 bg-black/40">
                <Truck size={18} className="text-blue-500 mb-2" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                  Instant
                </span>
              </div>
              <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-slate-900 bg-black/40">
                <RotateCcw size={18} className="text-blue-500 mb-2" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                  Return
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 sm:mt-32 space-y-12">
        <div className="flex items-center justify-between border-b border-slate-900 pb-10 gap-4">
          <h2 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-4 uppercase italic tracking-tighter">
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 shadow-inner">
              <MessageSquare size={28} />
            </div>
            Feedback
          </h2>
          <div className="px-5 py-2 bg-slate-950 border border-slate-900 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {product.comments?.length || 0} Records
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {product.comments?.length > 0 ? (
            product.comments.map((c: any) => (
              <div
                key={c.id}
                className="premium-card rounded-[2.5rem] p-8 hover:border-blue-600/20 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-700 to-purple-800 flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/5">
                      {c.username[0].toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-black text-white block text-base uppercase italic">{c.username}</span>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-blue-500 pt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={10} className="fill-blue-500" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed font-bold italic group-hover:text-slate-300 transition-colors text-sm sm:text-base relative z-10">
                  "{c.text}"
                </p>
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-blue-500 group-hover:opacity-10 transition-opacity">
                   <MessageSquare size={100} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-slate-950/30 rounded-[3rem] border-2 border-dashed border-slate-900 px-6">
              <p className="text-slate-700 font-black tracking-[0.4em] uppercase text-xs mb-3">No Data Packets Detected</p>
              <p className="text-slate-800 font-bold italic">Be the first player to initialize the thread.</p>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {accessToken ? (
            <div className="premium-card rounded-[3rem] p-10 sm:p-14 mt-12 bg-gradient-to-br from-slate-900 to-black relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
              <h3 className="text-2xl font-black text-white mb-8 uppercase italic tracking-tighter flex items-center gap-3">
                 <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                 Transmit Review
              </h3>
              <form onSubmit={handlePostComment} className="space-y-8">
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    rows={5}
                    placeholder="Log your experience in the arena..."
                    className="w-full bg-black/60 border-2 border-slate-900 rounded-[2rem] p-8 text-white text-lg focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-800 font-medium"
                  />
                  <div className="absolute bottom-6 right-8 text-[10px] font-black text-slate-800 tracking-widest uppercase">
                     Buffer: Optimized
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={commenting}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-14 py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-2xl shadow-blue-600/40 active:scale-95 disabled:grayscale uppercase tracking-[0.2em]"
                >
                  {commenting ? "TRANSMITTING..." : "PUBLISH DATA"}
                </button>
              </form>
            </div>
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
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-12 sm:top-0 -right-4 sm:-right-12 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="w-full h-full overflow-auto no-scrollbar flex items-center justify-center">
                <motion.img
                  layoutId="product-main-image"
                  src={product.images[activeImg]?.image}
                  className="max-w-full max-h-[80vh] sm:max-h-[90vh] object-contain drop-shadow-[0_0_100px_rgba(37,99,235,0.4)]"
                />
              </div>

              {product.images?.length > 1 && (
                <div className="absolute -bottom-16 left-0 w-full flex justify-center gap-3">
                  {product.images.map((img: any, idx: number) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        activeImg === idx ? "bg-blue-600 w-8" : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
