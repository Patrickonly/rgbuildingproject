import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type POSSale, type POSProduct } from "@/lib/pms-store";
import { toast } from "sonner";
import { ShoppingCart, CheckCircle2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pos/sales")({
  head: () => ({ meta: [{ title: "POS Sales - RG Market PMS" }] }),
  component: POSSalesPage,
});

function POSSalesPage() {
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [sales, setSales] = useState<POSSale[]>([]);
  const tenantRecord = auth.getTenantRecord();

  // Cart State
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (tenantRecord) {
      setProducts(db.getPOSProducts().filter(p => p.tenantId === tenantRecord.id));
      setSales(db.getPOSSales().filter(s => s.tenantId === tenantRecord.id));
    }
  }, [tenantRecord]);

  if (!auth.can("pos.manage")) {
    return (
      <DashboardLayout title="POS Sales">
        <div className="py-20 text-center text-slate-500">You don't have permission to record sales.</div>
      </DashboardLayout>
    );
  }

  const selectedProduct = products.find(p => p.id === Number(selectedProductId));
  const totalAmount = selectedProduct ? selectedProduct.price * Number(quantity) : 0;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !tenantRecord) return;
    
    const qty = Number(quantity);
    if (qty <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }
    if (qty > selectedProduct.stock) {
      toast.error("Not enough stock available!");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Record Sale
      const allSales = db.getPOSSales();
      const newSale: POSSale = {
        id: nextId(allSales),
        tenantId: tenantRecord.id,
        productId: selectedProduct.id,
        quantity: qty,
        totalAmount,
        date: new Date().toISOString()
      };
      const updatedSales = [...allSales, newSale];
      db.setPOSSales(updatedSales);
      
      // Deduct Stock
      const allProducts = db.getPOSProducts();
      const updatedProducts = allProducts.map(p => 
        p.id === selectedProduct.id ? { ...p, stock: p.stock - qty } : p
      );
      db.setPOSProducts(updatedProducts);
      
      // Update local state
      setSales(updatedSales.filter(s => s.tenantId === tenantRecord.id));
      setProducts(updatedProducts.filter(p => p.tenantId === tenantRecord.id));
      
      // Reset cart
      setSelectedProductId("");
      setQuantity("1");
      setIsProcessing(false);
      toast.success("Sale recorded and stock updated!");
    }, 600);
  };

  return (
    <DashboardLayout title="Sales Register">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Checkout Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-[96px]">
            <div className="p-6 border-b border-slate-100 bg-[#2563eb] text-white">
              <h2 className="font-bold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-200" />
                New Sale
              </h2>
            </div>
            
            <form onSubmit={handleCheckout} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select Product *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white"
                  required
                >
                  <option value="">Choose a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} (RWF {p.price.toLocaleString()}) {p.stock <= 0 ? "- OUT OF STOCK" : ""}
                    </option>
                  ))}
                </select>
                {selectedProduct && (
                  <p className={cn("text-xs font-semibold", selectedProduct.stock <= 5 ? "text-red-500" : "text-slate-500")}>
                    Stock Available: {selectedProduct.stock} units
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct?.stock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={!selectedProduct}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] disabled:bg-slate-50"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-[#0f172a]">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-extrabold text-emerald-600">
                    RWF {totalAmount.toLocaleString()}
                  </span>
                </div>

                <button 
                  type="submit" 
                  disabled={!selectedProduct || isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Complete Sale
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sales History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-[#0f172a] flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#2563eb]" />
                Recent Transactions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">Date/Time</th>
                    <th className="text-left px-6 py-4 font-semibold text-slate-600">Product</th>
                    <th className="text-center px-6 py-4 font-semibold text-slate-600">Qty</th>
                    <th className="text-right px-6 py-4 font-semibold text-slate-600">Total (RWF)</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice().reverse().map((sale) => {
                    const product = products.find(p => p.id === sale.productId);
                    return (
                      <tr key={sale.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(sale.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#0f172a]">
                          {product?.name || "Unknown Product"}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold">
                          {sale.quantity}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">
                          {sale.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {sales.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No sales recorded yet. Your transactions will appear here.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
