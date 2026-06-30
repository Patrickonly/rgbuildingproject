import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, nextId, type User } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/users_/add")({
  head: () => ({ meta: [{ title: "Add User - RG Market PMS" }] }),
  component: AddUserPage,
});

function AddUserPage() {
  const navigate = useNavigate();

  if (!auth.can("users.manage")) {
    return (
      <DashboardLayout title="Add User">
        <div className="py-20 text-center text-slate-500">You don't have permission to manage users.</div>
      </DashboardLayout>
    );
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"super_admin" | "accountant" | "tenant">("accountant");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    const allUsers = db.getUsers();
    if (allUsers.some(u => u.email === email)) {
      toast.error("User with this email already exists");
      return;
    }

    const newUser: User = {
      id: nextId(allUsers),
      name,
      email,
      phone,
      password,
      role,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    db.setUsers([...allUsers, newUser]);
    toast.success("User added successfully!");
    navigate({ to: "/users" });
  };

  return (
    <DashboardLayout title="Add New User">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate({ to: "/users" })} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563eb] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-[#0f172a]">User Details</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password *</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-white"
                >
                  <option value="accountant">Accountant</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all shadow-md">
                <Save className="h-5 w-5" />
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
