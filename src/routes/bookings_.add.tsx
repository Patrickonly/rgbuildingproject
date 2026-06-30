import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type Booking, nextId } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/bookings_/add")({
  head: () => ({ meta: [{ title: "Add Booking - RG Market PMS" }] }),
  component: AddBookingPage,
});

function AddBookingPage() {
  const navigate = useNavigate();

  if (!auth.can("bookings.manage")) {
    return (
      <DashboardLayout title="Add New Booking">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg">You don't have permission to add bookings.</p>
        </div>
      </DashboardLayout>
    );
  }

  const [formData, setFormData] = useState({ tenantId: "", roomId: "", startDate: "", endDate: "", status: "active" as const });
  const [isLoading, setIsLoading] = useState(false);
  const tenants = db.getTenants();
  const rooms = db.getRooms();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenantId || !formData.roomId || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields properly");
      return;
    }

    const bookings = db.getBookings();
    const isDoubleBooked = bookings.some(b => b.roomId === Number(formData.roomId) && b.status === "active");
    if (isDoubleBooked) {
      toast.error("Room is already booked!");
      return;
    }

    setIsLoading(true);

    const newBooking: Booking = {
      id: nextId(bookings),
      tenantId: Number(formData.tenantId),
      roomId: Number(formData.roomId),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    // Update room status
    const updatedRooms = rooms.map(r => r.id === newBooking.roomId ? { ...r, status: "occupied" as const } : r);
    
    setTimeout(() => {
      db.setRooms(updatedRooms);
      db.setBookings([...bookings, newBooking]);
      toast.success("Booking created!");
      navigate({ to: "/bookings" });
    }, 800);
  };

  return (
    <DashboardLayout title="Add New Booking">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate({ to: "/bookings" })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563eb] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-[#0f172a]">Booking Details</h2>
            <p className="text-sm text-slate-500 mt-1">Assign a room to a tenant</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold text-slate-700">Tenant *</label>
                <select
                  value={formData.tenantId}
                  onChange={(e) => setFormData({...formData, tenantId: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                >
                  <option value="">Select Tenant</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold text-slate-700">Room *</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                >
                  <option value="">Select Room</option>
                  {rooms.map(r => <option key={r.id} value={r.id}>{r.number}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {isLoading ? "Saving..." : "Save Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
