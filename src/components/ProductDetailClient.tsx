"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ShoppingBag, Plus, Minus, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "motion/react";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    sellPrice: any;
    images: { url: string }[];
    sizes: string | null;
    stockType: string;
    stockCount: number;
    category: string | null;
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const totalCartItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizes = product.sizes ? product.sizes.split(",") : [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.sellPrice),
      imageUrl: product.images[selectedImage]?.url || "",
      quantity,
      size: selectedSize,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs / Back */}
        <Link 
          href="/#store" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest mb-12 transition-all group"
        >
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-white transition-all">
            <ChevronLeft size={16} />
          </div>
          Back to Store
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Images */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden relative shadow-sm border border-slate-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  <Image 
                    src={product.images[selectedImage]?.url || "/placeholder-product.png"} 
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              {product.stockType === "PREORDER" && (
                <div className="absolute top-8 right-8 bg-amber-50/90 backdrop-blur-md text-amber-600 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
                  Pre-Order
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-24 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 relative ${
                      selectedImage === idx ? "border-slate-900 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt={`${product.name} ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {product.category || "General"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  SKU: {product.id.substring(0, 8).toUpperCase()}
                </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-slate-900">
                {formatPrice(Number(product.sellPrice))}
              </p>
            </div>

            <div className="h-px bg-slate-200 w-24" />

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {product.description || "No description provided for this item."}
              </p>
            </div>

            {sizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Available Sizes</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-2xl font-black text-xs transition-all border ${
                        selectedSize === size 
                          ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" 
                          : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quantity</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-4 py-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-black text-slate-900 w-4 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {product.stockCount} Items left
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                  isAdded 
                    ? "bg-emerald-500 text-white shadow-emerald-200" 
                    : "bg-slate-900 text-white hover:bg-black shadow-slate-200"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={20} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      {mounted && totalCartItems > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Link 
            href="/#store"
            className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-all group relative"
          >
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-slate-50">
              {totalCartItems}
            </span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
