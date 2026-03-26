"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, Heart, Users, Settings, LogOut, Calendar, Image as ImageIcon } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-68 bg-white border-r border-slate-200 flex flex-col pt-8 sticky top-0 h-screen">
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xl italic shadow-xl shadow-slate-200">G</div>
          <div>
            <span className="font-black text-lg tracking-tight text-slate-900 block leading-none">GEMIONOTA</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink href="/admin" icon={<LayoutDashboard size={18} />} label="Overview" active={pathname === "/admin"} />
          <SidebarLink href="/admin/products" icon={<ShoppingBag size={18} />} label="Products" active={pathname.startsWith("/admin/products")} />
          <SidebarLink href="/admin/campaigns" icon={<Heart size={18} />} label="Campaigns" active={pathname.startsWith("/admin/campaigns")} />
          <SidebarLink href="/admin/activities" icon={<Calendar size={18} />} label="Activities" active={pathname.startsWith("/admin/activities")} />
          <SidebarLink href="/admin/gallery" icon={<ImageIcon size={18} />} label="Gallery" active={pathname.startsWith("/admin/gallery")} />
          <SidebarLink href="/admin/settings" icon={<Settings size={18} />} label="Settings" active={pathname.startsWith("/admin/settings")} />
        </nav>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black hover:bg-slate-50 rounded-2xl transition-all">
            <LogOut size={16} />
            Back to Site
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 px-4 py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-500 rounded-2xl transition-all w-full text-left">
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div>
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Current Section</h1>
            <p className="text-xl font-black text-slate-800 capitalize">
              {pathname === "/admin" ? "Dashboard Overview" : pathname.split("/").pop()?.replace(/-/g, " ")}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center text-slate-400">
               <Users size={20} />
             </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
        active 
          ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
