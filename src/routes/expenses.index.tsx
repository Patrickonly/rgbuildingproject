import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type Expense } from "@/lib/pms-store";
import { toast } from "sonner";
import { Plus, Edit, TrendingDown } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export const Route = createFileRoute("/expenses/")({
  head: () => ({ meta: [{ title: "Expenses - RG Market PMS" }] }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    setExpenses(db.getExpenses());
  }, []);

  const deleteExpense = (id: number) => {
    const allExpenses = db.getExpenses();
    const updated = allExpenses.filter((e) => e.id !== id);
    db.setExpenses(updated);
    setExpenses(updated);
    toast.success("Expense deleted successfully");
  };

  if (!auth.can("expenses.view")) {
    return (
      <DashboardLayout title="Expenses">
        <div className="py-20 text-center text-slate-500">You don't have permission to view expenses.</div>
      </DashboardLayout>
    );
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <DashboardLayout title="Expenses Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Company Expenses</h2>
          <p className="text-sm text-slate-500">Track and manage outgoing funds</p>
        </div>
        {auth.can("expenses.create") && (
          <Link to="/expenses/add" className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-[#1e50c9] transition-colors">
            <Plus className="h-4 w-4" />
            Record Expense
          </Link>
        )}
      </div>

      <div className="mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 w-fit pr-10">
        <div className="bg-red-50 p-3 rounded-xl"><TrendingDown className="h-6 w-6 text-red-600" /></div>
        <div>
          <p className="text-xs text-slate-500 font-semibold mb-1">Total Expenses Recorded</p>
          <p className="text-2xl font-extrabold text-red-600">RWF {totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Category</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Description</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Amount (RWF)</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-[#0f172a]">{expense.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{expense.description}</td>
                  <td className="px-6 py-4 font-bold text-red-600">-{expense.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      expense.status === "paid" ? "bg-emerald-50 text-emerald-700" :
                      "bg-amber-50 text-amber-700"
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {auth.can("expenses.edit") && (
                      <div className="flex items-center justify-end gap-2">
                        <Link to="/expenses/edit/$expenseId" params={{ expenseId: String(expense.id) }} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeleteDialog
                          title="Delete Expense"
                          description="Are you sure you want to delete this expense record?"
                          onConfirm={() => deleteExpense(expense.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No expenses recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
