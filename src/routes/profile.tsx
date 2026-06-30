import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { User, Mail, Phone, Building2, Edit2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · RG Market PMS" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Admin",
    email: "admin@rgmarket.rw",
    phone: "0788123456",
    role: "Building Manager"
  });

  const handleSave = () => {
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-[#2563eb] p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-24 w-24 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <User className="h-12 w-12 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{formData.name}</h2>
                <p className="text-blue-100">{formData.role}</p>
                <p className="text-blue-200 text-sm mt-1">RG Market Building</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#0f172a]">Account Information</h3>
              <button
                onClick={editing ? handleSave : () => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all"
              >
                {editing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                {editing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Full Name</label>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <User className="h-5 w-5 text-slate-400" />
                    {editing ? (
                      <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="flex-1 bg-transparent border-none outline-none text-[#0f172a]"
                      />
                    ) : (
                      <span className="text-[#0f172a] font-medium">{formData.name}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Email</label>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <Mail className="h-5 w-5 text-slate-400" />
                    {editing ? (
                      <input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="flex-1 bg-transparent border-none outline-none text-[#0f172a]"
                        type="email"
                      />
                    ) : (
                      <span className="text-[#0f172a] font-medium">{formData.email}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Phone Number</label>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <Phone className="h-5 w-5 text-slate-400" />
                    {editing ? (
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="flex-1 bg-transparent border-none outline-none text-[#0f172a]"
                      />
                    ) : (
                      <span className="text-[#0f172a] font-medium">{formData.phone}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Property</label>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <Building2 className="h-5 w-5 text-slate-400" />
                    <span className="text-[#0f172a] font-medium">RG Market Building</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
