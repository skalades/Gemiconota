"use client";

import { createCampaign } from "../../products/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import CurrencyInput from "@/components/admin/CurrencyInput";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewCampaignPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/campaigns" 
          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-black mb-1">New Campaign</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Start a donation program</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <form action={createCampaign} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Title</label>
              <input 
                name="title" 
                type="text" 
                required 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                placeholder="e.g. Beasiswa Alumni 2026"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
              <textarea 
                name="description" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all min-h-[120px]"
                placeholder="Details of the campaign..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Amount</label>
              <CurrencyInput 
                name="targetAmount" 
                required 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                placeholder="10.000.000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
              <input 
                name="endDate" 
                type="date" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Images</label>
              <ImageUpload name="images" />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-pink-200 flex items-center justify-center gap-3"
              >
                <Save size={18} />
                Start Campaign
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
