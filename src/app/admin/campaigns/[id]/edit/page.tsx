import { updateCampaign } from "../../../products/actions";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";
import CurrencyInput from "@/components/admin/CurrencyInput";
import ImageUpload from "@/components/admin/ImageUpload";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { position: 'asc' }
      }
    }
  });

  if (!campaign) {
    notFound();
  }

  const serializedCampaign = {
    ...campaign,
    targetAmount: Number(campaign.targetAmount),
  };

  const updateCampaignWithId = updateCampaign.bind(null, campaign.id);

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
          <h2 className="text-3xl font-black mb-1">Edit Campaign</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update donation program</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <form action={updateCampaignWithId} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Title</label>
              <input 
                name="title" 
                type="text" 
                required 
                defaultValue={campaign.title}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                placeholder="e.g. Beasiswa Alumni 2026"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
              <textarea 
                name="description" 
                defaultValue={campaign.description || ''}
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
                defaultValue={serializedCampaign.targetAmount}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                placeholder="10.000.000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
              <input 
                name="endDate" 
                type="date" 
                defaultValue={campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : ''}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Images</label>
              <ImageUpload 
                name="images" 
                defaultValue={(campaign as any).images?.map((img: any) => img.url)} 
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
              >
                <Save size={18} />
                Update Campaign
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
