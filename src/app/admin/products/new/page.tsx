'use client'

import { createProduct } from "../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import CurrencyInput from "@/components/admin/CurrencyInput";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewProductPage() {
  const [category, setCategory] = useState("");

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1">New Product</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Add item to your store</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <form action={createProduct} encType="multipart/form-data" className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Name</label>
              <input 
                name="name" 
                type="text" 
                required 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="e.g. Kaos Alumni 2026"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
              <textarea 
                name="description" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all min-h-[120px]"
                placeholder="Tell something about this product..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
              <select 
                name="category" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="">Choose Category</option>
                <option value="Baju">Baju</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {category === "Baju" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Sizes</label>
                <div className="flex gap-4">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        name="sizes" 
                        value={size} 
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
                      />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harga Beli</label>
                <CurrencyInput 
                  name="buyPrice" 
                  required 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="100.000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harga Jual</label>
                <CurrencyInput 
                  name="sellPrice" 
                  required 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="150.000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Images</label>
              <ImageUpload name="images" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Type</label>
              <select 
                name="stockType" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              >
                <option value="READY">READY STOCK</option>
                <option value="PREORDER">PRE-ORDER</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Count</label>
              <input 
                name="stockCount" 
                type="number" 
                defaultValue={0}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Est. Arrival (Required for PO)</label>
              <input 
                name="estimatedArrival" 
                type="text" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="e.g. Mei 2026"
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
              >
                <Save size={18} />
                Save Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
