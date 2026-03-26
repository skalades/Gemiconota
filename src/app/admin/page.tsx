import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, Users, Heart, TrendingUp, ArrowUpRight, Plus, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const [userCount, productCount, campaignCount] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.product.count().catch(() => 0),
    prisma.campaign.count().catch(() => 0)
  ]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Alumni" 
          value={userCount} 
          icon={<Users size={20} />} 
          change="+12%" 
          color="bg-blue-500"
          textColor="text-blue-600"
        />
        <StatCard 
          title="Total Products" 
          value={productCount} 
          icon={<ShoppingBag size={20} />} 
          change="+3" 
          color="bg-emerald-500"
          textColor="text-emerald-600"
        />
        <StatCard 
          title="Active Campaigns" 
          value={campaignCount} 
          icon={<Heart size={20} />} 
          change="Live" 
          color="bg-pink-500"
          textColor="text-pink-600"
        />
        <StatCard 
          title="Platform Revenue" 
          value={formatPrice(0)} 
          icon={<TrendingUp size={20} />} 
          change="+0%" 
          color="bg-amber-500"
          textColor="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900 italic">Recent Activities</h2>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-all">View All</button>
            </div>
            
            <div className="space-y-8">
              <ActivityItem 
                title="New Alumni Registered" 
                subtitle="Asep Sunandar (2018) joined the community" 
                time="2 hours ago" 
                icon={<Users size={16} className="text-blue-500" />}
              />
              <ActivityItem 
                title="Campaign Donation Received" 
                subtitle={`${formatPrice(500000)} for Beasiswa Alumni 2026`} 
                time="5 hours ago" 
                icon={<Heart size={16} className="text-pink-500" />}
              />
              <ActivityItem 
                title="Stock Updated" 
                subtitle="Heritage Hoodie stock increased by 20" 
                time="Yesterday" 
                icon={<ShoppingBag size={16} className="text-emerald-500" />}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-black p-10 rounded-[2.5rem] shadow-2xl shadow-slate-300 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={120} />
            </div>
            <h2 className="text-xl font-black mb-2 italic">Quick Actions</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-10">Administrative Control</p>
            
            <div className="space-y-4 relative z-10">
              <QuickActionLink href="/admin/products/new" label="Add New Product" icon={<Plus size={18} />} />
              <QuickActionLink href="/admin/campaigns/new" label="Start Campaign" icon={<Heart size={18} />} />
              <QuickActionLink href="/admin/alumni" label="Manage Alumni" icon={<Users size={18} />} />
              <QuickActionLink href="/" label="Preview Site" icon={<ExternalLink size={18} />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, change, color, textColor }: { title: string, value: any, icon: any, change: string, color: string, textColor: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 ${color} rounded-2xl text-white shadow-lg shadow-${color.split('-')[1]}-100`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black ${textColor} bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100`}>
          <ArrowUpRight size={10} />
          {change}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{title}</p>
        <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ title, subtitle, time, icon }: { title: string, subtitle: string, time: string, icon: any }) {
  return (
    <div className="flex gap-5 group cursor-default">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-lg transition-all">
        {icon}
      </div>
      <div className="flex-1 min-w-0 py-1">
        <div className="flex justify-between items-start mb-1">
          <p className="font-black text-sm text-slate-800 tracking-tight">{title}</p>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-xs font-bold text-slate-500 truncate">{subtitle}</p>
      </div>
    </div>
  );
}

function QuickActionLink({ href, label, icon }: { href: string, label: string, icon: any }) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
    >
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      <div className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all">
        {icon}
      </div>
    </Link>
  );
}
