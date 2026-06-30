import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, Save, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/security")({
  head: () => ({ meta: [{ title: "Security · RG Market PMS" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    toast.success("Security settings updated!");
  };

  return (
    <DashboardLayout title="Security">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Security Settings</h2>
              <p className="text-slate-500">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Current Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200 my-6"></div>

            <div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                  <div>
                    <h4 className="font-semibold text-[#0f172a]">Enable 2FA</h4>
                    <p className="text-sm text-slate-500">Add extra security to your account</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold">Coming Soon</button>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
