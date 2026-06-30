import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, FLOORS, type Room, type Category } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/rooms_/add")({
  head: () => ({ meta: [{ title: "Add Room - RG Market PMS" }] }),
  component: AddRoomPage,
});

function AddRoomPage() {
  const navigate = useNavigate();

  // Only Super Admin can add rooms
  if (!auth.can("rooms.create")) {
    return (
      <DashboardLayout title="Add New Room">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg">You don't have permission to add rooms.</p>
        </div>
      </DashboardLayout>
    );
  }

  const categories = db.getCategories();
  
  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("Ground");
  const [categoryId, setCategoryId] = useState(categories.length > 0 ? categories[0].id : 1);
  const [size, setSize] = useState("");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Room["status"]>("available");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || !rent || !size) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const newRoom: Room = {
      id: nextId(db.getRooms()),
      number,
      floor,
      buildingId: 1,
      categoryId,
      size: Number(size),
      rent: Number(rent),
      deposit: Number(deposit),
      status,
      description: description || `Room on ${floor}`,
    };

    db.setRooms([...db.getRooms(), newRoom]);
    const user = auth.currentUser();
    if (user) {
      db.addActivity(user.id, "room_add", `Added room ${number} on ${floor}`);
    }
    
    setTimeout(() => {
      toast.success("Room created successfully!");
      navigate({ to: "/rooms" });
    }, 800);
  };

  return (
    <DashboardLayout title="Add New Room">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate({ to: "/rooms" })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563eb] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </button>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-[#0f172a]">Room Details</h2>
            <p className="text-sm text-slate-500 mt-1">Enter the information for the new room</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Room Number *</label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g., G-01, 2-03"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Floor *</label>
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all"
                >
                  {FLOORS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all capitalize"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Size (sqm) *</label>
                <input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g., 40"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Monthly Rent (RWF) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">RWF</span>
                  <input
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    placeholder="300000"
                    className="w-full pl-16 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Deposit (RWF) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">RWF</span>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    placeholder="300000"
                    className="w-full pl-16 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the room..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 transition-all resize-none"
              />
            </div>

              <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="available"
                    checked={status === "available"}
                    onChange={() => setStatus("available")}
                    className="w-4 h-4 text-[#2563eb] border-slate-300 focus:ring-[#2563eb]"
                  />
                  <span className="text-sm text-slate-700">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="occupied"
                    checked={status === "occupied"}
                    onChange={() => setStatus("occupied")}
                    className="w-4 h-4 text-[#2563eb] border-slate-300 focus:ring-[#2563eb]"
                  />
                  <span className="text-sm text-slate-700">Occupied</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="maintenance"
                    checked={status === "maintenance"}
                    onChange={() => setStatus("maintenance")}
                    className="w-4 h-4 text-[#2563eb] border-slate-300 focus:ring-[#2563eb]"
                  />
                  <span className="text-sm text-slate-700">Maintenance</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="reserved"
                    checked={status === "reserved"}
                    onChange={() => setStatus("reserved")}
                    className="w-4 h-4 text-[#2563eb] border-slate-300 focus:ring-[#2563eb]"
                  />
                  <span className="text-sm text-slate-700">Reserved</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {isLoading ? "Saving..." : "Save Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
