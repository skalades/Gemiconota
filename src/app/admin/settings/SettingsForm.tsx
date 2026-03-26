'use client'

import { updateSettings } from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";
import { useTransition, useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";

interface SettingsFormProps {
  settingsMap: Record<string, string>;
}

export default function SettingsForm({ settingsMap }: SettingsFormProps) {
  let savedHeroImages: string[] = [];
  try {
    const rawHeroImages = settingsMap["hero_images"];
    if (rawHeroImages) {
      savedHeroImages = JSON.parse(rawHeroImages);
    } else if (settingsMap["hero_image"]) {
      savedHeroImages = [settingsMap["hero_image"]];
    } else {
      savedHeroImages = ["https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"];
    }
  } catch (e) {
    savedHeroImages = [];
  }

  const getDef = (key: string, def: string) => settingsMap[key] || def;

  const [isPending, startTransition] = useTransition();
  const [successMode, setSuccessMode] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSuccessMode(false);
    
    startTransition(async () => {
      try {
        await updateSettings(formData);
        setSuccessMode(true);
        setTimeout(() => setSuccessMode(false), 4000);
      } catch (err) {
        console.error("Save failed", err);
        alert("Failed to save settings. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* HERO SECTION */}
      <div className="mb-10">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Hero Section</h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Hero Title 1</label>
            <input type="text" name="hero_title1" defaultValue={getDef("hero_title1", "KONEKSI")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Hero Title 2 (Italic)</label>
            <input type="text" name="hero_title2" defaultValue={getDef("hero_title2", "GLOBAL")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Hero Title 3</label>
            <input type="text" name="hero_title3" defaultValue={getDef("hero_title3", "LOKAL")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Hero Description</label>
          <textarea name="hero_desc" defaultValue={getDef("hero_desc", "Platform modern untuk alumni SMKN 2 Garut. Menyatukan visi, membangun sinergi, dan merayakan pencapaian kolektif.")} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Hero Images (Slider)</label>
          <ImageUpload 
            name="hero_images" 
            defaultValue={savedHeroImages} 
            maxImages={5} 
          />
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="mb-10">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Map Section</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Map Title 1</label>
            <input type="text" name="map_title1" defaultValue={getDef("map_title1", "PETA")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Map Title 2</label>
            <input type="text" name="map_title2" defaultValue={getDef("map_title2", "SINERGI")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Map Description</label>
          <textarea name="map_desc" defaultValue={getDef("map_desc", "Jelajahi jaringan alumni kami yang dinamis. Dari Garut untuk dunia.")} rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
        </div>
      </div>

      {/* ACTIVITIES SECTION */}
      <div className="mb-10">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Activities Section</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Activities Title 1</label>
            <input type="text" name="act_title1" defaultValue={getDef("act_title1", "KEGIATAN")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Activities Title 2</label>
            <input type="text" name="act_title2" defaultValue={getDef("act_title2", "ALUMNI")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Activities Description</label>
          <textarea name="act_desc" defaultValue={getDef("act_desc", "Update dan agenda terbaru dari komunitas alumni GEMICONOTA.")} rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="mb-10">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Gallery Section</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Gallery Title 1</label>
            <input type="text" name="gal_title1" defaultValue={getDef("gal_title1", "GALERI")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Gallery Title 2</label>
            <input type="text" name="gal_title2" defaultValue={getDef("gal_title2", "KITA")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Gallery Description</label>
          <textarea name="gal_desc" defaultValue={getDef("gal_desc", "Momen kebersamaan yang tak terlupakan.")} rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="mb-10">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Footer Section</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Footer Title</label>
            <input type="text" name="footer_title" defaultValue={getDef("footer_title", "HELLO")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Email Address</label>
            <input type="email" name="footer_email" defaultValue={getDef("footer_email", "hello@gemiconota.com")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Address Line 1</label>
            <input type="text" name="footer_address1" defaultValue={getDef("footer_address1", "Jl. Suherman No.90")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Address Line 2 (City, Country)</label>
            <input type="text" name="footer_address2" defaultValue={getDef("footer_address2", "Garut, Indonesia")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        {successMode ? (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 font-bold text-xs uppercase tracking-widest animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={16} /> 
            Settings Saved Successfully!
          </div>
        ) : (
          <div /> // empty flex spacer
        )}
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <Save size={16} />
              Save All Settings
            </>
          )}
        </button>
      </div>

    </form>
  )
}
