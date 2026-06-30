// pms-store.ts - Updated with 3 rooms per category

export type UserRole = "super_admin" | "tenant" | "accountant";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type Building = {
  id: number;
  name: string;
  location: string;
  totalRooms: number;
  status: "active" | "inactive";
  createdAt: string;
};

export type Room = {
  id: number;
  buildingId: number;
  number: string;
  floor: string;
  categoryId: number;
  size: number; // sqm
  rent: number;
  deposit: number;
  status: "available" | "occupied" | "maintenance" | "reserved";
  description: string;
};

export type Booking = {
  id: number;
  tenantId: number;
  roomId: number;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "ended";
};

export type Tenant = {
  id: number;
  name: string;
  phone: string;
  email: string;
  room: string;
  business: string;
  leaseStart: string;
  leaseEnd: string;
  userId?: number;
  tinNumber?: string;
  tinDocument?: string;
  nationalId?: string;
  rdbNumber?: string;
  businessType?: string;
  status?: "active" | "suspended";
};

export type Payment = {
  id: number;
  tenantId: number;
  month: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "failed";
  paidDate?: string;
  method?: "cash" | "bank" | "momo";
  reference?: string;
};

export type Maintenance = {
  id: number;
  room: string;
  issue: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  submittedBy?: number;
};

export type Invoice = {
  id: number;
  tenantId: number;
  month: string;
  amount: number;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue";
  createdAt: string;
  createdBy: number;
};

export type ActivityLog = {
  id: number;
  userId: number;
  action: string;
  details: string;
  timestamp: string;
};

export type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: "paid" | "pending";
  recordedBy: number;
};

export type POSCategory = {
  id: number;
  tenantId: number;
  name: string;
};

export type POSProduct = {
  id: number;
  tenantId: number;
  categoryId: number;
  name: string;
  price: number;
  stock: number;
};

export type POSSale = {
  id: number;
  tenantId: number;
  productId: number;
  quantity: number;
  totalAmount: number;
  date: string;
};

// ─── Storage Keys ────────────────────────────────────────────────
const KEYS = {
  users: "rg_users",
  categories: "rg_categories",
  buildings: "rg_buildings",
  rooms: "rg_rooms",
  tenants: "rg_tenants",
  bookings: "rg_bookings",
  payments: "rg_payments",
  maintenance: "rg_maintenance",
  invoices: "rg_invoices",
  expenses: "rg_expenses",
  posCategories: "rg_pos_categories",
  posProducts: "rg_pos_products",
  posSales: "rg_pos_sales",
  activityLog: "rg_activity_log",
  currentUser: "rg_current_user",
};

// ─── Seed Data ───────────────────────────────────────────────────
const seedUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@rgmarket.rw",
    phone: "0788000001",
    password: "123456",
    role: "super_admin",
    createdAt: "2026-01-01",
  },
  {
    id: 2,
    name: "John Doe",
    email: "tenant@rgmarket.rw",
    phone: "0788123456",
    password: "123456",
    role: "tenant",
    createdAt: "2026-02-15",
  },
  {
    id: 3,
    name: "Marie Finance",
    email: "accountant@rgmarket.rw",
    phone: "0788000003",
    password: "123456",
    role: "accountant",
    createdAt: "2026-01-15",
  },
  {
    id: 4,
    name: "Aline Uwase",
    email: "aline@rgmarket.rw",
    phone: "0788222333",
    password: "123456",
    role: "tenant",
    createdAt: "2026-03-01",
  },
  {
    id: 5,
    name: "Eric Mugisha",
    email: "eric@rgmarket.rw",
    phone: "0788444555",
    password: "123456",
    role: "tenant",
    createdAt: "2026-03-10",
  },
];

const seedBuildings: Building[] = [
  {
    id: 1,
    name: "RG Market Main Building",
    location: "Kigali Downtown",
    totalRooms: 24,
    status: "active",
    createdAt: "2026-01-01"
  },
];

const seedCategories: Category[] = [
  { id: 1, name: "Retail Shop", description: "Perfect for retail businesses, boutiques, and small shops" },
  { id: 2, name: "Office Space", description: "Professional office spaces for businesses and startups" },
  { id: 3, name: "Restaurant / Cafe", description: "Spacious units with kitchen facilities for food businesses" },
  { id: 4, name: "Warehouse / Storage", description: "Large storage spaces for inventory and equipment" },
  { id: 5, name: "Clinic / Pharmacy", description: "Medical and pharmaceutical spaces with special permits" },
  { id: 6, name: "Other", description: "Flexible spaces for various business types" },
];

// ─── 3 ROOMS PER CATEGORY ───────────────────────────────────────
const seedRooms: Room[] = [
  // === RETAIL SHOP (Category 1) - 3 Rooms ===
  {
    id: 1,
    buildingId: 1,
    number: "RS-01",
    floor: "Ground",
    categoryId: 1,
    size: 25,
    rent: 150000,
    deposit: 300000,
    status: "available",
    description: "Corner shop with large window display, 25m²",
  },
  {
    id: 2,
    buildingId: 1,
    number: "RS-02",
    floor: "Ground",
    categoryId: 1,
    size: 20,
    rent: 140000,
    deposit: 280000,
    status: "available",
    description: "Mid-size retail space, 20m²",
  },
  {
    id: 3,
    buildingId: 1,
    number: "RS-03",
    floor: "Ground",
    categoryId: 1,
    size: 15,
    rent: 130000,
    deposit: 260000,
    status: "available",
    description: "Small retail unit, 15m²",
  },

  // === OFFICE SPACE (Category 2) - 3 Rooms ===
  {
    id: 4,
    buildingId: 1,
    number: "OF-01",
    floor: "Level 1",
    categoryId: 2,
    size: 30,
    rent: 200000,
    deposit: 400000,
    status: "available",
    description: "Executive office with balcony, 30m²",
  },
  {
    id: 5,
    buildingId: 1,
    number: "OF-02",
    floor: "Level 1",
    categoryId: 2,
    size: 25,
    rent: 180000,
    deposit: 360000,
    status: "available",
    description: "Standard office space, 25m²",
  },
  {
    id: 6,
    buildingId: 1,
    number: "OF-03",
    floor: "Level 1",
    categoryId: 2,
    size: 18,
    rent: 160000,
    deposit: 320000,
    status: "available",
    description: "Small office with 2 workstations, 18m²",
  },

  // === RESTAURANT / CAFE (Category 3) - 3 Rooms ===
  {
    id: 7,
    buildingId: 1,
    number: "RC-01",
    floor: "Ground",
    categoryId: 3,
    size: 45,
    rent: 250000,
    deposit: 500000,
    status: "available",
    description: "Large restaurant space with kitchen, 45m²",
  },
  {
    id: 8,
    buildingId: 1,
    number: "RC-02",
    floor: "Ground",
    categoryId: 3,
    size: 35,
    rent: 230000,
    deposit: 460000,
    status: "available",
    description: "Medium cafe with outdoor seating, 35m²",
  },
  {
    id: 9,
    buildingId: 1,
    number: "RC-03",
    floor: "Level 1",
    categoryId: 3,
    size: 28,
    rent: 210000,
    deposit: 420000,
    status: "available",
    description: "Cozy coffee shop space, 28m²",
  },

  // === WAREHOUSE / STORAGE (Category 4) - 3 Rooms ===
  {
    id: 10,
    buildingId: 1,
    number: "WS-01",
    floor: "Ground",
    categoryId: 4,
    size: 50,
    rent: 180000,
    deposit: 360000,
    status: "available",
    description: "Large warehouse unit, 50m²",
  },
  {
    id: 11,
    buildingId: 1,
    number: "WS-02",
    floor: "Ground",
    categoryId: 4,
    size: 35,
    rent: 160000,
    deposit: 320000,
    status: "available",
    description: "Medium storage space, 35m²",
  },
  {
    id: 12,
    buildingId: 1,
    number: "WS-03",
    floor: "Level 1",
    categoryId: 4,
    size: 20,
    rent: 140000,
    deposit: 280000,
    status: "available",
    description: "Small storage room, 20m²",
  },

  // === CLINIC / PHARMACY (Category 5) - 3 Rooms ===
  {
    id: 13,
    buildingId: 1,
    number: "CP-01",
    floor: "Level 1",
    categoryId: 5,
    size: 40,
    rent: 220000,
    deposit: 440000,
    status: "available",
    description: "Medical clinic with 3 consultation rooms, 40m²",
  },
  {
    id: 14,
    buildingId: 1,
    number: "CP-02",
    floor: "Level 1",
    categoryId: 5,
    size: 30,
    rent: 200000,
    deposit: 400000,
    status: "available",
    description: "Pharmacy with storage area, 30m²",
  },
  {
    id: 15,
    buildingId: 1,
    number: "CP-03",
    floor: "Level 2",
    categoryId: 5,
    size: 25,
    rent: 190000,
    deposit: 380000,
    status: "available",
    description: "Small clinic space, 25m²",
  },

  // === OTHER (Category 6) - 3 Rooms ===
  {
    id: 16,
    buildingId: 1,
    number: "OT-01",
    floor: "Level 2",
    categoryId: 6,
    size: 30,
    rent: 160000,
    deposit: 320000,
    status: "available",
    description: "Flexible commercial space, 30m²",
  },
  {
    id: 17,
    buildingId: 1,
    number: "OT-02",
    floor: "Level 2",
    categoryId: 6,
    size: 25,
    rent: 150000,
    deposit: 300000,
    status: "available",
    description: "Versatile unit for various businesses, 25m²",
  },
  {
    id: 18,
    buildingId: 1,
    number: "OT-03",
    floor: "Level 3",
    categoryId: 6,
    size: 20,
    rent: 140000,
    deposit: 280000,
    status: "available",
    description: "Multi-purpose commercial space, 20m²",
  },
];

const seedBookings: Booking[] = [
  { id: 1, tenantId: 1, roomId: 2, startDate: "2026-01-01", endDate: "2027-01-01", status: "active" },
  { id: 2, tenantId: 2, roomId: 7, startDate: "2026-03-01", endDate: "2027-03-01", status: "active" },
  { id: 3, tenantId: 3, roomId: 13, startDate: "2026-02-01", endDate: "2027-02-01", status: "active" },
  { id: 4, tenantId: 4, roomId: 3, startDate: "2026-04-01", endDate: "2027-04-01", status: "active" },
  { id: 5, tenantId: 5, roomId: 5, startDate: "2026-05-01", endDate: "2027-05-01", status: "active" },
];

const seedTenants: Tenant[] = [
  { id: 1, name: "John Doe", phone: "0788123456", email: "john@email.com", room: "G-01", business: "Doe Electronics", leaseStart: "2026-01-01", leaseEnd: "2027-01-01", userId: 2 },
  { id: 2, name: "Aline Uwase", phone: "0788222333", email: "aline@email.com", room: "2-01", business: "Uwase Consulting", leaseStart: "2026-03-01", leaseEnd: "2027-03-01", userId: 4 },
  { id: 3, name: "Eric Mugisha", phone: "0788444555", email: "eric@email.com", room: "5-01", business: "Mugisha Tech Hub", leaseStart: "2026-02-01", leaseEnd: "2027-02-01", userId: 5 },
  { id: 4, name: "Grace Mukamana", phone: "0788666777", email: "grace@email.com", room: "G-02", business: "Grace Restaurant", leaseStart: "2026-04-01", leaseEnd: "2027-04-01" },
  { id: 5, name: "Patrick Habimana", phone: "0788888999", email: "patrick@email.com", room: "1-01", business: "Habimana Law Firm", leaseStart: "2026-05-01", leaseEnd: "2027-05-01" },
  { id: 6, name: "Diane Ingabire", phone: "0788111222", email: "diane@email.com", room: "3-01", business: "Ingabire Fashion", leaseStart: "2026-01-15", leaseEnd: "2027-01-15" },
  { id: 7, name: "Claude Niyonzima", phone: "0788333444", email: "claude@email.com", room: "4-01", business: "Niyonzima Imports", leaseStart: "2026-06-01", leaseEnd: "2027-06-01" },
  { id: 8, name: "Vestine Uwimana", phone: "0788555666", email: "vestine@email.com", room: "B-01", business: "Uwimana Storage Co", leaseStart: "2026-02-15", leaseEnd: "2027-02-15" },
];

const seedPayments: Payment[] = [
  { id: 1, tenantId: 1, month: "2026-06", amount: 500000, status: "paid", paidDate: "2026-06-03", method: "bank", reference: "PAY-001" },
  { id: 2, tenantId: 2, month: "2026-06", amount: 450000, status: "paid", paidDate: "2026-06-05", method: "momo", reference: "PAY-002" },
  { id: 3, tenantId: 3, month: "2026-06", amount: 800000, status: "overdue" },
  { id: 4, tenantId: 4, month: "2026-06", amount: 650000, status: "paid", paidDate: "2026-06-01", method: "cash", reference: "PAY-004" },
  { id: 5, tenantId: 5, month: "2026-06", amount: 350000, status: "pending", paidDate: "2026-06-10", method: "bank", reference: "PAY-005" },
  { id: 6, tenantId: 6, month: "2026-06", amount: 500000, status: "paid", paidDate: "2026-06-02", method: "bank", reference: "PAY-006" },
  { id: 7, tenantId: 7, month: "2026-06", amount: 550000, status: "overdue" },
  { id: 8, tenantId: 8, month: "2026-06", amount: 150000, status: "paid", paidDate: "2026-06-08", method: "momo", reference: "PAY-008" },
  { id: 9, tenantId: 1, month: "2026-05", amount: 500000, status: "paid", paidDate: "2026-05-02", method: "bank", reference: "PAY-009" },
  { id: 10, tenantId: 2, month: "2026-05", amount: 450000, status: "paid", paidDate: "2026-05-04", method: "momo", reference: "PAY-010" },
  { id: 11, tenantId: 3, month: "2026-05", amount: 800000, status: "paid", paidDate: "2026-05-05", method: "bank", reference: "PAY-011" },
  { id: 12, tenantId: 4, month: "2026-05", amount: 650000, status: "paid", paidDate: "2026-05-01", method: "cash", reference: "PAY-012" },
];

const seedMaintenance: Maintenance[] = [
  { id: 1, room: "G-01", issue: "Leaking faucet in bathroom", priority: "medium", status: "open", createdAt: "2026-06-20", submittedBy: 2 },
  { id: 2, room: "2-01", issue: "AC not cooling properly", priority: "high", status: "in-progress", createdAt: "2026-06-18", assignedTo: "Maintenance Team A", submittedBy: 4 },
  { id: 3, room: "5-01", issue: "Broken window handle", priority: "low", status: "open", createdAt: "2026-06-25", submittedBy: 5 },
  { id: 4, room: "G-02", issue: "Kitchen exhaust fan malfunction", priority: "urgent", status: "in-progress", createdAt: "2026-06-15", assignedTo: "Maintenance Team B" },
  { id: 5, room: "1-01", issue: "Flickering lights in office", priority: "medium", status: "resolved", createdAt: "2026-06-10", resolvedAt: "2026-06-12", assignedTo: "Electrician" },
];

const seedInvoices: Invoice[] = [
  { id: 1, tenantId: 1, month: "2026-06", amount: 500000, dueDate: "2026-06-05", status: "paid", createdAt: "2026-06-01", createdBy: 3 },
  { id: 2, tenantId: 2, month: "2026-06", amount: 450000, dueDate: "2026-06-05", status: "paid", createdAt: "2026-06-01", createdBy: 3 },
  { id: 3, tenantId: 3, month: "2026-06", amount: 800000, dueDate: "2026-06-05", status: "overdue", createdAt: "2026-06-01", createdBy: 3 },
  { id: 4, tenantId: 7, month: "2026-06", amount: 550000, dueDate: "2026-06-05", status: "overdue", createdAt: "2026-06-01", createdBy: 3 },
];

const seedActivityLog: ActivityLog[] = [
  { id: 1, userId: 1, action: "login", details: "Super Admin logged in", timestamp: "2026-06-30T08:00:00" },
  { id: 2, userId: 1, action: "room_add", details: "Added room 5-02", timestamp: "2026-06-29T14:30:00" },
  { id: 3, userId: 3, action: "payment_record", details: "Recorded payment PAY-008", timestamp: "2026-06-28T10:15:00" },
];

const seedExpenses: Expense[] = [
  { id: 1, category: "Maintenance", amount: 120000, date: "2026-06-15", description: "Plumbing repairs for building", status: "paid", recordedBy: 3 },
  { id: 2, category: "Utilities", amount: 450000, date: "2026-06-20", description: "Monthly electricity bill", status: "paid", recordedBy: 3 },
];

// ─── Generic Helpers ─────────────────────────────────────────────
function read<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function write<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(data));
}

// ─── Database API ────────────────────────────────────────────────
export const db = {
  // Users
  getUsers: () => read<User[]>(KEYS.users, seedUsers),
  setUsers: (v: User[]) => write(KEYS.users, v),

  // Buildings
  getBuildings: () => read<Building[]>(KEYS.buildings, seedBuildings),
  setBuildings: (v: Building[]) => write(KEYS.buildings, v),

  // Categories
  getCategories: () => read<Category[]>(KEYS.categories, seedCategories),
  setCategories: (v: Category[]) => write(KEYS.categories, v),

  // Rooms
  getRooms: () => read<Room[]>(KEYS.rooms, seedRooms),
  setRooms: (v: Room[]) => write(KEYS.rooms, v),

  // Tenants
  getTenants: () => read<Tenant[]>(KEYS.tenants, seedTenants),
  setTenants: (v: Tenant[]) => write(KEYS.tenants, v),

  // Bookings
  getBookings: () => read<Booking[]>(KEYS.bookings, seedBookings),
  setBookings: (v: Booking[]) => write(KEYS.bookings, v),

  // Payments
  getPayments: () => read<Payment[]>(KEYS.payments, seedPayments),
  setPayments: (v: Payment[]) => write(KEYS.payments, v),

  // Maintenance
  getMaintenance: () => read<Maintenance[]>(KEYS.maintenance, seedMaintenance),
  setMaintenance: (v: Maintenance[]) => write(KEYS.maintenance, v),

  // Invoices
  getInvoices: () => read<Invoice[]>(KEYS.invoices, seedInvoices),
  setInvoices: (v: Invoice[]) => write(KEYS.invoices, v),

  // Expenses
  getExpenses: () => read<Expense[]>(KEYS.expenses, seedExpenses),
  setExpenses: (v: Expense[]) => write(KEYS.expenses, v),

  // POS
  getPOSCategories: () => read<POSCategory[]>(KEYS.posCategories, []),
  setPOSCategories: (v: POSCategory[]) => write(KEYS.posCategories, v),
  getPOSProducts: () => read<POSProduct[]>(KEYS.posProducts, []),
  setPOSProducts: (v: POSProduct[]) => write(KEYS.posProducts, v),
  getPOSSales: () => read<POSSale[]>(KEYS.posSales, []),
  setPOSSales: (v: POSSale[]) => write(KEYS.posSales, v),

  // Activity Log
  getActivityLog: () => read<ActivityLog[]>(KEYS.activityLog, seedActivityLog),
  addActivity: (userId: number, action: string, details: string) => {
    const log = read<ActivityLog[]>(KEYS.activityLog, seedActivityLog);
    const entry: ActivityLog = {
      id: nextId(log),
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    write(KEYS.activityLog, [...log, entry]);
  },
};

// ─── Auth API ────────────────────────────────────────────────────
export const auth = {
  currentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(KEYS.currentUser);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  isLoggedIn: () => auth.currentUser() !== null,

  login: (identifier: string, password: string): User | null => {
    const users = db.getUsers();
    const user = users.find(
      (u) =>
        (u.email === identifier || u.phone === identifier || u.name.toLowerCase() === identifier.toLowerCase() || identifier === "admin" && u.role === "super_admin" || identifier === "tenant" && u.role === "tenant" && u.id === 2 || identifier === "accountant" && u.role === "accountant") &&
        u.password === password
    );
    if (user) {
      window.localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
      db.addActivity(user.id, "login", `${user.name} logged in as ${formatRole(user.role)}`);
      return user;
    }
    return null;
  },

  logout: () => {
    const user = auth.currentUser();
    if (user) {
      db.addActivity(user.id, "logout", `${user.name} logged out`);
    }
    window.localStorage.removeItem(KEYS.currentUser);
  },

  isRole: (role: UserRole): boolean => {
    const user = auth.currentUser();
    return user?.role === role;
  },

  isSuperAdmin: (): boolean => auth.isRole("super_admin"),
  isTenant: (): boolean => auth.isRole("tenant"),
  isAccountant: (): boolean => auth.isRole("accountant"),

  can: (permission: Permission): boolean => {
    const user = auth.currentUser();
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(permission);
  },

  getTenantRecord: (): Tenant | null => {
    const user = auth.currentUser();
    if (!user || user.role !== "tenant") return null;
    const tenants = db.getTenants();
    return tenants.find((t) => t.userId === user.id) ?? null;
  },
};

// ─── Permissions ─────────────────────────────────────────────────
export type Permission =
  | "buildings.view"
  | "buildings.manage"
  | "categories.view"
  | "categories.manage"
  | "rooms.view"
  | "rooms.create"
  | "rooms.edit"
  | "rooms.delete"
  | "tenants.view"
  | "tenants.create"
  | "tenants.edit"
  | "tenants.delete"
  | "bookings.view"
  | "bookings.manage"
  | "payments.view"
  | "payments.create"
  | "payments.edit"
  | "payments.delete"
  | "maintenance.view"
  | "maintenance.create"
  | "maintenance.update"
  | "reports.view"
  | "analytics.view"
  | "settings.view"
  | "settings.edit"
  | "security.view"
  | "users.view"
  | "users.manage"
  | "invoices.view"
  | "invoices.create"
  | "expenses.view"
  | "expenses.create"
  | "expenses.edit"
  | "expenses.delete"
  | "pos.view"
  | "pos.manage"
  | "documents.view"
  | "messages.view"
  | "calendar.view"
  | "notifications.view";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    "buildings.view", "buildings.manage",
    "categories.view", "categories.manage",
    "rooms.view", "rooms.create", "rooms.edit", "rooms.delete",
    "tenants.view", "tenants.create", "tenants.edit", "tenants.delete",
    "bookings.view", "bookings.manage",
    "payments.view", "payments.create", "payments.edit", "payments.delete",
    "maintenance.view", "maintenance.create", "maintenance.update",
    "reports.view", "analytics.view",
    "settings.view", "settings.edit",
    "security.view",
    "users.view", "users.manage",
    "invoices.view", "invoices.create",
    "expenses.view", "expenses.create", "expenses.edit", "expenses.delete",
    "documents.view", "messages.view", "calendar.view", "notifications.view",
  ],
  tenant: [
    "payments.view", "payments.create",
    "pos.view", "pos.manage",
    "maintenance.view", "maintenance.create",
    "messages.view", "notifications.view",
    "documents.view", "calendar.view",
  ],
  accountant: [
    "rooms.view",
    "tenants.view",
    "payments.view", "payments.create", "payments.edit",
    "reports.view", "analytics.view",
    "invoices.view", "invoices.create",
    "expenses.view", "expenses.create",
    "notifications.view", "calendar.view",
  ],
};

// ─── Utilities ───────────────────────────────────────────────────
export function nextId<T extends { id: number }>(arr: T[]) {
  return arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1;
}

export function formatRole(role: UserRole): string {
  switch (role) {
    case "super_admin": return "Super Admin";
    case "tenant": return "Tenant";
    case "accountant": return "Accountant";
  }
}

export function getRoleColor(role: UserRole): { bg: string; text: string; border: string } {
  switch (role) {
    case "super_admin": return { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" };
    case "tenant": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
    case "accountant": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
  }
}

export const FLOORS = ["Basement", "Ground", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"] as const;