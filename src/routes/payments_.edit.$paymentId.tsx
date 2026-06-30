import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type Tenant } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/payments_/edit/$paymentId")({
  head: () => ({ meta: [{ title: "Edit Payment - RG Market PMS" }] }),
  component: EditPaymentPage,
});

function EditPaymentPage() {
  const navigate = useNavigate();
  const { paymentId } = useParams({ from: "/payments_/edit/$paymentId" });

  if (!auth.can("payments.edit")) {
    return (
      <DashboardLayout title="Edit Payment">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg">You don't have permission to edit payments.</p>
        </div>
      </DashboardLayout>
    );
  }

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "bank" | "momo">("bank");
  const [status, setStatus] = useState<"pending" | "paid" | "overdue" | "failed">("paid");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const allTenants = db.getTenants();
    setTenants(allTenants);

    const payment = db.getPayments().find((p) => p.id === Number(paymentId));
    if (payment) {
      setTenantId(String(payment.tenantId));
      setMonth(payment.month);
      setAmount(String(payment.amount));
      setMethod(payment.method || "bank");
      setStatus(payment.status);
    } else {
      toast.error("Payment not found");
      navigate({ to: "/payments" });
    }
  }, [paymentId, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !month || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const allPayments = db.getPayments();
    const updatedPayments = allPayments.map((p) => {
      if (p.id === Number(paymentId)) {
        return {
          ...p,
          tenantId: Number(tenantId),
          month,
          amount: Number(amount),
          status,
          method,
          paidDate: status === "paid" && p.status !== "paid" ? new Date().toISOString().slice(0, 10) : p.paidDate,
        };
      }
      return p;
    });

    db.setPayments(updatedPayments);

    const user = auth.currentUser();
    if (user) {
      db.addActivity(user.id, "payment_edit", `Edited payment ${paymentId}`);
    }

    setTimeout(() => {
      toast.success("Payment updated successfully!");
      navigate({ to: "/payments" });
    }, 800);
  };

  return (
    <DashboardLayout title="Edit Payment">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate({ to: "/payments" })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563eb] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-[#0f172a]">Payment Details</h2>
            <p className="text-sm text-slate-500 mt-1">Update the transaction details</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Tenant *</label>
              <select
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 bg-white"
              >
                <option value="">Choose a tenant...</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.business} ({t.room})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Month *</label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Amount (RWF) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 150000"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Payment Method *</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 bg-white"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="momo">Mobile Money (MoMo)</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 bg-white"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="failed">Failed</option>
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
                {isLoading ? "Saving..." : "Update Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
