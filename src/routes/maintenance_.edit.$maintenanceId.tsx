import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/maintenance_/edit/$maintenanceId")({
  head: () => ({ meta: [{ title: "Edit Issue - RG Market PMS" }] }),
  component: EditMaintenancePage,
});

function EditMaintenancePage() {
  const navigate = useNavigate();
  const { maintenanceId } = useParams({ from: "/maintenance_/edit/$maintenanceId" });

  if (!auth.can("maintenance.update")) {
    return (
      <DashboardLayout title="Edit Issue">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg">You don't have permission to edit issues.</p>
        </div>
      </DashboardLayout>
    );
  }

  const [room, setRoom] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [status, setStatus] = useState<"open" | "in-progress" | "resolved">("open");
  const [assignedTo, setAssignedTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const item = db.getMaintenance().find((m) => m.id === Number(maintenanceId));
    if (item) {
      setRoom(item.room);
      setIssue(item.issue);
      setPriority(item.priority);
      setStatus(item.status);
      setAssignedTo(item.assignedTo || "");
    } else {
      toast.error("Issue not found");
      navigate({ to: "/maintenance" });
    }
  }, [maintenanceId, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !issue) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const items = db.getMaintenance();
    const updatedItems = items.map((m) => {
      if (m.id === Number(maintenanceId)) {
        return {
          ...m,
          room,
          issue,
          priority,
          status,
          assignedTo: assignedTo || undefined,
          resolvedAt: status === "resolved" && m.status !== "resolved" ? new Date().toISOString().slice(0, 10) : m.resolvedAt,
        };
      }
      return m;
    });

    db.setMaintenance(updatedItems);

    const user = auth.currentUser();
    if (user) {
      db.addActivity(user.id, "maintenance_edit", `Updated issue in room ${room}`);
    }

    setTimeout(() => {
      toast.success("Issue updated successfully!");
      navigate({ to: "/maintenance" });
    }, 800);
  };

  return (
    <DashboardLayout title="Edit Maintenance Issue">
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
            <p className="text-sm text-slate-500 mt-1">Update the reported problem</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Room / Location *</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Assigned To</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. Electrician"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Issue Description *</label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 bg-white"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {isLoading ? "Saving..." : "Update Issue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
