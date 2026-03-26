import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // If Admin lands here, redirect to Admin Panel
  if ((session.user as any).role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto text-brand-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <div>
          <h1 className="text-3xl font-black italic mb-2">HALO, {session.user?.name?.toUpperCase()}</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-ink/40">Selamat datang di Portal Alumni Gemiconota</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-ink/5 shadow-sm text-left">
          <p className="text-sm text-ink/60 leading-relaxed mb-6">
            Dashboard ini sedang dalam tahap pengembangan (Fase 2). Segera hadir fitur edit profil, peta interaktif, dan riwayat pesanan merch Anda.
          </p>
          <div className="space-y-3">
             <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse" />
             <div className="h-2 w-2/3 bg-slate-100 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/" className="inline-block px-8 py-4 bg-ink text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-blue transition-all">
            KEMBALI KE BERANDA
          </a>
          <LogoutButton className="inline-flex items-center gap-2 px-8 py-4 bg-red-50 text-red-500 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100" />
        </div>
      </div>
    </div>
  );
}
