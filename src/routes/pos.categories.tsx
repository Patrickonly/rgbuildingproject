import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type POSCategory } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export const Route = createFileRoute("/pos/categories")({
  head: () => ({ meta: [{ title: "POS Categories - RG Market PMS" }] }),
  component: POSCategoriesPage,
});

function POSCategoriesPage() {
  const [categories, setCategories] = useState<POSCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const tenantRecord = auth.getTenantRecord();

  useEffect(() => {
    if (tenantRecord) {
      setCategories(db.getPOSCategories().filter(c => c.tenantId === tenantRecord.id));
    }
  }, [tenantRecord]);

  if (!auth.can("pos.manage")) {
    return (
      <DashboardLayout title="POS Categories">
        <div className="py-20 text-center text-slate-500">You don't have permission to manage POS categories.</div>
      </DashboardLayout>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !tenantRecord) return;

    const allCategories = db.getPOSCategories();
    const newCategory: POSCategory = {
      id: nextId(allCategories),
      tenantId: tenantRecord.id,
      name: newCategoryName.trim()
    };

    const updated = [...allCategories, newCategory];
    db.setPOSCategories(updated);
    setCategories(updated.filter(c => c.tenantId === tenantRecord.id));
    setNewCategoryName("");
    toast.success("Category added successfully!");
  };

  const deleteCategory = (id: number) => {
    const allCategories = db.getPOSCategories();
    const updated = allCategories.filter(c => c.id !== id);
    db.setPOSCategories(updated);
    setCategories(updated.filter(c => c.tenantId === tenantRecord?.id));
    toast.success("Category deleted");
  };

  return (
    <DashboardLayout title="Product Categories">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Add New Category */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-[#0f172a] flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#2563eb]" />
                Add Category
              </h2>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category Name *</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Electronics, Clothing..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <button 
                type="submit" 
                disabled={!newCategoryName.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all shadow-md disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> Save Category
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-slate-600">Name</th>
                  <th className="text-right px-6 py-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-[#0f172a]">{c.name}</td>
                    <td className="px-6 py-4 text-right">
                      <DeleteDialog
                        title="Delete Category"
                        description={`Are you sure you want to delete "${c.name}"? Make sure no products are using it.`}
                        onConfirm={() => deleteCategory(c.id)}
                      />
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr><td colSpan={2} className="px-6 py-12 text-center text-slate-500">No categories added yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
