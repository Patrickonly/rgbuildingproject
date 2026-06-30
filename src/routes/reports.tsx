import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { BarChart3, FileText, Download, TrendingUp, Calendar } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports · RG Market PMS" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const reports = [
    { name: "Monthly Revenue Report", date: "June 2026", status: "Generated", icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { name: "Tenant Occupancy Report", date: "June 2026", status: "Generated", icon: BarChart3, color: "text-blue-600 bg-blue-50" },
    { name: "Maintenance Summary", date: "Q2 2026", status: "Pending", icon: FileText, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0f172a]">Financial & Operational Reports</h2>
            <p className="text-slate-500 mt-1">Generate and download reports for RG Market Building</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all">
            <Calendar className="h-4 w-4" />
            Generate Report
          </button>
        </div>

        <div className="grid gap-4">
          {reports.map((report, index) => {
            const Icon = report.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${report.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f172a]">{report.name}</h3>
                    <p className="text-sm text-slate-500">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.status === "Generated" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>{report.status}</span>
                  <button className="p-2 rounded-xl hover:bg-slate-100 transition-all">
                    <Download className="h-5 w-5 text-slate-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
