import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { Calendar, Plus, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar · RG Market PMS" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const events = [
    { title: "Monthly Tenant Meeting", date: "June 28, 2026", time: "10:00 AM", location: "5th Floor Meeting Room" },
    { title: "Maintenance Inspection", date: "June 30, 2026", time: "2:00 PM", location: "All Floors" },
    { title: "Rent Due Reminder", date: "July 1, 2026", time: "9:00 AM", location: "-" },
  ];

  return (
    <DashboardLayout title="Calendar">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f172a]">Building Events & Schedule</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all">
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="h-96 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500">Calendar View</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-[#0f172a] mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-[#0f172a]">{event.title}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
