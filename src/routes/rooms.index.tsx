import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, FLOORS, type Room, type Category } from "@/lib/pms-store";
import { toast } from "sonner";
import { Plus, Edit2, CheckCircle2, XCircle, Search, Filter, Building2, Maximize } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export const Route = createFileRoute("/rooms/")({
  head: () => ({ meta: [{ title: "Rooms - RG Market PMS" }] }),
  component: RoomsPage,
});

function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const canCreate = auth.can("rooms.create");
  const canEdit = auth.can("rooms.edit");
  const canDelete = auth.can("rooms.delete");
  const isTenant = auth.isTenant();
  const tenantRecord = auth.getTenantRecord();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(db.getCategories());
    let allRooms = db.getRooms();
    // Tenant can only see their own room
    if (isTenant && tenantRecord) {
      allRooms = allRooms.filter((r) => r.number === tenantRecord.room);
    }
    setRooms(allRooms);
  }, [isTenant, tenantRecord]);

  const deleteRoom = (id: number) => {
    if (!canDelete) return;
    const updatedRooms = rooms.filter((r) => r.id !== id);
    setRooms(updatedRooms);
    db.setRooms(updatedRooms);
    toast.success("Room deleted successfully!");
  };

  const toggleStatus = (id: number) => {
    if (!canEdit) return;
    const allRooms = db.getRooms();
    const updatedRooms = allRooms.map((r) =>
      r.id === id
        ? { ...r, status: (r.status === "available" ? "occupied" : "available") as Room["status"] }
        : r
    );
    db.setRooms(updatedRooms);
    setRooms(isTenant && tenantRecord ? updatedRooms.filter((r) => r.number === tenantRecord.room) : updatedRooms);
    toast.success("Room status updated!");
  };

  const filtered = rooms.filter((r) => {
    if (searchTerm && !r.number.toLowerCase().includes(searchTerm.toLowerCase()) && !r.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (floorFilter && r.floor !== floorFilter) return false;
    if (categoryFilter && r.categoryId.toString() !== categoryFilter) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    return true;
  });

  const totalRooms = rooms.length;
  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const available = rooms.filter((r) => r.status === "available").length;

  return (
    <DashboardLayout title="Rooms">
      <div className="space-y-6">
        {/* Summary Cards */}
        {!isTenant && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl"><Building2 className="h-5 w-5 text-[#2563eb]" /></div>
              <div>
                <p className="text-xs text-slate-500">Total Rooms</p>
                <p className="text-xl font-extrabold text-[#0f172a]">{totalRooms}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-xl"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
              <div>
                <p className="text-xs text-slate-500">Available</p>
                <p className="text-xl font-extrabold text-emerald-600">{available}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-violet-50 p-3 rounded-xl"><XCircle className="h-5 w-5 text-violet-600" /></div>
              <div>
                <p className="text-xs text-slate-500">Occupied</p>
                <p className="text-xl font-extrabold text-violet-600">{occupied}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-slate-500 text-sm">
              {isTenant ? "Your assigned room in RG Market Building" : "Manage all rooms in RG Market Building"}
            </p>
          </div>
          {canCreate && (
            <Link
              to="/rooms/add"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200"
            >
              <Plus className="h-4 w-4" />
              Add New Room
            </Link>
          )}
        </div>

        {/* Filters */}
        {!isTenant && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search rooms..."
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
              <select value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]">
                <option value="">All Floors</option>
                {FLOORS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]">
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]">
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
              {(searchTerm || floorFilter || categoryFilter || statusFilter) && (
                <button onClick={() => { setSearchTerm(""); setFloorFilter(""); setCategoryFilter(""); setStatusFilter(""); }} className="text-xs text-[#2563eb] font-semibold hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Rooms Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Room</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Floor</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Size</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Rent</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  {(canEdit || canDelete) && (
                    <th className="text-right px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-[#0f172a]">{room.number}</p>
                        <p className="text-xs text-slate-500 max-w-[200px] truncate">{room.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{room.floor}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 capitalize">
                        {categories.find(c => c.id === room.categoryId)?.name || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{room.size} sqm</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-semibold">RWF {room.rent.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                        room.status === "available" ? "bg-emerald-50 text-emerald-700" :
                        room.status === "occupied" ? "bg-blue-50 text-[#2563eb]" :
                        room.status === "reserved" ? "bg-amber-50 text-amber-600" :
                        "bg-red-50 text-red-600"
                      }`}>
                        {room.status === "available" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </span>
                    </td>
                    {(canEdit || canDelete) && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {auth.can("rooms.edit") && (
                            <Link to="/rooms/edit/$roomId" params={{ roomId: room.id.toString() }} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors" title="Edit Room">
                              <Edit2 className="h-4 w-4" />
                            </Link>
                          )}
                          {canDelete && (
                            <DeleteDialog
                              title="Delete Room?"
                              description={`Are you sure you want to delete room ${room.number}? This cannot be undone.`}
                              onConfirm={() => deleteRoom(room.id)}
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-slate-500 text-sm">No rooms found</p>
                        {canCreate && (
                          <Link to="/rooms/add" className="text-[#2563eb] text-sm font-semibold hover:underline">
                            Add your first room
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
