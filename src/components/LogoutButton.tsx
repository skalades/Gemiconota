"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })} 
      className={className || "inline-flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all"}
    >
      <LogOut size={16} />
      Keluar
    </button>
  );
}
