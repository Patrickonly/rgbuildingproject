import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type Payment, type Tenant } from "@/lib/pms-store";
import { toast } from "sonner";
import { Plus, TrendingUp, AlertTriangle, CheckCircle2, Wallet, Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export const Route = createFileRoute("/payments/")({
  head: () => ({ meta: [{ title: "Payments · RG Market PMS" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "bank" | "momo">("bank");
  const [status, setStatus] = useState<"pending" | "paid" | "overdue" | "failed">("paid");
  const [filter, setFilter] = useState("");

  const canCreate = auth.can("payments.create");
  const canEdit = auth.can("payments.edit");
  const canDelete = auth.can("payments.delete");
  const isTenant = auth.isTenant();
  const tenantRecord = auth.getTenantRecord();

  useEffect(() => {
    let allPayments = db.getPayments();
    const allTenants = db.getTenants();

    // Tenant can only see own payments
    if (isTenant && tenantRecord) {
      allPayments = allPayments.filter((p) => p.tenantId === tenantRecord.id);
    }

    setPayments(allPayments);
    setTenants(allTenants);
  }, [isTenant, tenantRecord]);

  const save = (next: Payment[]) => {
    setPayments(isTenant && tenantRecord ? next.filter((p) => p.tenantId === tenantRecord.id) : next);
    db.setPayments(next);
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !month || !amount) return toast.error("Fill all fields");
    const allPayments = db.getPayments();
    const newPayment: Payment = {
      id: nextId(allPayments),
      tenantId: Number(tenantId),
      month,
      amount: Number(amount),
      status,
      paidDate: status === "paid" ? new Date().toISOString().slice(0, 10) : undefined,
      method,
      reference: `PAY-${String(nextId(allPayments)).padStart(3, "0")}`,
    };
    const updated = [...allPayments, newPayment];
    save(updated);
    setAmount("");
    const user = auth.currentUser();
    if (user) {
      db.addActivity(user.id, "payment_record", `Recorded payment of RWF ${Number(amount).toLocaleString()}`);
    }
    toast.success("Payment recorded");
  };

  const toggle = (id: number) => {
    if (!auth.can("payments.edit")) return;
    const allPayments = db.getPayments();
    const payment = allPayments.find(p => p.id === id);
    if (!payment) return;
    
    // Auto-log the approval
    const user = auth.currentUser();
    if (user && payment.status === "pending") {
      db.addActivity(user.id, "payment_approved", `Approved manual payment ${payment.reference || id}`);
    }

    const updated = allPayments.map((p) =>
      p.id === id
        ? { ...p, status: (p.status === "paid" ? "pending" : "paid") as Payment["status"], paidDate: p.status === "pending" ? new Date().toISOString().slice(0, 10) : undefined }
        : p
    );
    save(updated);
    toast.success("Payment status updated!");
  };

  const deletePayment = (id: number) => {
    if (!canDelete) return;
    const allPayments = db.getPayments();
    save(allPayments.filter((p) => p.id !== id));
    toast.success("Payment deleted");
  };

  const filtered = useMemo(() => (filter ? payments.filter((p) => p.month === filter) : payments), [payments, filter]);
  const tenantName = (id: number) => tenants.find((t) => t.id === id)?.name ?? "—";

  // Summary stats
  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalUnpaid = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const paidCount = payments.filter((p) => p.status === "paid").length;
  const unpaidCount = payments.filter((p) => p.status === "pending").length;

  return (
    <DashboardLayout title="Payments">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
          <div><p className="text-xs text-slate-500">Total Paid</p><p className="text-lg font-extrabold text-emerald-600">RWF {totalPaid.toLocaleString()}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-xl"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
          <div><p className="text-xs text-slate-500">Total Unpaid</p><p className="text-lg font-extrabold text-red-600">RWF {totalUnpaid.toLocaleString()}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl"><CheckCircle2 className="h-5 w-5 text-[#2563eb]" /></div>
          <div><p className="text-xs text-slate-500">Paid Count</p><p className="text-lg font-extrabold text-[#2563eb]">{paidCount}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl"><Wallet className="h-5 w-5 text-amber-600" /></div>
          <div><p className="text-xs text-slate-500">Pending</p><p className="text-lg font-extrabold text-amber-600">{unpaidCount}</p></div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0f172a]">Payments</h2>
        {canCreate && (
          <Link
            to="/payments/add"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Record Payment
          </Link>
        )}
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-slate-100">
          <label className="text-sm text-slate-600">Filter by month</label>
          <input type="month" value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#2563eb] focus:outline-none" />
          {filter && <button onClick={() => setFilter("")} className="text-xs text-[#2563eb] font-semibold">Clear</button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-6 py-3 font-semibold">Tenant</th>
                <th className="text-left px-6 py-3 font-semibold">Month</th>
                <th className="text-left px-6 py-3 font-semibold">Amount</th>
                <th className="text-left px-6 py-3 font-semibold">Method</th>
                <th className="text-left px-6 py-3 font-semibold">Ref</th>
                <th className="text-left px-6 py-3 font-semibold">Status</th>
                {(canEdit || canDelete) && <th className="text-right px-6 py-3 font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-t border-slate-100 hover:bg-slate-50 ${i % 2 ? "bg-slate-50/30" : ""}`}>
                  <td className="px-6 py-3 font-medium text-[#0f172a]">{tenantName(p.tenantId)}</td>
                  <td className="px-6 py-3">{p.month}</td>
                  <td className="px-6 py-3 font-semibold">RWF {p.amount.toLocaleString()}</td>
                  <td className="px-6 py-3 capitalize">{p.method ?? "—"}</td>
                  <td className="px-6 py-3 text-xs font-mono text-slate-500">{p.reference ?? "—"}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.status === "paid" ? "bg-emerald-50 text-emerald-700" :
                      p.status === "pending" ? "bg-amber-50 text-amber-700" :
                      "bg-red-50 text-red-600"
                    }`}>{p.status}</span>
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canEdit && p.status === "pending" && auth.isSuperAdmin() && (
                          <button onClick={() => toggle(p.id)} className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-xs font-bold text-emerald-700 transition-colors">
                            Approve
                          </button>
                        )}
                        {canEdit && (
                          <Link to="/payments/edit/$paymentId" params={{ paymentId: String(p.id) }} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700">
                            Edit
                          </Link>
                        )}
                        {canDelete && (
                          <DeleteDialog
                            title="Delete Payment?"
                            description={`Are you sure you want to delete payment ${p.reference || p.id}? This will remove it from the reports.`}
                            onConfirm={() => deletePayment(p.id)}
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
