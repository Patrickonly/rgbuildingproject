import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type Booking } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/bookings_/edit/$bookingId")({
  head: () => ({ meta: [{ title: "Edit Booking - RG Market PMS" }] }),
  component: EditBookingPage,
});

function EditBookingPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams({ from: "/bookings_/edit/$bookingId" });

  if (!auth.can("bookings.manage")) {
    return (
      <DashboardLayout title="Edit Booking">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg">You don't have permission to edit bookings.</p>
        </div>
      </DashboardLayout>
    );
  }

  const [formData, setFormData] = useState({ tenantId: "", roomId: "", startDate: "", endDate: "", status: "active" as "active" | "pending" | "ended" });
  const [isLoading, setIsLoading] = useState(false);
  const tenants = db.getTenants();
  const rooms = db.getRooms();
  
  const [originalRoomId, setOriginalRoomId] = useState("");

  useEffect(() => {
    const booking = db.getBookings().find((b) => b.id === Number(bookingId));
    if (booking) {
      setFormData({
        tenantId: booking.tenantId.toString(),
        roomId: booking.roomId.toString(),
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
      });
      setOriginalRoomId(booking.roomId.toString());
    } else {
      toast.error("Booking not found");
      navigate({ to: "/bookings" });
    }
  }, [bookingId, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tenantId || !formData.roomId || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields properly");
      return;
    }

    const bookings = db.getBookings();
    
    // Check for double booking if room changed
    if (formData.roomId !== originalRoomId) {
      const isDoubleBooked = bookings.some(b => b.roomId === Number(formData.roomId) && b.status === "active");
      if (isDoubleBooked) {
        toast.error("Room is already booked!");
        return;
      }
    }

    setIsLoading(true);

    const updatedBookings = bookings.map((b) => {
      if (b.id === Number(bookingId)) {
        return {
          ...b,
          tenantId: Number(formData.tenantId),
          roomId: Number(formData.roomId),
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
        };
      }
      return b;
    });

    if (formData.roomId !== originalRoomId) {
      // Mark old room as available, new room as occupied
      const allRooms = db.getRooms();
      const updatedRooms = allRooms.map((r) => {
        if (r.id === Number(originalRoomId)) return { ...r, status: "available" as const };
        if (r.id === Number(formData.roomId)) return { ...r, status: "occupied" as const };
        return r;
      });
      db.setRooms(updatedRooms);
    }

    setTimeout(() => {
      db.setBookings(updatedBookings);
      toast.success("Booking updated!");
      navigate({ to: "/bookings" });
    }, 800);
  };

  return (
    <DashboardLayout title="Edit Booking">
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
            <h2 className="text-xl font-bold text-[#0f172a]">Edit Booking Details</h2>
            <p className="text-sm text-slate-500 mt-1">Update the room assignment or dates</p>
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
                  <option value={originalRoomId}>
                    {rooms.find(r => r.id === Number(originalRoomId))?.number} (Current)
                  </option>
                  {rooms.filter(r => r.status === "available" || r.id === Number(originalRoomId)).map(r => (
                    <option key={r.id} value={r.id}>{r.number}</option>
                  ))}
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
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold text-slate-700">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as "active" | "pending" | "ended"})}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="ended">Ended</option>
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
                {isLoading ? "Updating..." : "Update Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
