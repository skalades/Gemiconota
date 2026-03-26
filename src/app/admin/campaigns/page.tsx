import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Heart, Calendar, Edit, Trash2 } from "lucide-react";
import DeleteCampaignButton from "./DeleteCampaignButton";
import { formatPrice } from "@/lib/utils";

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black mb-2">Campaigns</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Manage donation programs</p>
        </div>
        <Link 
          href="/admin/campaigns/new" 
          className="bg-pink-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-pink-700 transition-all shadow-lg shadow-pink-200"
        >
          <Plus size={18} />
          Create Campaign
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Campaign</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Progress</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">End Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">No campaigns found.</td>
              </tr>
            ) : (
              campaigns.map((campaign) => {
                const progress = (Number(campaign.currentAmount) / Number(campaign.targetAmount)) * 100;
                return (
                <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                        {campaign.imageUrl ? (
                           <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                        ) : (
                           <Heart className="w-6 h-6 text-pink-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{campaign.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate max-w-[200px]">{campaign.description || 'No description'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">
                      {formatPrice(campaign.targetAmount)}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-pink-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">{Math.round(progress)}% Funded</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Calendar size={14} />
                      {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('id-ID') : 'No Limit'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/campaigns/${campaign.id}/edit`}
                        className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeleteCampaignButton id={campaign.id} />
                    </div>
                  </td>
                </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
