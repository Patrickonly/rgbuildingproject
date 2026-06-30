import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type Maintenance } from "@/lib/pms-store";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/maintenance/")({
  head: () => ({ meta: [{ title: "Maintenance · RG Market PMS" }] }),
  component: MaintenancePage,
});

const statuses: Maintenance["status"][] = ["open", "in-progress", "resolved"];

function MaintenancePage() {
  const [items, setItems] = useState<Maintenance[]>([]);
  const [room, setRoom] = useState("");
  const [issue, setIssue] = useState("");

  useEffect(() => setItems(db.getMaintenance()), []);

  const save = (next: Maintenance[]) => { setItems(next); db.setMaintenance(next); };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !issue) return toast.error("Fill all fields");
    save([...items, { id: nextId(items), room, issue, status: "open", priority: "low", createdAt: new Date().toISOString().slice(0, 10) }]);
    setRoom(""); setIssue("");
    toast.success("Issue reported");
  };

  const cycle = (id: number) => {
    save(items.map((m) => {
      if (m.id !== id) return m;
      const next = statuses[(statuses.indexOf(m.status) + 1) % statuses.length];
      return { ...m, status: next };
    }));
    toast.success("Status updated");
  };

  const color = (s: Maintenance["status"]) =>
    s === "open" ? "bg-red-50 text-red-600" : s === "in-progress" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700";

  return (
    <DashboardLayout title="Maintenance">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0f172a]">Maintenance Issues</h2>
        {auth.can("maintenance.create") && (
          <Link
            to="/maintenance/add"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Report Issue
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-6 py-3">Room</th>
              <th className="text-left px-6 py-3">Issue</th>
              <th className="text-left px-6 py-3">Reported</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m, i) => (
              <tr key={m.id} className={`border-t border-slate-100 hover:bg-slate-50 ${i % 2 ? "bg-slate-50/30" : ""}`}>
                <td className="px-6 py-3 font-medium text-[#0f172a]">{m.room}</td>
                <td className="px-6 py-3">{m.issue}</td>
                <td className="px-6 py-3">{m.createdAt}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color(m.status)}`}>{m.status}</span>
                </td>
                <td className="px-6 py-3 text-right">
                  {auth.can("maintenance.update") && (
                    <Link to="/maintenance/edit/$maintenanceId" params={{ maintenanceId: String(m.id) }} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 inline-block">
                      Edit
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No issues reported.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
