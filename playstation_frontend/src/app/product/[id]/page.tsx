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
} from "lucide-react";
import { api } from "@/lib/axios";
import { useAuth } from "@/store/useAuth";
import { useCart } from "@/store/useCart";
import { useNotificationStore } from "@/store/useNotificationStore";
import Link from "next/link";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
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
        <p className="text-slate-400 animate-pulse font-medium">Entering the elite experience...</p>
      </div>
    );
  if (!product)
    return (
      <div className="mt-20 text-center py-20 bg-slate-900/50 rounded-3xl max-w-2xl mx-auto border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-2">Item not found</h2>
        <p className="text-slate-500 mb-6">
          The product you're looking for might have been moved or deleted.
        </p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">
          Return Home
        </Link>
      </div>
    );

  const descriptionLimit = 300;
  const isDescriptionLong = product.description.length > descriptionLimit;

  return (
    <div className="mt-8 max-w-7xl mx-auto px-4 pb-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-10 group"
      >
        <div className="p-2 rounded-full bg-slate-900 group-hover:bg-slate-800 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to discovery</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="premium-card rounded-[2.5rem] p-10 relative overflow-hidden flex items-center justify-center min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 z-0"></div>
            <div className="absolute top-6 left-6 z-10">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20">
                Official Gear
              </span>
            </div>

            <div className="w-full max-w-[450px] aspect-square flex items-center justify-center relative group">
              {product.images?.length > 0 ? (
                <img
                  src={product.images[activeImg]?.image}
                  alt={product.name}
                  className="object-contain w-full h-full z-10 drop-shadow-[0_20px_50px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-slate-900/50 rounded-3xl border border-slate-800 flex items-center justify-center italic text-slate-700 font-medium">
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
              Highly Rated Product
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
              <div>
                <p className="text-slate-500 text-sm font-medium">Model Specifications</p>
                <p className="text-slate-200 font-bold">{product.model}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-sm font-medium">Availability</p>
                <p
                  className={`font-bold ${
                    product.stock > 0 ? "text-emerald-400" : "text-rose-500"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} Units left` : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <h3 className="text-xs font-black uppercase text-slate-500 mb-3 tracking-widest">
              Description
            </h3>
            <p className="text-slate-300 leading-relaxed font-medium">
              {isDescriptionLong && !isExpanded
                ? `${product.description.substring(0, descriptionLimit)}...`
                : product.description}
            </p>
            {isDescriptionLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-400 font-bold text-sm mt-3 hover:text-blue-300 transition-colors py-1 inline-flex items-center gap-1"
              >
                {isExpanded ? "View Less" : "Full Specifications"}
              </button>
            )}
          </div>

          <div className="premium-card rounded-[2rem] p-8 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-widest">
                  Total Value
                </p>
                <div className="text-5xl font-black text-white flex items-start gap-1">
                  <span className="text-2xl mt-1 text-blue-500">$</span>
                  {product.price}
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium text-right bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                Tax Included
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`group w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all text-xl font-black shadow-2xl ${
                product.stock === 0
                  ? "bg-slate-800 text-slate-600 grayscale cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/30 hover:scale-[1.01] active:scale-95"
              }`}
            >
              <ShoppingCart
                size={24}
                className={product.stock > 0 ? "group-hover:rotate-12 transition-transform" : ""}
              />
              {product.stock === 0 ? "NOT AVAILABLE" : "SECURE ORDER"}
            </button>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex flex-col items-center p-3 rounded-xl border border-slate-800/50 bg-slate-900/30">
                <ShieldCheck size={18} className="text-blue-400 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">
                  Warranty
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl border border-slate-800/50 bg-slate-900/30">
                <Truck size={18} className="text-blue-400 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">
                  Fast Shipping
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl border border-slate-800/50 bg-slate-900/30">
                <RotateCcw size={18} className="text-blue-400 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">
                  Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 space-y-10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-8">
          <h2 className="text-3xl font-black text-white flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
              <MessageSquare size={28} />
            </div>
            Community Feedback
          </h2>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-400">
            {product.comments?.length || 0} Reviews
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.comments?.length > 0 ? (
            product.comments.map((c: any) => (
              <div
                key={c.id}
                className="premium-card rounded-3xl p-8 hover:border-blue-500/30 transition-colors group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {c.username[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-0.5">{c.username}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-blue-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} className="fill-blue-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed font-medium italic group-hover:text-slate-300 transition-colors">
                  "{c.text}"
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-800">
              <p className="text-slate-600 font-bold text-lg mb-2">The arena is empty.</p>
              <p className="text-slate-700 font-medium">Be the first player to share your thoughts!</p>
            </div>
          )}
        </div>

        <div className="max-w-3xl">
          {accessToken ? (
            <div className="premium-card rounded-[2.5rem] p-10 mt-12">
              <h3 className="text-xl font-bold text-white mb-6">Leave Your Mark</h3>
              <form onSubmit={handlePostComment} className="space-y-6">
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    rows={4}
                    placeholder="Tell us about your experience..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={commenting}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-600/30 active:scale-95 disabled:grayscale"
                >
                  {commenting ? "SAVING..." : "PUBLISH REVIEW"}
                </button>
              </form>
            </div>
          ) : (
            <div className="premium-card rounded-[2.5rem] p-12 mt-12 text-center border-dashed border-blue-500/20">
              <p className="text-slate-400 text-lg mb-8 font-medium">
                Join the community to post your own reviews.
              </p>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-600/40"
              >
                Log In to Participate
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
