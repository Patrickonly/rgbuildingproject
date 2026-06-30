import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type Payment, type Tenant } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2, CreditCard, UploadCloud, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/payments_/add")({
  head: () => ({ meta: [{ title: "Record Payment - RG Market PMS" }] }),
  component: AddPaymentPage,
});

function AddPaymentPage() {
  const navigate = useNavigate();

  if (!auth.can("payments.create")) {
    return (
      <DashboardLayout title="Record Payment">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg">You don't have permission to record payments.</p>
        </div>
      </DashboardLayout>
    );
  }

  const currentUser = auth.currentUser();
  const isTenant = currentUser?.role === "tenant";
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [amount, setAmount] = useState("");
  
  // Payment Type
  const [paymentType, setPaymentType] = useState<"online" | "manual">("online");
  const [method, setMethod] = useState<"bank" | "momo">("momo");
  const [receiptName, setReceiptName] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const allTenants = db.getTenants();
    setTenants(allTenants);
    if (isTenant) {
      const myRecord = auth.getTenantRecord();
      if (myRecord) {
        setTenantId(String(myRecord.id));
        // Auto-fill amount based on room rent if possible
        const rooms = db.getRooms();
        const room = rooms.find(r => r.number === myRecord.room);
        if (room) setAmount(String(room.rent));
      }
    }
  }, [isTenant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !month || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (paymentType === "manual" && !receiptName) {
      toast.error("Please upload a receipt for manual payments");
      return;
    }

    setIsLoading(true);

    const processPayment = () => {
      const allPayments = db.getPayments();
      const status = paymentType === "online" ? "paid" : "pending";
      
      const newPayment: Payment = {
        id: nextId(allPayments),
        tenantId: Number(tenantId),
        month,
        amount: Number(amount),
        status,
        paidDate: status === "paid" ? new Date().toISOString().slice(0, 10) : undefined,
        method: paymentType === "online" ? method : "bank",
        reference: `PAY-${String(nextId(allPayments)).padStart(3, "0")}`,
      };
      
      db.setPayments([...allPayments, newPayment]);

      if (currentUser) {
        if (paymentType === "online") {
          db.addActivity(currentUser.id, "payment_online", `Processed online payment of RWF ${Number(amount).toLocaleString()}`);
          toast.success("Online payment successful!");
        } else {
          db.addActivity(currentUser.id, "payment_manual", `Uploaded manual payment receipt for RWF ${Number(amount).toLocaleString()}`);
          toast.success("Receipt uploaded! Pending admin approval.");
        }
      }

      navigate({ to: "/payments" });
    };

    // Simulate network delay for payment gateway
    if (paymentType === "online") {
      setTimeout(processPayment, 2500);
    } else {
      setTimeout(processPayment, 800);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptName(e.target.files[0].name);
    }
  };

  return (
    <DashboardLayout title="Make a Payment">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate({ to: "/payments" })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563eb] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Payment Details</h2>
              <p className="text-sm text-slate-500 mt-1">Complete your transaction securely</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">
            
            {/* Payment Flow Selection */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentType("online")}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all",
                  paymentType === "online" 
                    ? "border-[#2563eb] bg-blue-50" 
                    : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                )}
              >
                <div className={cn("p-3 rounded-full mb-3", paymentType === "online" ? "bg-[#2563eb] text-white" : "bg-slate-100 text-slate-500")}>
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className={cn("font-bold", paymentType === "online" ? "text-[#2563eb]" : "text-slate-600")}>Pay Online</span>
                <span className="text-xs text-slate-500 mt-1">Instant processing</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentType("manual")}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all",
                  paymentType === "manual" 
                    ? "border-[#2563eb] bg-blue-50" 
                    : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                )}
              >
                <div className={cn("p-3 rounded-full mb-3", paymentType === "manual" ? "bg-[#2563eb] text-white" : "bg-slate-100 text-slate-500")}>
                  <UploadCloud className="h-6 w-6" />
                </div>
                <span className={cn("font-bold", paymentType === "manual" ? "text-[#2563eb]" : "text-slate-600")}>Upload Receipt</span>
                <span className="text-xs text-slate-500 mt-1">Pending admin approval</span>
              </button>
            </div>

            <div className="space-y-6">
              {!isTenant && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Select Tenant *</label>
                  <select
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 bg-white"
                  >
                    <option value="">Choose a tenant...</option>
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.business} ({t.room})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Month *</label>
                  <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Amount (RWF) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 font-bold"
                  />
                </div>
              </div>

              {/* Dynamic Flow Content */}
              {paymentType === "online" ? (
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="text-sm font-semibold text-slate-700">Payment Gateway *</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-700 bg-white"
                  >
                    <option value="momo">Mobile Money (MTN/Airtel)</option>
                    <option value="bank">Credit/Debit Card</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Upload Bank/MoMo Receipt *</label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {receiptName ? (
                          <>
                            <FileText className="w-10 h-10 mb-3 text-[#2563eb]" />
                            <p className="mb-2 text-sm text-slate-700 font-bold">{receiptName}</p>
                            <p className="text-xs text-slate-500">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                            <p className="mb-2 text-sm text-slate-500"><span className="font-semibold text-[#2563eb]">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-slate-500">PDF, PNG, JPG (MAX. 5MB)</p>
                          </>
                        )}
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#2563eb] text-white font-bold hover:bg-[#1e50c9] transition-all shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {paymentType === "online" ? "Processing with Gateway..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    {paymentType === "online" ? <CreditCard className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                    {paymentType === "online" ? `Pay RWF ${amount ? Number(amount).toLocaleString() : "0"} Now` : "Submit Receipt for Approval"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
