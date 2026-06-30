import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { Bell, Check, Trash2, Users, Wallet, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · RG Market PMS" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const notifications = [
    { id: 1, title: "New Tenant Registered", message: "John Doe has been assigned to Room A101", time: "2 hours ago", read: false, icon: Users, color: "bg-blue-50 text-blue-600" },
    { id: 2, title: "Payment Received", message: "Payment of RWF 300,000 received from Tenant A101", time: "5 hours ago", read: false, icon: Wallet, color: "bg-green-50 text-green-600" },
    { id: 3, title: "Maintenance Request", message: "New maintenance request from Room B201", time: "1 day ago", read: true, icon: AlertTriangle, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f172a]">All Notifications</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all">
            <Check className="h-4 w-4" />
            Mark All Read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div key={notification.id} className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 ${!notification.read ? 'border-l-4 border-l-[#2563eb]' : ''}`}>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-[#0f172a]">{notification.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
