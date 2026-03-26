import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { deleteActivity } from "./actions";

export default async function ActivitiesPage() {
  const activities = await prisma.activity.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Alumni Activities</h2>
          <p className="text-slate-500 font-medium text-sm">Manage scheduled and past alumni events.</p>
        </div>
        <Link href="/admin/activities/new" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 transition-all shadow-xl shadow-slate-200">
          <Plus size={16} />
          New Activity
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Location</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.length === 0 && (
              <tr>
                <td colSpan={3} className="px-8 py-10 text-center text-sm font-bold text-slate-400">No activities found.</td>
              </tr>
            )}
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 relative">
                      {activity.imageUrl ? (
                        <Image src={activity.imageUrl} alt={activity.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Calendar size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{activity.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-sm">{activity.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(activity.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    {activity.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <MapPin size={14} className="text-slate-400" />
                        {activity.location}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/admin/activities/${activity.id}/edit`} className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-brand-blue hover:border-brand-blue flex items-center justify-center transition-all shadow-sm">
                      <Edit size={16} />
                    </Link>
                    <form action={async () => {
                      "use server"
                      await deleteActivity(activity.id)
                    }}>
                      <button type="submit" className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-red-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
