import prisma from "@/lib/prisma";
import { createGalleryImage, deleteGalleryImage } from "./actions";
import { Image as ImageIcon, Trash2, Upload, Type } from "lucide-react";
import Image from "next/image";

export default async function GalleryPage() {
  const images = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-black text-slate-800">Alumni Gallery</h2>
        <p className="text-slate-500 font-medium text-sm">Upload and manage photos for the gallery section.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-10">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Upload New Photo</h3>
        
        <form action={createGalleryImage} className="grid md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <ImageIcon size={14} /> Photo
            </label>
            <input type="file" name="image" required accept="image/*" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-sm font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition-all cursor-pointer" />
          </div>

          <div className="md:col-span-5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <Type size={14} /> Caption (Optional)
            </label>
            <input type="text" name="caption" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium text-slate-800" placeholder="e.g. Reuni Akbar Angkatan 2020" />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-slate-900 text-white px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex justify-center items-center gap-2 h-[50px]">
              <Upload size={16} /> Upload
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-square relative flex items-center justify-center bg-slate-50">
              <Image src={img.imageUrl} alt={img.caption || "Gallery photo"} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <form action={async () => {
                  "use server"
                  await deleteGalleryImage(img.id)
                }}>
                  <button type="submit" className="bg-red-500/90 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2">
                    <Trash2 size={16} /> Delete
                  </button>
                </form>
              </div>
            </div>
            {img.caption && (
              <div className="p-4 border-t border-slate-100 bg-white">
                <p className="text-xs font-bold text-slate-600 truncate">{img.caption}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  {new Date(img.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            )}
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p className="text-sm font-bold uppercase tracking-widest">No Photos Yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
