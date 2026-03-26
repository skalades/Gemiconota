import prisma from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany();
  const settingsMap = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);

  return (
    <div className="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Landing Page Settings</h2>
        <p className="text-slate-500 font-medium">Update the content shown on the public landing page here.</p>
      </div>

      <SettingsForm settingsMap={settingsMap} />
    </div>
  );
}
