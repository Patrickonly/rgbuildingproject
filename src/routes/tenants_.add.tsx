import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type Tenant } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/tenants_/add")({
  head: () => ({ meta: [{ title: "Add Tenant - RG Market PMS" }] }),
  component: AddTenantPage,
});

function AddTenantPage() {
  const navigate = useNavigate();

  if (!auth.can("tenants.create")) {
    return (
      <DashboardLayout title="Add New Tenant">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg">You don't have permission to add tenants.</p>
        </div>
      </DashboardLayout>
    );
  }

  const rooms = db.getRooms().filter((r) => r.status === "available");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [business, setBusiness] = useState("");
  const [leaseStart, setLeaseStart] = useState(new Date().toISOString().slice(0, 10));
  const [leaseEnd, setLeaseEnd] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [rdbNumber, setRdbNumber] = useState("");
  const [businessType, setBusinessType] = useState("Retail / Shop");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !room) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const newTenant: Tenant = {
      id: nextId(db.getTenants()),
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s/g, "")}@email.com`,
      room,
      business: business || "N/A",
      leaseStart,
      leaseEnd: leaseEnd || new Date(new Date(leaseStart).setFullYear(new Date(leaseStart).getFullYear() + 1)).toISOString().slice(0, 10),
      tinNumber,
      nationalId,
      rdbNumber,
      businessType,
    };

    db.setTenants([...db.getTenants(), newTenant]);

    // Mark room as occupied
    const allRooms = db.getRooms();
    db.setRooms(allRooms.map((r) => (r.number === room ? { ...r, status: "occupied" as const } : r)));

    const user = auth.currentUser();
    if (user) {
      db.addActivity(user.id, "tenant_add", `Added tenant ${name} to room ${room}`);
    }

    setTimeout(() => {
      toast.success("Tenant added successfully!");
      navigate({ to: "/tenants" });
    }, 800);
  };

  return (
    <DashboardLayout title="Add New Tenant">
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
            <p className="text-sm text-slate-500 mt-1">Enter the details for the new tenant</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0788123456" className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@email.com" className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Business Name</label>
                <input type="text" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Business name" className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">National ID / Passport</label>
                <input type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} placeholder="ID number" className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 transition-all" />
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
                <input type="text" value={rdbNumber} onChange={(e) => setRdbNumber(e.target.value)} placeholder="Company code" className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">TIN Number</label>
                <input type="text" value={tinNumber} onChange={(e) => setTinNumber(e.target.value)} placeholder="9-digit Tax ID" className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Assign Room *</label>
              <select value={room} onChange={(e) => setRoom(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all">
                <option value="">Select available room</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.number}>{r.number} — {r.floor} — RWF {r.rent.toLocaleString()}</option>
                ))}
              </select>
              {rooms.length === 0 && <p className="text-xs text-amber-600">No available rooms. Add a room first.</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Lease Start</label>
                <input type="date" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Lease End</label>
                <input type="date" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {isLoading ? "Saving..." : "Save Tenant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
