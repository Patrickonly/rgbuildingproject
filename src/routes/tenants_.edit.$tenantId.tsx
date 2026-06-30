import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type Tenant } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/tenants_/edit/$tenantId")({
  head: () => ({ meta: [{ title: "Edit Tenant - RG Market PMS" }] }),
  component: EditTenantPage,
});

function EditTenantPage() {
  const navigate = useNavigate();
  const { tenantId } = useParams({ from: "/tenants_/edit/$tenantId" });

  if (!auth.can("tenants.edit")) {
    return (
      <DashboardLayout title="Edit Tenant">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg">You don't have permission to edit tenants.</p>
        </div>
      </DashboardLayout>
    );
  }

  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [room, setRoom] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [rdbNumber, setRdbNumber] = useState("");
  const [businessType, setBusinessType] = useState("Retail / Shop");
  const [status, setStatus] = useState<"active" | "suspended">("active");
  const [isLoading, setIsLoading] = useState(false);

  const availableRooms = db.getRooms().filter((r) => r.status === "available");
  const [originalRoom, setOriginalRoom] = useState("");

  useEffect(() => {
    const tenant = db.getTenants().find((t) => t.id === Number(tenantId));
    if (tenant) {
      setName(tenant.name);
      setBusiness(tenant.business);
      setRoom(tenant.room);
      setPhone(tenant.phone);
      setEmail(tenant.email);
      setLeaseStart(tenant.leaseStart);
      setLeaseEnd(tenant.leaseEnd);
      setOriginalRoom(tenant.room);
      setTinNumber(tenant.tinNumber || "");
      setNationalId(tenant.nationalId || "");
      setRdbNumber(tenant.rdbNumber || "");
      setBusinessType(tenant.businessType || "Retail / Shop");
      setStatus(tenant.status || "active");
    } else {
      toast.error("Tenant not found");
      navigate({ to: "/tenants" });
    }
  }, [tenantId, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !business || !room || !leaseStart || !leaseEnd) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const tenants = db.getTenants();
    const updatedTenants = tenants.map((t) => {
      if (t.id === Number(tenantId)) {
        return {
          ...t,
          name,
          business,
          room,
          phone,
          email,
          leaseStart,
          leaseEnd,
          tinNumber,
          nationalId,
          rdbNumber,
          businessType,
          status,
        };
      }
      return t;
    });

    db.setTenants(updatedTenants);

    if (room !== originalRoom) {
      // Mark old room as available, new room as occupied
      const rooms = db.getRooms();
      const updatedRooms = rooms.map((r) => {
        if (r.number === originalRoom) return { ...r, status: "available" as const };
        if (r.number === room) return { ...r, status: "occupied" as const };
        return r;
      });
      db.setRooms(updatedRooms);
    }

    const user = auth.currentUser();
    if (user) {
      db.addActivity(user.id, "tenant_edit", `Edited tenant ${name}`);
    }

    setTimeout(() => {
      toast.success("Tenant updated successfully!");
      navigate({ to: "/tenants" });
    }, 800);
  };

  return (
    <DashboardLayout title="Edit Tenant">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate({ to: "/tenants" })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563eb] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tenants
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-[#0f172a]">Tenant Information</h2>
            <p className="text-sm text-slate-500 mt-1">Update the details for this tenant</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-sm font-semibold text-slate-700">Business Name *</label>
                <input
                  type="text"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Assign Room *</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
              >
                <option value={originalRoom}>{originalRoom} (Current)</option>
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.number}>
                    {r.number} - {r.floor}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">National ID / Passport</label>
                <input type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Business Type</label>
                <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 bg-white">
                  <option>Retail / Shop</option>
                  <option>Office / Corporate</option>
                  <option>Restaurant / Cafe</option>
                  <option>Warehouse / Storage</option>
                  <option>Clinic / Pharmacy</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">RDB Reg. Number</label>
                <input type="text" value={rdbNumber} onChange={(e) => setRdbNumber(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">TIN Number</label>
                <input type="text" value={tinNumber} onChange={(e) => setTinNumber(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Lease Start *</label>
                <input
                  type="date"
                  value={leaseStart}
                  onChange={(e) => setLeaseStart(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Lease End *</label>
                <input
                  type="date"
                  value={leaseEnd}
                  onChange={(e) => setLeaseEnd(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status === "active"}
                    onChange={() => setStatus("active")}
                    className="w-4 h-4 text-[#2563eb] border-slate-300 focus:ring-[#2563eb]"
                  />
                  <span className="text-sm text-slate-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="suspended"
                    checked={status === "suspended"}
                    onChange={() => setStatus("suspended")}
                    className="w-4 h-4 text-[#2563eb] border-slate-300 focus:ring-[#2563eb]"
                  />
                  <span className="text-sm text-slate-700">Suspended</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {isLoading ? "Updating..." : "Update Tenant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
