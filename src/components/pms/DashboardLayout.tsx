import { auth, formatRole, getRoleColor, type Permission, type UserRole } from "@/lib/pms-store";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  Crown,
  DollarSign,
  DoorOpen,
  FileText,
  Home,
  LogOut,
  Menu,
  Package,
  Receipt,
  Search,
  Settings,
  ShoppingCart,
  Store,
  User,
  UserPlus,
  Users,
  Wallet
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { FileText as InvoiceIcon, LayoutGrid } from "lucide-react";

// Sidebar menu items with required permissions
type MenuItem =
  | { to: string; label: string; icon: any; permission?: Permission }
  | {
    label: string;
    icon: any;
    children: { to: string; label: string; icon: any; permission?: Permission }[];
  };

const adminMenu: MenuItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/categories", label: "Categories", icon: LayoutGrid, permission: "categories.view" },
  { to: "/rooms", label: "Rooms", icon: DoorOpen, permission: "rooms.view" },
  { to: "/tenants", label: "Tenants", icon: Users, permission: "tenants.view" },
  { to: "/payments", label: "Payments", icon: Wallet, permission: "payments.view" },
  { to: "/invoices", label: "Invoices", icon: InvoiceIcon, permission: "invoices.view" },
  { to: "/reports", label: "Reports", icon: BarChart3, permission: "reports.view" },
  { to: "/expenses", label: "Expenses", icon: DollarSign, permission: "expenses.view" },
  { to: "/users", label: "Users", icon: UserPlus, permission: "users.view" },
  { to: "/notifications", label: "Notifications", icon: Bell, permission: "notifications.view" },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings, permission: "settings.view" },
];

const tenantMenu: MenuItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/rooms", label: "My Room", icon: DoorOpen, permission: "rooms.view" },
  {
    label: "Point of Sale",
    icon: Store,
    children: [
      { to: "/pos/dashboard", label: "Overview", icon: BarChart3, permission: "pos.view" },
      { to: "/pos/categories", label: "Categories", icon: LayoutGrid, permission: "pos.manage" },
      { to: "/pos/products", label: "Inventory", icon: Package, permission: "pos.manage" },
      { to: "/pos/sales", label: "Sales Register", icon: ShoppingCart, permission: "pos.manage" },
    ],
  },
  { to: "/payments/add", label: "Pay Rent", icon: Wallet, permission: "payments.create" },
  { to: "/payments", label: "Payment History", icon: FileText, permission: "payments.view" },
  { to: "/invoices", label: "Receipts", icon: InvoiceIcon, permission: "invoices.view" },
  { to: "/notifications", label: "Notifications", icon: Bell, permission: "notifications.view" },
  { to: "/profile", label: "Profile", icon: User },
];

const defaultMenu: MenuItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/rooms", label: "Rooms", icon: DoorOpen, permission: "rooms.view" },
  { to: "/payments", label: "Payments", icon: Wallet, permission: "payments.view" },
];

// Breadcrumb component
function Breadcrumbs({ currentPage }: { currentPage: string }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-slate-500">
      <Link to="/dashboard" className="hover:text-[#2563eb] flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      <ArrowRight className="h-3 w-3" />
      <span className="text-[#0f172a] font-medium">{currentPage}</span>
    </nav>
  );
}

function getRoleIcon(role: UserRole) {
  switch (role) {
    case "super_admin": return Crown;
    case "tenant": return Users;
    case "accountant": return Receipt;
  }
}

function getRoleSolidColor(role: UserRole) {
  switch (role) {
    case "super_admin": return "bg-violet-600";
    case "tenant": return "bg-[#2563eb]";
    case "accountant": return "bg-amber-600";
  }
}

export function DashboardLayout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(["More Options"]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const currentUser = auth.currentUser();

  useEffect(() => {
    // Show skeleton on path change
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!auth.isLoggedIn()) navigate({ to: "/login" });
    else setReady(true);
  }, [navigate]);

  if (!ready || !currentUser) return null;

  const handleLogoutConfirm = () => {
    auth.logout();
    setLogoutModalOpen(false);
    toast.success("Successfully logged out");
    navigate({ to: "/login" });
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const roleColor = getRoleColor(currentUser.role);
  const roleSolidBg = getRoleSolidColor(currentUser.role);
  const RoleIcon = getRoleIcon(currentUser.role);

  // Filter menu items based on user permissions
  const activeMenu = currentUser.role === "super_admin" ? adminMenu : currentUser.role === "tenant" ? tenantMenu : defaultMenu;

  const filteredMenu = activeMenu.reduce<MenuItem[]>((acc, item) => {
    if ("to" in item) {
      // Single item — check permission
      if (!item.permission || auth.can(item.permission)) {
        acc.push(item);
      }
    } else {
      // Group — filter children
      const visibleChildren = item.children.filter(
        (child) => !child.permission || auth.can(child.permission)
      );
      if (visibleChildren.length > 0) {
        acc.push({ ...item, children: visibleChildren });
      }
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen flex w-full bg-[#f8fafc] font-sans">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static z-50 inset-y-0 left-0 bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Area */}
        <div className="h-[72px] flex items-center gap-3 px-6 border-b border-slate-100 shrink-0">
          <div className="h-11 w-11 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Building2 className="h-6 w-6" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="font-bold text-[#0f172a] text-base leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                RG Market
              </div>
              <div className="text-[11px] text-slate-500">
                Property Management
              </div>
            </div>
          )}
        </div>



        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 flex flex-col">
          {filteredMenu.map((item, idx) => {
            if ("to" in item) {
              // Single menu item
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all group",
                    active
                      ? "bg-[#2563eb] text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "text-white")} />
                  {!sidebarCollapsed && item.label}
                </Link>
              );
            } else {
              // Dropdown menu
              const isOpen = openDropdowns.includes(item.label);
              const hasActiveChild = item.children.some((child) => pathname === child.to);
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                      hasActiveChild
                        ? "bg-slate-50 text-[#0f172a]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {!sidebarCollapsed && item.label}
                    </div>
                    {!sidebarCollapsed && (
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                      />
                    )}
                  </button>
                  {!sidebarCollapsed && isOpen && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child, childIdx) => {
                        const active = pathname === child.to;
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={childIdx}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                              active
                                ? "bg-[#2563eb]/10 text-[#2563eb]"
                                : "text-slate-500 hover:bg-slate-50 hover:text-[#0f172a]"
                            )}
                          >
                            <ChildIcon className="h-4 w-4" />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 gap-4 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
            </button>
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-slate-50 border border-slate-200"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </button>
            <div className="flex flex-col gap-1">
              <Breadcrumbs currentPage={title} />
              <h1 className="text-lg font-bold text-[#0f172a]">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 w-72 focus-within:ring-2 focus-within:ring-[#2563eb]/20 focus-within:border-[#2563eb] transition-all">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search menus or pages..."
                className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
              />
            </div>

            {/* Notifications */}
            <button className="p-2.5 rounded-xl hover:bg-slate-50 relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-white" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-50 transition-all"
              >
                <div className={`h-10 w-10 rounded-full ${roleSolidBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  <User className="h-4 w-4" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-[#0f172a]">
                    {currentUser.name}
                  </div>
                  <div className={`text-[10px] font-semibold ${roleColor.text}`}>
                    {formatRole(currentUser.role)}
                  </div>
                </div>
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full ${roleSolidBg} flex items-center justify-center text-white font-bold`}>
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#0f172a]">
                            {currentUser.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {currentUser.email}
                          </div>
                          <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColor.bg} ${roleColor.text} border ${roleColor.border}`}>
                            <RoleIcon className="h-2.5 w-2.5" />
                            {formatRole(currentUser.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#0f172a] transition-all"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      {auth.can("settings.view") && (
                        <Link
                          to="/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#0f172a] transition-all"
                        >
                          <Settings className="h-4 w-4" />
                          System Settings
                        </Link>
                      )}
                      <div className="h-px bg-slate-100 my-2" />
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setLogoutModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {isNavigating ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-8 bg-slate-200/60 rounded-xl w-1/4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="h-24 bg-slate-200/60 rounded-2xl"></div>
                <div className="h-24 bg-slate-200/60 rounded-2xl"></div>
                <div className="h-24 bg-slate-200/60 rounded-2xl"></div>
                <div className="h-24 bg-slate-200/60 rounded-2xl"></div>
              </div>
              <div className="h-64 bg-slate-200/60 rounded-3xl"></div>
            </div>
          ) : (
            children
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-6 lg:px-10 shrink-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} RG Market Building. All rights reserved.
            </p>
            <p className="text-xs text-[#2563eb] font-semibold">
              Designed by Global Technologies Rwanda
            </p>
          </div>
        </footer>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 rounded-full bg-red-50">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] text-center mb-2">
                Confirm Logout
              </h3>
              <p className="text-slate-600 text-center mb-7 text-sm">
                Are you sure you want to log out? You will need to log in again
                to continue managing RG Market.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLogoutModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 py-3 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all text-sm"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
