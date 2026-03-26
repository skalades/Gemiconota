"use client";

import { createActivity } from "../actions";
import Link from "next/link";
import { ArrowLeft, Calendar, Image as ImageIcon, MapPin, Type, AlignLeft } from "lucide-react";

export default function NewActivityPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/activities" className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-slate-800">New Activity</h2>
          <p className="text-slate-500 font-medium text-sm">Schedule a new event for alumni.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <form action={createActivity} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <Type size={14} /> Title
            </label>
            <input type="text" name="title" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium text-slate-800" placeholder="e.g. Reuni Akbar Angkatan 2010" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <AlignLeft size={14} /> Description
            </label>
            <textarea name="description" required rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium text-slate-800" placeholder="Provide details about the activity..." />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <Calendar size={14} /> Date
              </label>
              <input type="date" name="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium text-slate-800" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <MapPin size={14} /> Location
              </label>
              <input type="text" name="location" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium text-slate-800" placeholder="e.g. Gd. Serbaguna SMKN 2 Garut" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <ImageIcon size={14} /> Image
            </label>
            <input type="file" name="image" accept="image/*" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-sm font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition-all cursor-pointer" />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <Link href="/admin/activities" className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
