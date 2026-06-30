import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { auth, db, type User, formatRole } from "@/lib/pms-store";
import { toast } from "sonner";
import { UserPlus, Edit } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export const Route = createFileRoute("/users/")({
  head: () => ({ meta: [{ title: "Users - RG Market PMS" }] }),
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(db.getUsers());
  }, []);

  const deleteUser = (id: number) => {
    const allUsers = db.getUsers();
    if (id === 1) {
      toast.error("Cannot delete the default Super Admin");
      return;
    }
    const updated = allUsers.filter((u) => u.id !== id);
    db.setUsers(updated);
    setUsers(updated);
    toast.success("User deleted successfully");
  };

  if (!auth.can("users.view")) {
    return (
      <DashboardLayout title="Users">
        <div className="py-20 text-center text-slate-500">You don't have permission to view users.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Users Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">System Users</h2>
          <p className="text-sm text-slate-500">Manage admins, accountants, and tenants</p>
        </div>
        {auth.can("users.manage") && (
          <Link to="/users/add" className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-[#1e50c9] transition-colors">
            <UserPlus className="h-4 w-4" />
            Add User
          </Link>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Phone</th>
              <th className="text-left px-6 py-4 font-semibold text-slate-600">Role</th>
              <th className="text-right px-6 py-4 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-[#0f172a]">{user.name}</td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-slate-600">{user.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.role === "super_admin" ? "bg-violet-50 text-violet-700" :
                    user.role === "accountant" ? "bg-amber-50 text-amber-700" :
                    "bg-emerald-50 text-emerald-700"
                  }`}>
                    {formatRole(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {auth.can("users.manage") && (
                    <div className="flex items-center justify-end gap-2">
                      <Link to="/users/edit/$userId" params={{ userId: String(user.id) }} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteDialog
                        title="Delete User"
                        description={`Are you sure you want to delete ${user.name}?`}
                        onConfirm={() => deleteUser(user.id)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
