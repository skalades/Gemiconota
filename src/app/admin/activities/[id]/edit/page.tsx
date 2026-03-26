import prisma from "@/lib/prisma";
import { updateActivity } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Calendar, Image as ImageIcon, MapPin, Type, AlignLeft } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function EditActivityPage({ params }: { params: { id: string } }) {
  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
  });

  if (!activity) {
    notFound();
  }

  // Format date for <input type="date"> (YYYY-MM-DD)
  const formattedDate = new Date(activity.date).toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/activities" className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Edit Activity</h2>
          <p className="text-slate-500 font-medium text-sm">Update event details.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <form action={async (formData) => {
          "use server"
          await updateActivity(activity.id, formData);
        }} className="space-y-6">
          <input type="hidden" name="existingImageUrl" value={activity.imageUrl || ""} />

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <Type size={14} /> Title
            </label>
            <input type="text" name="title" required defaultValue={activity.title} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium text-slate-800" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <AlignLeft size={14} /> Description
            </label>
            <textarea name="description" required defaultValue={activity.description} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium text-slate-800" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <Calendar size={14} /> Date
              </label>
              <input type="date" name="date" required defaultValue={formattedDate} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium text-slate-800" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <MapPin size={14} /> Location
              </label>
              <input type="text" name="location" defaultValue={activity.location || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium text-slate-800" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <ImageIcon size={14} /> Image
            </label>
            {activity.imageUrl && (
              <div className="mb-4 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
                <Image src={activity.imageUrl} alt={activity.title} fill className="object-cover" />
              </div>
            )}
            <input type="file" name="image" accept="image/*" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-sm font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition-all cursor-pointer" />
            <p className="mt-2 text-xs text-slate-400 font-medium">Leave empty to keep current image.</p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <Link href="/admin/activities" className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" className="bg-brand-blue text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/20">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
