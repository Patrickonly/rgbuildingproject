import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type Maintenance } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/maintenance_/add")({
  head: () => ({ meta: [{ title: "Report Issue - RG Market PMS" }] }),
  component: AddMaintenancePage,
});

function AddMaintenancePage() {
  const navigate = useNavigate();

  if (!auth.can("maintenance.create")) {
    return (
      <DashboardLayout title="Report Issue">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg">You don't have permission to report issues.</p>
        </div>
      </DashboardLayout>
    );
  }

  const [room, setRoom] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !issue) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const items = db.getMaintenance();
    const newItem: Maintenance = {
      id: nextId(items),
      room,
      issue,
      priority,
      status: "open",
      createdAt: new Date().toISOString().slice(0, 10),
      submittedBy: auth.currentUser()?.id,
    };
    
    db.setMaintenance([...items, newItem]);

    const user = auth.currentUser();
    if (user) {
      db.addActivity(user.id, "maintenance_report", `Reported issue in room ${room}`);
    }

    setTimeout(() => {
      toast.success("Issue reported successfully!");
      navigate({ to: "/maintenance" });
    }, 800);
  };

  return (
    <DashboardLayout title="Report Maintenance Issue">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate({ to: "/maintenance" })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563eb] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Maintenance
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-[#0f172a]">Issue Details</h2>
            <p className="text-sm text-slate-500 mt-1">Describe the problem to be fixed</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Room / Location *</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. G-01"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Issue Description *</label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Please describe the issue in detail..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 bg-white"
              >
                <option value="low">Low - Routine maintenance</option>
                <option value="medium">Medium - Should be fixed soon</option>
                <option value="high">High - Needs immediate attention</option>
                <option value="urgent">Urgent - Emergency, safety hazard</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {isLoading ? "Submitting..." : "Submit Issue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
