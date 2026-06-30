import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { Settings, Building2, Bell, User, Shield, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · RG Market PMS" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [buildingName, setBuildingName] = useState("RG Market Building");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "property", label: "Property", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <DashboardLayout title="Settings">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                  activeTab === tab.id
                    ? "text-[#2563eb] border-b-2 border-[#2563eb] bg-blue-50"
                    : "text-slate-600 hover:text-[#0f172a] hover:bg-slate-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-8">
          {activeTab === "general" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Building Name</label>
                    <input
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Currency</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100">
                      <option>RWF (Rwandan Franc)</option>
                      <option>USD (US Dollar)</option>
                    </select>
                  </div>
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
          )}

          {activeTab !== "general" && (
            <div className="text-center py-12">
              <p className="text-slate-500">Settings for {tabs.find(t => t.id === activeTab)?.label} coming soon</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
