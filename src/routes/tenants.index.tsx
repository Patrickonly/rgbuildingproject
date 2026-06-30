import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type Tenant } from "@/lib/pms-store";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, User, Phone, Home, Mail, Briefcase, Calendar, FileText, FileSpreadsheet, FileDown, Download } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export const Route = createFileRoute("/tenants/")({
  head: () => ({ meta: [{ title: "Tenants - RG Market PMS" }] }),
  component: TenantsPage,
});

function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const canCreate = auth.can("tenants.create");
  const canDelete = auth.can("tenants.delete");
  const isTenant = auth.isTenant();
  const tenantRecord = auth.getTenantRecord();

  useEffect(() => {
    let allTenants = db.getTenants();
    // Tenant role can only see their own record
    if (isTenant && tenantRecord) {
      allTenants = allTenants.filter((t) => t.id === tenantRecord.id);
    }
    setTenants(allTenants);
  }, [isTenant, tenantRecord]);

  const deleteTenant = (id: number, roomNumber: string) => {
    if (!canDelete) return;
    const updatedTenants = tenants.filter((t) => t.id !== id);
    setTenants(updatedTenants);
    db.setTenants(updatedTenants);

    // Mark room as available
    const rooms = db.getRooms();
    const updatedRooms = rooms.map((r) =>
      r.number === roomNumber ? { ...r, status: "available" as const } : r
    );
    db.setRooms(updatedRooms);

    toast.success("Tenant deleted successfully!");
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "Business", "Room", "Phone", "Email", "Status", "Lease Start", "Lease End"];
    const csvContent = [
      headers.join(","),
      ...tenants.map(t => [
        t.id,
        `"${t.name}"`,
        `"${t.business}"`,
        `"${t.room}"`,
        `"${t.phone}"`,
        `"${t.email}"`,
        `"${t.status || 'active'}"`,
        `"${t.leaseStart}"`,
        `"${t.leaseEnd}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "tenants_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully!");
  };

  const exportExcel = () => {
    // Basic Excel export using XLS format (tab separated)
    const headers = ["ID", "Name", "Business", "Room", "Phone", "Email", "Status", "Lease Start", "Lease End"];
    const xlsContent = [
      headers.join("\t"),
      ...tenants.map(t => [
        t.id,
        t.name,
        t.business,
        t.room,
        t.phone,
        t.email,
        t.status || 'active',
        t.leaseStart,
        t.leaseEnd
      ].join("\t"))
    ].join("\n");

    const blob = new Blob([xlsContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "tenants_export.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel Exported successfully!");
  };

  const exportPDF = () => {
    // For a real app you'd use jsPDF, but window.print is a quick native alternative
    toast.info("Preparing PDF... Please use the browser print dialog to save as PDF.");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <DashboardLayout title="Tenants">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-slate-500 text-sm">
              {isTenant ? "Your profile in RG Market Building" : "Manage all tenants in RG Market Building"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-2xl p-1 border border-slate-200 shadow-sm">
              <button onClick={exportPDF} title="Export as PDF" className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-colors">
                <FileText className="w-4 h-4" />
              </button>
              <button onClick={exportCSV} title="Export as CSV" className="p-2 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl transition-colors">
                <FileDown className="w-4 h-4" />
              </button>
              <button onClick={exportExcel} title="Export as Excel" className="p-2 hover:bg-green-50 text-slate-500 hover:text-green-600 rounded-xl transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
              </button>
            </div>
            {canCreate && (
              <Link
                to="/tenants/add"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200"
              >
                <Plus className="h-4 w-4" />
                Add New Tenant
              </Link>
            )}
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Tenant & Business</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Room & Lease</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center font-bold">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#0f172a] text-base">{tenant.name}</div>
                          <div className="text-xs text-slate-500 font-medium">{tenant.business}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {tenant.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {tenant.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-[#2563eb]">Room {tenant.room}</div>
                        <div className="text-xs text-slate-400">
                          {tenant.leaseStart} to {tenant.leaseEnd || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        (!tenant.status || tenant.status === "active") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      }`}>
                        {tenant.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {auth.can("tenants.edit") && (
                          <Link
                            to="/tenants/edit/$tenantId"
                            params={{ tenantId: tenant.id.toString() }}
                            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                            title="Edit Tenant"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        )}
                        {canDelete && (
                          <DeleteDialog
                            title="Delete Tenant?"
                            description={`Are you sure you want to remove ${tenant.name}? This will free up Room ${tenant.room}.`}
                            onConfirm={() => deleteTenant(tenant.id, tenant.room)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {tenants.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <User className="h-12 w-12 text-slate-300" />
              <p className="text-slate-500">No tenants found</p>
              {canCreate && (
                <Link to="/tenants/add" className="text-[#2563eb] text-sm font-semibold hover:underline">
                  Add your first tenant
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
