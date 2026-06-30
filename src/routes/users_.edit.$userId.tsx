import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type User } from "@/lib/pms-store";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/users_/edit/$userId")({
  head: () => ({ meta: [{ title: "Edit User - RG Market PMS" }] }),
  component: EditUserPage,
});

function EditUserPage() {
  const navigate = useNavigate();
  const { userId } = useParams({ from: "/users_/edit/$userId" });

  if (!auth.can("users.manage")) {
    return (
      <DashboardLayout title="Edit User">
        <div className="py-20 text-center text-slate-500">You don't have permission to manage users.</div>
      </DashboardLayout>
    );
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"super_admin" | "accountant" | "tenant">("accountant");

  useEffect(() => {
    const allUsers = db.getUsers();
    const user = allUsers.find(u => u.id === Number(userId));
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setPassword(user.password);
      setRole(user.role);
    } else {
      navigate({ to: "/users" });
    }
  }, [userId, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (Number(userId) === 1 && role !== "super_admin") {
      toast.error("Cannot change the role of the default Super Admin");
      return;
    }

    const allUsers = db.getUsers();
    const updatedUsers = allUsers.map((u) => 
      u.id === Number(userId) ? { ...u, name, email, phone, password, role } : u
    );

    db.setUsers(updatedUsers);
    toast.success("User updated successfully!");
    navigate({ to: "/users" });
  };

  return (
    <DashboardLayout title="Edit User">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate({ to: "/users" })} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2563eb] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-[#0f172a]">Edit User Details</h2>
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
                  disabled={Number(userId) === 1}
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
