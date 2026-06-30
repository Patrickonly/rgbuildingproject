import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type Expense } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/expenses_/add")({
  head: () => ({ meta: [{ title: "Record Expense - RG Market PMS" }] }),
  component: AddExpensePage,
});

function AddExpensePage() {
  const navigate = useNavigate();

  if (!auth.can("expenses.create")) {
    return (
      <DashboardLayout title="Record Expense">
        <div className="py-20 text-center text-slate-500">You don't have permission to record expenses.</div>
      </DashboardLayout>
    );
  }

  const [category, setCategory] = useState("Maintenance");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"paid" | "pending">("paid");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || !date || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const user = auth.currentUser();
    if (!user) return;

    const allExpenses = db.getExpenses();
    const newExpense: Expense = {
      id: nextId(allExpenses),
      category,
      amount: Number(amount),
      date,
      description,
      status,
      recordedBy: user.id,
    };

    db.setExpenses([...allExpenses, newExpense]);
    db.addActivity(user.id, "expense_record", `Recorded expense: RWF ${Number(amount).toLocaleString()} for ${category}`);
    
    toast.success("Expense recorded successfully!");
    navigate({ to: "/expenses" });
  };

  return (
    <DashboardLayout title="Record New Expense">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate({ to: "/expenses" })} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563eb] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Expenses
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-[#0f172a]">Expense Details</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white"
                >
                  <option value="Maintenance">Maintenance & Repairs</option>
                  <option value="Utilities">Utilities (Water, Electricity)</option>
                  <option value="Salary">Staff Salary</option>
                  <option value="Taxes">Taxes</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Amount (RWF) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this expense for?"
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all shadow-md">
                <Save className="h-5 w-5" />
                Record Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
