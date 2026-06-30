import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type POSProduct, type POSCategory } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, Plus, Package } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export const Route = createFileRoute("/pos/products")({
  head: () => ({ meta: [{ title: "POS Products - RG Market PMS" }] }),
  component: POSProductsPage,
});

function POSProductsPage() {
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [categories, setCategories] = useState<POSCategory[]>([]);
  const tenantRecord = auth.getTenantRecord();

  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (tenantRecord) {
      setProducts(db.getPOSProducts().filter(p => p.tenantId === tenantRecord.id));
      setCategories(db.getPOSCategories().filter(c => c.tenantId === tenantRecord.id));
    }
  }, [tenantRecord]);

  if (!auth.can("pos.manage")) {
    return (
      <DashboardLayout title="POS Products">
        <div className="py-20 text-center text-slate-500">You don't have permission to manage POS products.</div>
      </DashboardLayout>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || !price || !stock || !tenantRecord) {
      toast.error("Please fill in all required fields");
      return;
    }

    const allProducts = db.getPOSProducts();
    const newProduct: POSProduct = {
      id: nextId(allProducts),
      tenantId: tenantRecord.id,
      categoryId: Number(categoryId),
      name: name.trim(),
      price: Number(price),
      stock: Number(stock)
    };

    const updated = [...allProducts, newProduct];
    db.setPOSProducts(updated);
    setProducts(updated.filter(p => p.tenantId === tenantRecord.id));
    
    // Reset form
    setName("");
    setCategoryId("");
    setPrice("");
    setStock("");
    setIsAdding(false);
    toast.success("Product added successfully!");
  };

  const deleteProduct = (id: number) => {
    const allProducts = db.getPOSProducts();
    const updated = allProducts.filter(p => p.id !== id);
    db.setPOSProducts(updated);
    setProducts(updated.filter(p => p.tenantId === tenantRecord?.id));
    toast.success("Product deleted");
  };

  return (
    <DashboardLayout title="Inventory Management">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Products Database</h2>
          <p className="text-sm text-slate-500">Manage your shop's stock and prices</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-[#1e50c9] transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6 animate-in slide-in-from-top-4">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-[#0f172a] flex items-center gap-2">
              <Package className="h-5 w-5 text-[#2563eb]" />
              New Product Details
            </h2>
            <button onClick={() => setIsAdding(false)} className="text-sm text-slate-500 hover:text-slate-800 font-semibold">Cancel</button>
          </div>
          <form onSubmit={handleAdd} className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white"
                >
                  <option value="">Select a category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {categories.length === 0 && <p className="text-xs text-red-500 mt-1">Please add a category first.</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Selling Price (RWF) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Initial Stock Quantity *</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#2563eb] text-white font-bold hover:bg-[#1e50c9] transition-all shadow-md"
            >
              <Save className="h-5 w-5" /> Save Product
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Product Name</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Category</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Price (RWF)</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Stock Available</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const cat = categories.find(c => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-[#0f172a]">{p.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-semibold">{cat?.name || "—"}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock <= 5 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteDialog
                        title="Delete Product"
                        description={`Are you sure you want to delete ${p.name}?`}
                        onConfirm={() => deleteProduct(p.id)}
                      />
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No products added yet. Start by adding some inventory!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </DashboardLayout>
  );
}
