import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type POSSale, type POSProduct } from "@/lib/pms-store";
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pos/dashboard")({
  head: () => ({ meta: [{ title: "POS Dashboard - RG Market PMS" }] }),
  component: POSDashboard,
});

function POSDashboard() {
  const [sales, setSales] = useState<POSSale[]>([]);
  const [products, setProducts] = useState<POSProduct[]>([]);
  const tenantRecord = auth.getTenantRecord();

  useEffect(() => {
    if (tenantRecord) {
      const allSales = db.getPOSSales().filter(s => s.tenantId === tenantRecord.id);
      const allProducts = db.getPOSProducts().filter(p => p.tenantId === tenantRecord.id);
      setSales(allSales);
      setProducts(allProducts);
    }
  }, [tenantRecord]);

  if (!auth.can("pos.view")) {
    return (
      <DashboardLayout title="POS Overview">
        <div className="py-20 text-center text-slate-500">You don't have permission to view POS data.</div>
      </DashboardLayout>
    );
  }

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalItemsSold = sales.reduce((sum, s) => sum + s.quantity, 0);
  const lowStockProducts = products.filter(p => p.stock <= 5);

  return (
    <DashboardLayout title="Shop Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
          <div><p className="text-xs text-slate-500">Total Revenue</p><p className="text-lg font-extrabold text-emerald-600">RWF {totalRevenue.toLocaleString()}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-[#2563eb]/10 p-3 rounded-xl"><ShoppingCart className="h-5 w-5 text-[#2563eb]" /></div>
          <div><p className="text-xs text-slate-500">Items Sold</p><p className="text-lg font-extrabold text-[#2563eb]">{totalItemsSold}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-violet-50 p-3 rounded-xl"><Package className="h-5 w-5 text-violet-600" /></div>
          <div><p className="text-xs text-slate-500">Total Products</p><p className="text-lg font-extrabold text-violet-600">{products.length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-xl"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
          <div><p className="text-xs text-slate-500">Low Stock Alert</p><p className="text-lg font-extrabold text-red-600">{lowStockProducts.length}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0f172a]">Recent Sales</h3>
            <Link to="/pos/sales" className="text-sm font-semibold text-[#2563eb] hover:underline">View All</Link>
          </div>
          <div className="p-0 overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Product</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Qty</th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice(-5).reverse().map(sale => {
                  const product = products.find(p => p.id === sale.productId);
                  return (
                    <tr key={sale.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-[#0f172a]">{product?.name || 'Unknown'}</td>
                      <td className="px-6 py-3 text-slate-600">{sale.quantity}</td>
                      <td className="px-6 py-3 text-right font-bold text-emerald-600">RWF {sale.totalAmount.toLocaleString()}</td>
                    </tr>
                  )
                })}
                {sales.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No sales recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0f172a]">Low Stock Products</h3>
            <Link to="/pos/products" className="text-sm font-semibold text-[#2563eb] hover:underline">Manage Inventory</Link>
          </div>
          <div className="p-0 overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Product</th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-600">Stock Left</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map(p => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-[#0f172a]">{p.name}</td>
                    <td className="px-6 py-3 text-right font-bold text-red-600">{p.stock}</td>
                  </tr>
                ))}
                {lowStockProducts.length === 0 && (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-500">All products are well stocked.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
