import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { db, type Invoice } from "@/lib/pms-store";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/invoices/")({
  head: () => ({ meta: [{ title: "Invoices - RG Market PMS" }] }),
  component: InvoicesPage,
});

function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const tenants = db.getTenants();

  useEffect(() => {
    setInvoices(db.getInvoices());
  }, []);

  const tenantName = (id: number) => tenants.find((t) => t.id === id)?.name ?? "Unknown";

  return (
    <DashboardLayout title="Invoices">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-[#0f172a]">All Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Invoice ID</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Tenant</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Month</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Amount (RWF)</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Due Date</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">INV-{String(inv.id).padStart(4, "0")}</td>
                  <td className="px-6 py-4 font-bold text-[#0f172a]">{tenantName(inv.tenantId)}</td>
                  <td className="px-6 py-4 text-slate-600">{inv.month}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600">{inv.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      inv.status === "paid" ? "bg-emerald-50 text-emerald-700" :
                      inv.status === "overdue" ? "bg-red-50 text-red-700" :
                      "bg-amber-50 text-amber-700"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => toast.success("Invoice downloaded")} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 inline-block transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="h-8 w-8 mx-auto mb-3 text-slate-300" />
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
