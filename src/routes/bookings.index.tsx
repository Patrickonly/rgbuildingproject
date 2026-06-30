import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type Booking, nextId } from "@/lib/pms-store";
import { toast } from "sonner";
import { Plus, Calendar, Home, Users, Edit2 } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export const Route = createFileRoute("/bookings/")({
  head: () => ({ meta: [{ title: "Bookings - RG Market PMS" }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const tenants = db.getTenants();
  const rooms = db.getRooms();

  const canCreate = auth.can("bookings.manage");
  const canEdit = auth.can("bookings.manage");
  const canDelete = auth.can("bookings.manage");

  useEffect(() => {
    setBookings(db.getBookings());
  }, []);

  const save = (next: Booking[]) => {
    setBookings(next);
    db.setBookings(next);
  };

  const deleteBooking = (id: number) => {
    if (!canDelete) return;
    save(bookings.filter((b) => b.id !== id));
    toast.success("Booking deleted successfully!");
  };

  const getTenantName = (id: number) => tenants.find(t => t.id === id)?.name || "Unknown";
  const getRoomNumber = (id: number) => rooms.find(r => r.id === id)?.number || "Unknown";

  return (
    <DashboardLayout title="Bookings">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">Manage room assignments and tenant bookings.</p>
          {canCreate && (
            <Link
              to="/bookings/add"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200"
            >
              <Plus className="h-4 w-4" />
              New Booking
            </Link>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase">Tenant</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase">Room</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase">Start Date</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase">End Date</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase">Status</th>
                  {(canEdit || canDelete) && <th className="text-right px-6 py-4 text-xs font-bold text-slate-600 uppercase">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#0f172a]">
                      <div className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" />{getTenantName(booking.tenantId)}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#2563eb]">
                      <div className="flex items-center gap-2"><Home className="w-4 h-4 text-slate-400" />{getRoomNumber(booking.roomId)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" />{booking.startDate}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" />{booking.endDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'} uppercase`}>
                        {booking.status}
                      </span>
                    </td>
                    {(canEdit || canDelete) && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <Link
                              to="/bookings/edit/$bookingId"
                              params={{ bookingId: booking.id.toString() }}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                              title="Edit Booking"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Link>
                          )}
                          {canDelete && (
                            <DeleteDialog
                              title="Delete Booking?"
                              description="Are you sure you want to delete this booking?"
                              onConfirm={() => deleteBooking(booking.id)}
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
