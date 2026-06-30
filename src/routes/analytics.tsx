import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { PieChart, BarChart3, TrendingUp, Users, Wallet, DoorOpen, Activity } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · RG Market PMS" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const stats = [
    { label: "Occupancy Rate", value: "85%", change: "+5%", icon: DoorOpen, color: "text-blue-600 bg-blue-50" },
    { label: "Revenue Growth", value: "12%", change: "+3%", icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Tenant Satisfaction", value: "4.8/5", change: "+0.2", icon: Users, color: "text-purple-600 bg-purple-50" },
    { label: "Payment Collection", value: "92%", change: "+1%", icon: Wallet, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Building Performance Analytics</h2>
          <p className="text-slate-500 mt-1">Real-time insights for RG Market Building</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0f172a]">{stat.value}</h3>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-[#0f172a]">Revenue Trends</h3>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
              <p className="text-slate-500">Revenue Chart</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-[#0f172a]">Occupancy Breakdown</h3>
              <PieChart className="h-5 w-5 text-slate-400" />
            </div>
            <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
              <p className="text-slate-500">Occupancy Chart</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
