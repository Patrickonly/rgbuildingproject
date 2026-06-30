import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, formatRole } from "@/lib/pms-store";
import {
  DoorOpen,
  Users,
  Wallet,
  AlertTriangle,
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Wrench,
  Home,
  Receipt,
  Crown,
  Phone,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard - RG Market PMS" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const user = auth.currentUser();
  if (!user) return null;

  switch (user.role) {
    case "super_admin":
      return <SuperAdminDashboard />;
    case "tenant":
      return <TenantDashboard />;
    case "accountant":
      return <AccountantDashboard />;
  }
}

// ═══════════════════════════════════════════════════════════════════
// SUPER ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function SuperAdminDashboard() {
  const user = auth.currentUser()!;
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalTenants: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    openMaintenance: 0,
  });
  const [recentTenants, setRecentTenants] = useState<any[]>([]);

  useEffect(() => {
    const rooms = db.getRooms();
    const tenants = db.getTenants();
    const payments = db.getPayments();
    const maintenance = db.getMaintenance();

    const totalRevenue = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingCount = payments.filter((p) => p.status === "pending").length;
    const openCount = maintenance.filter((m) => m.status !== "resolved").length;
    const occupiedCount = rooms.filter((r) => r.status === "occupied").length;

    setStats({
      totalRooms: rooms.length,
      occupiedRooms: occupiedCount,
      availableRooms: rooms.length - occupiedCount,
      totalTenants: tenants.length,
      monthlyRevenue: totalRevenue,
      pendingPayments: pendingCount,
      openMaintenance: openCount,
    });
    setRecentTenants(tenants.slice(-4).reverse());
  }, []);

  const statCards = [
    { label: "Total Rooms", value: stats.totalRooms, icon: DoorOpen, color: "text-[#2563eb]", bg: "bg-blue-50", trend: `${stats.availableRooms} available`, trendUp: true },
    { label: "Occupied", value: stats.occupiedRooms, icon: Home, color: "text-emerald-600", bg: "bg-emerald-50", trend: `${Math.round((stats.occupiedRooms / Math.max(stats.totalRooms, 1)) * 100)}% occupancy`, trendUp: true },
    { label: "Active Tenants", value: stats.totalTenants, icon: Users, color: "text-violet-600", bg: "bg-violet-50", trend: "All active", trendUp: true },
    { label: "Monthly Revenue", value: `RWF ${stats.monthlyRevenue.toLocaleString()}`, icon: Wallet, color: "text-amber-600", bg: "bg-amber-50", trend: "This month", trendUp: true },
  ];

  const quickActions = [
    { title: "Add Room", icon: DoorOpen, color: "text-[#2563eb]", bg: "bg-blue-50", link: "/rooms/add" },
    { title: "Add Tenant", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", link: "/tenants/add" },
    { title: "Record Payment", icon: Wallet, color: "text-amber-600", bg: "bg-amber-50", link: "/payments" },
    { title: "Report Issue", icon: Wrench, color: "text-violet-600", bg: "bg-violet-50", link: "/maintenance" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-[#2563eb] rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Welcome back, {user.name}!
                </h2>
                <p className="text-violet-200 mt-1 text-sm lg:text-base">
                  You have full control over RG Market Building
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-blue-200">Today</p>
                <p className="font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563eb]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-[#0f172a]">{card.value}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Tenants */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">Recent Tenants</h3>
                <p className="text-sm text-slate-500 mt-1">Latest tenants in the system</p>
              </div>
              <Link to="/tenants" className="flex items-center gap-2 text-sm font-semibold text-[#2563eb] hover:text-[#1e50c9] transition-colors">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-6">
              {recentTenants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold rounded-tl-xl rounded-bl-xl">Tenant Name</th>
                        <th className="text-left px-4 py-3 font-semibold">Room</th>
                        <th className="text-left px-4 py-3 font-semibold">Business</th>
                        <th className="text-right px-4 py-3 font-semibold rounded-tr-xl rounded-br-xl">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTenants.map((tenant, idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-xl bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb] font-bold text-xs">
                                {tenant.name.charAt(0)}
                              </div>
                              <span className="font-bold text-[#0f172a]">{tenant.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{tenant.room}</td>
                          <td className="px-4 py-3 text-slate-600">{tenant.business}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-600">{tenant.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">No recent tenants</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#0f172a] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link key={idx} to={action.link} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all text-center">
                      <div className={`${action.bg} p-3 rounded-xl mb-3`}>
                        <Icon className={`${action.color} h-5 w-5`} />
                      </div>
                      <p className="text-xs font-bold text-[#0f172a]">{action.title}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#0f172a]">Alerts</h3>
                {stats.pendingPayments + stats.openMaintenance > 0 && (
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#2563eb] text-white text-xs font-bold">
                    {stats.pendingPayments + stats.openMaintenance}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {stats.pendingPayments > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#0f172a]">Pending Payments</p>
                      <p className="text-[11px] text-amber-700">{stats.pendingPayments} payments to follow up</p>
                    </div>
                  </div>
                )}
                {stats.openMaintenance > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-violet-50 border border-violet-200">
                    <Wrench className="h-5 w-5 text-violet-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#0f172a]">Open Maintenance</p>
                      <p className="text-[11px] text-violet-700">{stats.openMaintenance} issues to resolve</p>
                    </div>
                  </div>
                )}
                {stats.pendingPayments === 0 && stats.openMaintenance === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500">All clear! No pending items</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TENANT DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function TenantDashboard() {
  const user = auth.currentUser()!;
  const tenantRecord = auth.getTenantRecord();
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [myPayments, setMyPayments] = useState<any[]>([]);
  const [myMaintenance, setMyMaintenance] = useState<any[]>([]);

  useEffect(() => {
    if (tenantRecord) {
      const rooms = db.getRooms();
      const room = rooms.find((r) => r.number === tenantRecord.room);
      setRoomInfo(room);

      const payments = db.getPayments();
      setMyPayments(payments.filter((p) => p.tenantId === tenantRecord.id).reverse());

      const maintenance = db.getMaintenance();
      setMyMaintenance(maintenance.filter((m) => m.room === tenantRecord.room).reverse());
    }
  }, [tenantRecord]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-[#2563eb] rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Welcome, {user.name}!
                </h2>
                <p className="text-blue-200 mt-1">Your tenant portal for RG Market</p>
              </div>
            </div>
            <div className="px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20">
              <p className="text-xs text-blue-200">Today</p>
              <p className="font-bold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="bg-emerald-50 p-3 rounded-2xl w-fit mb-4">
              <Home className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 font-medium mb-1">Your Room</p>
            <h3 className="text-2xl font-extrabold text-[#0f172a]">{tenantRecord?.room ?? "—"}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="bg-blue-50 p-3 rounded-2xl w-fit mb-4">
              <Wallet className="h-6 w-6 text-[#2563eb]" />
            </div>
            <p className="text-xs text-slate-500 font-medium mb-1">Monthly Rent</p>
            <h3 className="text-2xl font-extrabold text-[#0f172a]">RWF {roomInfo?.rent?.toLocaleString() ?? "—"}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="bg-amber-50 p-3 rounded-2xl w-fit mb-4">
              <Receipt className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-xs text-slate-500 font-medium mb-1">Payments Made</p>
            <h3 className="text-2xl font-extrabold text-[#0f172a]">{myPayments.filter((p) => p.status === "paid").length}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="bg-violet-50 p-3 rounded-2xl w-fit mb-4">
              <Wrench className="h-6 w-6 text-violet-600" />
            </div>
            <p className="text-xs text-slate-500 font-medium mb-1">Open Requests</p>
            <h3 className="text-2xl font-extrabold text-[#0f172a]">{myMaintenance.filter((m) => m.status !== "resolved").length}</h3>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Room Details */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0f172a]">Your Room Details</h3>
            </div>
            <div className="p-6 space-y-4">
              {roomInfo ? (
                <>
                  {[
                    { label: "Room Number", value: roomInfo.number },
                    { label: "Floor", value: roomInfo.floor },
                    { label: "Size", value: `${roomInfo.size} sqm` },
                    { label: "Subscription Amount", value: `RWF ${roomInfo.rent?.toLocaleString() ?? "0"}` },
                    { label: "Deposit", value: `RWF ${roomInfo.deposit?.toLocaleString() ?? "0"}` },
                    { label: "Business", value: tenantRecord?.business ?? "—" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-500">{item.label}</span>
                      <span className="text-sm font-semibold text-[#0f172a]">{item.value}</span>
                    </div>
                  ))}
                  {tenantRecord && (
                    <div className="mt-4 flex flex-col gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-semibold text-[#0f172a]">Lease Subscription Period</p>
                          <p className="text-xs text-emerald-700">{tenantRecord.leaseStart} to {tenantRecord.leaseEnd}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-2">
                        <Link to="/payments/add" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl text-center transition-colors shadow-sm">
                          Pay Subscription
                        </Link>
                        <button onClick={() => alert("Please contact admin to renew lease")} className="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl text-center transition-colors shadow-sm">
                          Renew Lease
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No room assigned</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0f172a]">Your Payments</h3>
              <Link to="/payments" className="text-sm font-semibold text-[#2563eb] flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-6 space-y-3">
              {myPayments.length > 0 ? (
                myPayments.slice(0, 5).map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{p.month}</p>
                      <p className="text-xs text-slate-500">RWF {p.amount.toLocaleString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.status === "paid" ? "bg-emerald-50 text-emerald-700" :
                      p.status === "partial" ? "bg-amber-50 text-amber-700" :
                      "bg-red-50 text-red-600"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No payments found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ACCOUNTANT DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function AccountantDashboard() {
  const user = auth.currentUser()!;
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidCount: 0,
    unpaidCount: 0,
    partialCount: 0,
    totalTenants: 0,
    overdueInvoices: 0,
  });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    const payments = db.getPayments();
    const tenants = db.getTenants();
    const invoices = db.getInvoices();

    const totalRev = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
    const paidC = payments.filter((p) => p.status === "paid").length;
    const unpaidC = payments.filter((p) => p.status === "pending").length;
    const partialC = payments.filter((p) => p.status === "overdue").length;
    const overdueC = invoices.filter((i) => i.status === "overdue").length;

    setStats({
      totalRevenue: totalRev,
      paidCount: paidC,
      unpaidCount: unpaidC,
      partialCount: partialC,
      totalTenants: tenants.length,
      overdueInvoices: overdueC,
    });
    setRecentPayments(payments.slice(-6).reverse());
  }, []);

  const tenants = db.getTenants();
  const tenantName = (id: number) => tenants.find((t) => t.id === id)?.name ?? "—";

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-[#2563eb] rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Receipt className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Welcome, {user.name}!
                </h2>
                <p className="text-blue-200 mt-1">Financial overview for RG Market</p>
              </div>
            </div>
            <div className="px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20">
              <p className="text-xs text-blue-200">Today</p>
              <p className="font-bold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="bg-amber-50 p-3 rounded-2xl w-fit mb-4"><Wallet className="h-6 w-6 text-amber-600" /></div>
            <p className="text-xs text-slate-500 font-medium mb-1">Total Revenue</p>
            <h3 className="text-2xl font-extrabold text-[#0f172a]">RWF {stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="bg-emerald-50 p-3 rounded-2xl w-fit mb-4"><TrendingUp className="h-6 w-6 text-emerald-600" /></div>
            <p className="text-xs text-slate-500 font-medium mb-1">Paid Payments</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">{stats.paidCount}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="bg-red-50 p-3 rounded-2xl w-fit mb-4"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
            <p className="text-xs text-slate-500 font-medium mb-1">Unpaid Payments</p>
            <h3 className="text-2xl font-extrabold text-red-600">{stats.unpaidCount}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="bg-violet-50 p-3 rounded-2xl w-fit mb-4"><Receipt className="h-6 w-6 text-violet-600" /></div>
            <p className="text-xs text-slate-500 font-medium mb-1">Overdue Invoices</p>
            <h3 className="text-2xl font-extrabold text-violet-600">{stats.overdueInvoices}</h3>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a]">Recent Payments</h3>
              <p className="text-sm text-slate-500 mt-1">Latest payment transactions</p>
            </div>
            <Link to="/payments" className="flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
              Manage Payments <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Tenant</th>
                  <th className="text-left px-6 py-3 font-semibold">Month</th>
                  <th className="text-left px-6 py-3 font-semibold">Amount</th>
                  <th className="text-left px-6 py-3 font-semibold">Method</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-[#0f172a]">{tenantName(p.tenantId)}</td>
                    <td className="px-6 py-3">{p.month}</td>
                    <td className="px-6 py-3 font-semibold">RWF {p.amount.toLocaleString()}</td>
                    <td className="px-6 py-3 capitalize">{p.method ?? "—"}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.status === "paid" ? "bg-emerald-50 text-emerald-700" :
                        p.status === "pending" ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-600"
                      }`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/payments" className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="bg-amber-50 p-3 rounded-xl"><Plus className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm font-bold text-[#0f172a]">Record Payment</p>
              <p className="text-xs text-slate-500">Add a new payment entry</p>
            </div>
          </Link>
          <Link to="/reports" className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="bg-blue-50 p-3 rounded-xl"><Building2 className="h-5 w-5 text-[#2563eb]" /></div>
            <div>
              <p className="text-sm font-bold text-[#0f172a]">View Reports</p>
              <p className="text-xs text-slate-500">Financial reports & analytics</p>
            </div>
          </Link>
          <Link to="/analytics" className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="bg-violet-50 p-3 rounded-xl"><TrendingUp className="h-5 w-5 text-violet-600" /></div>
            <div>
              <p className="text-sm font-bold text-[#0f172a]">Analytics</p>
              <p className="text-xs text-slate-500">Revenue & occupancy trends</p>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
