import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type Category, type Room } from "@/lib/pms-store";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  LayoutGrid,
  Save,
  X,
  Search,
  Building2,
  DoorOpen,
  TrendingUp,
  Layers,
  ShieldCheck,
  Warehouse,
  Store,
  UtensilsCrossed,
  Car,
  Scissors,
  Briefcase,
  Home,
  PackageOpen,
} from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export const Route = createFileRoute("/categories/")(
  {
    head: () => ({ meta: [{ title: "Categories · RG Market PMS" }] }),
    component: CategoriesPage,
  }
);

// Color palette for category cards
const CARD_THEMES = [
  { gradient: "from-blue-500 to-indigo-600", light: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-100 text-blue-700", ring: "ring-blue-200", bar: "bg-blue-500" },
  { gradient: "from-emerald-500 to-teal-600", light: "bg-emerald-50", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-200", bar: "bg-emerald-500" },
  { gradient: "from-violet-500 to-purple-600", light: "bg-violet-50", text: "text-violet-700", badge: "bg-violet-100 text-violet-700", ring: "ring-violet-200", bar: "bg-violet-500" },
  { gradient: "from-amber-500 to-orange-600", light: "bg-amber-50", text: "text-amber-700", badge: "bg-amber-100 text-amber-700", ring: "ring-amber-200", bar: "bg-amber-500" },
  { gradient: "from-rose-500 to-pink-600", light: "bg-rose-50", text: "text-rose-700", badge: "bg-rose-100 text-rose-700", ring: "ring-rose-200", bar: "bg-rose-500" },
  { gradient: "from-cyan-500 to-sky-600", light: "bg-cyan-50", text: "text-cyan-700", badge: "bg-cyan-100 text-cyan-700", ring: "ring-cyan-200", bar: "bg-cyan-500" },
  { gradient: "from-lime-500 to-green-600", light: "bg-lime-50", text: "text-lime-700", badge: "bg-lime-100 text-lime-700", ring: "ring-lime-200", bar: "bg-lime-500" },
  { gradient: "from-fuchsia-500 to-pink-600", light: "bg-fuchsia-50", text: "text-fuchsia-700", badge: "bg-fuchsia-100 text-fuchsia-700", ring: "ring-fuchsia-200", bar: "bg-fuchsia-500" },
];

// Icon mapping for common category names
function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("market")) return Store;
  if (lower.includes("office")) return Briefcase;
  if (lower.includes("shop")) return Store;
  if (lower.includes("warehouse") || lower.includes("storage")) return Warehouse;
  if (lower.includes("apartment") || lower.includes("residential")) return Home;
  if (lower.includes("restaurant") || lower.includes("food") || lower.includes("dining")) return UtensilsCrossed;
  if (lower.includes("parking")) return Car;
  if (lower.includes("salon") || lower.includes("beauty")) return Scissors;
  return LayoutGrid;
}

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const canManage = auth.can("categories.manage");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setCategories(db.getCategories());
    setRooms(db.getRooms());
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [categories, search]);

  // Stats
  const totalCategories = categories.length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const avgRoomsPerCategory = totalCategories > 0 ? Math.round(totalRooms / totalCategories) : 0;

  const openModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setName(category.name);
      setDescription(category.description);
    } else {
      setEditingId(null);
      setName("");
      setDescription("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error("Category name is required");

    let updated: Category[];
    if (editingId) {
      updated = categories.map((c) =>
        c.id === editingId ? { ...c, name, description } : c
      );
      toast.success("Category updated successfully");
    } else {
      const newId =
        categories.length > 0
          ? Math.max(...categories.map((c) => c.id)) + 1
          : 1;
      updated = [...categories, { id: newId, name, description }];
      toast.success("Category added successfully");
    }

    setCategories(updated);
    db.setCategories(updated);
    closeModal();
  };

  const handleDelete = (id: number) => {
    const isUsed = rooms.some((r) => r.categoryId === id);
    if (isUsed) {
      return toast.error(
        "Cannot delete category — it is assigned to one or more rooms."
      );
    }

    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    db.setCategories(updated);
    toast.success("Category deleted");
  };

  if (!auth.can("categories.view")) {
    return (
      <DashboardLayout title="Categories">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg font-medium">
            You don't have permission to view categories.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Room Categories">
      <div className="space-y-6">
        {/* ── Summary Stats ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Layers className="h-5 w-5 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Categories</p>
              <p className="text-xl font-extrabold text-[#0f172a]">{totalCategories}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Rooms</p>
              <p className="text-xl font-extrabold text-[#0f172a]">{totalRooms}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-violet-50 p-3 rounded-xl">
              <DoorOpen className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Occupied Rooms</p>
              <p className="text-xl font-extrabold text-[#0f172a]">{occupiedRooms}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-amber-50 p-3 rounded-xl">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Avg Rooms / Category</p>
              <p className="text-xl font-extrabold text-[#0f172a]">{avgRoomsPerCategory}</p>
            </div>
          </div>
        </div>

        {/* ── Header & Search ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-white"
            />
          </div>
          {canManage && (
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1e50c9] transition-all shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          )}
        </div>

        {/* ── Category Cards Grid ──────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-200">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <PackageOpen className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">
              {search ? "No categories match your search." : "No categories yet."}
            </p>
            {canManage && !search && (
              <button
                onClick={() => openModal()}
                className="mt-4 text-sm font-semibold text-[#2563eb] hover:underline"
              >
                Create your first category →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map((cat, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              const Icon = getCategoryIcon(cat.name);
              const catRooms = rooms.filter((r) => r.categoryId === cat.id);
              const roomCount = catRooms.length;
              const occupied = catRooms.filter((r) => r.status === "occupied").length;
              const available = catRooms.filter((r) => r.status === "available").length;
              const occupancyRate = roomCount > 0 ? Math.round((occupied / roomCount) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient accent top bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />

                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl ${theme.light} flex items-center justify-center ${theme.text} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {canManage && (
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => openModal(cat)}
                            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <DeleteDialog
                            title="Delete Category"
                            description={`Are you sure you want to delete "${cat.name}"? This action cannot be undone.`}
                            onConfirm={() => handleDelete(cat.id)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Title & description */}
                    <h3 className="text-base font-bold text-[#0f172a] mb-1 group-hover:text-[#2563eb] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 min-h-[2rem] leading-relaxed">
                      {cat.description || "No description provided."}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${theme.badge}`}>
                        <Building2 className="h-3 w-3" />
                        {roomCount} {roomCount === 1 ? "Room" : "Rooms"}
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700">
                        {available} Free
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
                        {occupied} Used
                      </div>
                    </div>

                    {/* Occupancy progress bar */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Occupancy
                        </span>
                        <span className={`text-xs font-bold ${theme.text}`}>
                          {occupancyRate}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${theme.bar} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal ──────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            style={{ animation: "modal-in 0.25s ease-out" }}
          >
            {/* Modal header with gradient accent */}
            <div className="relative">
              <div className="h-1.5 bg-gradient-to-r from-[#2563eb] to-indigo-500" />
              <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <LayoutGrid className="h-5 w-5 text-[#2563eb]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0f172a]">
                      {editingId ? "Edit Category" : "New Category"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {editingId ? "Update category details" : "Add a new room category"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 text-sm"
                  placeholder="e.g., Office, Market, Warehouse"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent text-slate-700 text-sm min-h-[100px] resize-none"
                  placeholder="Describe what this category is for..."
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200/50"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal animation keyframes */}
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </DashboardLayout>
  );
}
