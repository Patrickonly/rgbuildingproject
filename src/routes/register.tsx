import { db, nextId, type Category, type Room, type Tenant, type User as UserModel } from "@/lib/pms-store";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Hash,
  IdCard,
  Layers,
  Lock,
  Mail,
  Phone,
  Store,
  Upload,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register · RG Market PMS" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Personal & Contact
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");

  // Step 2: Business Profile
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Retail / Shop");
  const [rdbNumber, setRdbNumber] = useState("");
  const [tinNumber, setTinNumber] = useState("");

  // Step 3: Security & Docs
  const [password, setPassword] = useState("");
  const [idDocumentName, setIdDocumentName] = useState("");
  const [tinDocumentName, setTinDocumentName] = useState("");

  // Step 4 & 5: Space & Payment
  const [categories, setCategories] = useState<Category[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [momoNumber, setMomoNumber] = useState("");

  useEffect(() => {
    setCategories(db.getCategories());
    setRooms(db.getRooms().filter(r => r.status === "available"));
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName || !email || !phone || !nationalId) return toast.error("Please fill in all personal details.");
      setStep(2);
    } else if (step === 2) {
      if (!businessName || !rdbNumber || !tinNumber) return toast.error("Please fill in all business details.");
      setStep(3);
    } else if (step === 3) {
      if (!categoryId || !roomNumber) return toast.error("Please select a category and room.");
      setStep(4);
    } else if (step === 4) {
      if (!password || !idDocumentName || !tinDocumentName) return toast.error("Please provide a password and upload required documents.");
      setStep(5);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momoNumber) {
      toast.error("Please enter Momo number to pay registration fee.");
      return;
    }

    const users = db.getUsers();

    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("Email is already registered.");
      return;
    }

    const newUserId = nextId(users);
    const newUser: UserModel = {
      id: newUserId,
      name: fullName,
      email,
      phone,
      password,
      role: "tenant",
      createdAt: new Date().toISOString().split("T")[0],
    };
    db.setUsers([...users, newUser]);

    const tenants = db.getTenants();
    const newTenant: Tenant = {
      id: nextId(tenants),
      name: fullName,
      phone,
      email,
      room: roomNumber,
      business: businessName,
      leaseStart: new Date().toISOString().split("T")[0],
      leaseEnd: "",
      userId: newUserId,
      tinNumber,
      tinDocument: tinDocumentName,
      nationalId,
      rdbNumber,
      businessType,
      status: "active",
    };
    db.setTenants([...tenants, newTenant]);

    const allRooms = db.getRooms();
    db.setRooms(allRooms.map(r => r.number === roomNumber ? { ...r, status: "occupied" } : r));

    toast.success(`Account created for ${fullName}!`, {
      description: `Your application is pending review. You can now log in.`,
    });
    navigate({ to: "/login" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'tin') => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      if (type === 'id') setIdDocumentName(fileName);
      if (type === 'tin') setTinDocumentName(fileName);
      toast.success(`${type === 'id' ? 'ID' : 'TIN'} document uploaded.`);
    }
  };

  // Group rooms by floor/level
  const getRoomsByFloor = () => {
    const grouped: Record<string, Room[]> = {};
    const filteredRooms = rooms.filter(r => {
      const roomCatId = r.categoryId?.toString() || "";
      return categoryId ? roomCatId === categoryId : true;
    });

    filteredRooms.forEach(room => {
      const floor = room.floor || "Unknown";
      if (!grouped[floor]) {
        grouped[floor] = [];
      }
      grouped[floor].push(room);
    });

    return grouped;
  };

  const stepsInfo = [
    { num: 1, title: "Personal Details", desc: "Contact and ID info" },
    { num: 2, title: "Business Profile", desc: "Company and tax info" },
    { num: 3, title: "Select Space", desc: "Category and room" },
    { num: 4, title: "Create Account", desc: "Password and docs" },
    { num: 5, title: "Payment", desc: "Registration fee" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* ── Left Side ── */}
      <div className="flex-[1.2] flex flex-col justify-center px-8 md:px-12 lg:px-16 py-10 overflow-y-auto">
        <div className="max-w-xl w-full mx-auto my-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div
                  className="font-bold text-xl text-[#0f172a]"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  RG Market
                </div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  Tenant Portal
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-500">
              Already a tenant?{" "}
              <Link to="/login" className="text-[#2563eb] font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>

          <h1
            className="text-3xl font-extrabold text-[#0f172a] mb-2"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Apply for commercial space
          </h1>
          <p className="text-slate-500 font-medium mb-8">
            Complete the form below to register your business at RG Market.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#2563eb] rounded-full z-0 transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>

            {stepsInfo.map((s, idx) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center group">
                  <div className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm ${isCompleted ? "bg-[#2563eb] text-white" :
                    isCurrent ? "bg-[#2563eb] text-white ring-4 ring-blue-100" :
                      "bg-white border-2 border-slate-200 text-slate-400"
                    }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </div>
                  <div className={`absolute top-12 whitespace-nowrap text-center transition-colors duration-300 ${isCurrent ? 'text-[#0f172a] font-semibold' : 'text-slate-400 font-medium'}`}>
                    <div className="text-xs">{s.title}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <form onSubmit={handleNext} className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><User className="h-4.5 w-4.5 text-slate-400" /></div>
                      <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all" placeholder="Legal representative name" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">National ID / Passport</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><IdCard className="h-4.5 w-4.5 text-slate-400" /></div>
                      <input required value={nationalId} onChange={(e) => setNationalId(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all" placeholder="16-digit ID or Passport No." />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><Phone className="h-4.5 w-4.5 text-slate-400" /></div>
                      <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all" placeholder="+250 780 000 000" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><Mail className="h-4.5 w-4.5 text-slate-400" /></div>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all" placeholder="contact@company.com" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button type="submit" className="px-8 py-3.5 rounded-xl bg-[#2563eb] text-white font-bold hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2">
                    Next: Business Profile <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Business Profile */}
            {step === 2 && (
              <form onSubmit={handleNext} className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business / Company Name</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><Briefcase className="h-4.5 w-4.5 text-slate-400" /></div>
                      <input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all" placeholder="Registered business name" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Category</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><Store className="h-4.5 w-4.5 text-slate-400" /></div>
                      <select required value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all appearance-none bg-white">
                        <option>Retail / Shop</option>
                        <option>Office / Corporate</option>
                        <option>Restaurant / Cafe</option>
                        <option>Warehouse / Storage</option>
                        <option>Clinic / Pharmacy</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">RDB Reg. Number</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><Hash className="h-4.5 w-4.5 text-slate-400" /></div>
                      <input required value={rdbNumber} onChange={(e) => setRdbNumber(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all" placeholder="Company code" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">TIN Number</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><FileText className="h-4.5 w-4.5 text-slate-400" /></div>
                      <input required value={tinNumber} onChange={(e) => setTinNumber(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all" placeholder="9-digit Tax ID" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                    <ChevronLeft className="h-5 w-5" /> Back
                  </button>
                  <button type="submit" className="flex-1 py-3.5 rounded-xl bg-[#2563eb] text-white font-bold hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2">
                    Next: Select Space <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Select Space - UPDATED with Level/Floor grouping */}
            {step === 3 && (
              <form onSubmit={handleNext} className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Category</label>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all bg-white"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map(c => (
                        <option key={c.id?.toString() || `cat-${Math.random()}`} value={c.id?.toString() || ""}>
                          {c.name || "Unnamed Category"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Room by Level/Floor</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><Layers className="h-4.5 w-4.5 text-slate-400" /></div>
                      <select
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        disabled={!categoryId}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all bg-white disabled:bg-slate-50"
                      >
                        <option value="">-- Select Room --</option>
                        {Object.entries(getRoomsByFloor()).map(([floor, floorRooms]) => (
                          <optgroup key={floor} label={`📍 Level ${floor}`}>
                            {floorRooms.map(r => (
                              <option key={r.id?.toString() || `room-${Math.random()}`} value={r.number || ""}>
                                Room {r.number || "Unknown"} - {r.rent?.toLocaleString() || 0} RWF/month
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    {!categoryId && (
                      <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Please select a category first to see available rooms
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                    <ChevronLeft className="h-5 w-5" /> Back
                  </button>
                  <button type="submit" className="flex-1 py-3.5 rounded-xl bg-[#2563eb] text-white font-bold hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2">
                    Next: Account <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Security & Docs */}
            {step === 4 && (
              <form onSubmit={handleNext} className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Upload ID / Passport</label>
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-[#2563eb] transition-all relative overflow-hidden group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {idDocumentName ? (
                          <div className="text-center px-4">
                            <CheckCircle2 className="w-6 h-6 text-[#2563eb] mx-auto mb-1" />
                            <p className="text-xs text-[#0f172a] font-semibold truncate max-w-[150px]">{idDocumentName}</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:text-[#2563eb] transition-colors" />
                            <p className="text-xs font-semibold text-slate-600">Select ID file</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG (Max 5MB)</p>
                          </>
                        )}
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, 'id')} />
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Upload TIN / RDB Cert</label>
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-[#2563eb] transition-all relative overflow-hidden group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {tinDocumentName ? (
                          <div className="text-center px-4">
                            <CheckCircle2 className="w-6 h-6 text-[#2563eb] mx-auto mb-1" />
                            <p className="text-xs text-[#0f172a] font-semibold truncate max-w-[150px]">{tinDocumentName}</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:text-[#2563eb] transition-colors" />
                            <p className="text-xs font-semibold text-slate-600">Select TIN file</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG (Max 5MB)</p>
                          </>
                        )}
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(e, 'tin')} />
                    </label>
                  </div>

                  <div className="md:col-span-2 mt-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Password</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><Lock className="h-4.5 w-4.5 text-slate-400" /></div>
                      <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all" placeholder="Create a secure password" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button type="button" onClick={() => setStep(3)} className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                    <ChevronLeft className="h-5 w-5" /> Back
                  </button>
                  <button type="submit" className="flex-1 py-3.5 rounded-xl bg-[#2563eb] text-white font-bold hover:bg-[#1e50c9] hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2">
                    Next: Payment <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 5: Payment */}
            {step === 5 && (
              <form onSubmit={onSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#2563eb]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Store className="w-8 h-8 text-[#2563eb]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2">Registration Fee</h3>
                  <p className="text-slate-500">Pay RWF 5,000 to complete your application.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">MoMo Phone Number</label>
                    <div className="mt-1.5 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2"><Phone className="h-4.5 w-4.5 text-slate-400" /></div>
                      <input required value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-[#2563eb] focus:bg-blue-50/30 text-[#0f172a] font-medium transition-all" placeholder="078 / 079..." />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button type="button" onClick={() => setStep(4)} className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                    <ChevronLeft className="h-5 w-5" /> Back
                  </button>
                  <button type="submit" className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                    Pay & Complete <CheckCircle2 className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Side ── */}
      <div className="hidden lg:flex flex-1 bg-[#2563eb] relative overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-[120px] animate-rg-blob" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[100px] animate-rg-blob" style={{ animationDelay: "5s" }} />

        <div className="flex items-center justify-center p-12 w-full">
          <div className="max-w-lg text-white">
            <h2
              className="text-4xl font-extrabold mb-6 leading-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Join the RG Market{" "}
              <span className="text-white">community.</span>
            </h2>
            <div className="flex justify-center mt-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl max-w-sm w-4/5 border border-white/10 bg-white/5">
                <img
                  src="/images/register-illustration.png"
                  alt="RG Market Illustration"
                  className="w-full h-auto mix-blend-overlay opacity-90 hover:opacity-100 transition-opacity"
                  style={{ mixBlendMode: 'normal' }}
                />
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Prime Location</h4>
                  <p className="text-blue-100/70 text-sm">Strategically located in Kicukiro Center with high foot traffic and visibility.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Modern Facilities</h4>
                  <p className="text-blue-100/70 text-sm">B+G+5 commercial complex with reliable power, fast internet, and 24/7 security.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}