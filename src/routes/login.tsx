import { db, formatRole, type User } from "@/lib/pms-store";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Lock,
  User as UserIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login · RG Market PMS" }] }),
  component: LoginPage,
});


function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"login" | "otp">("login");
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.getUsers();
    const user = users.find(
      (u) =>
        (u.email === username || u.phone === username || u.name.toLowerCase() === username.toLowerCase() || username === "admin" && u.role === "super_admin" || username === "tenant" && u.role === "tenant" && u.id === 2 || username === "accountant" && u.role === "accountant") &&
        u.password === password
    );
    if (user) {
      setTempUser(user);
      setStep("otp");
      toast.success("Password verified", { description: "Please enter your OTP to continue" });
    } else {
      toast.error("Invalid credentials", {
        description: "Check your username/email and password",
      });
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      return toast.error("Please enter a 6-digit OTP");
    }
    // Demo: Accept any 6 digit OTP
    if (tempUser) {
      // Actually log them in now
      window.localStorage.setItem("rg_current_user", JSON.stringify(tempUser));
      db.addActivity(tempUser.id, "login", `${tempUser.name} logged in via OTP`);
      toast.success(`Welcome back, ${tempUser.name}!`, {
        description: `Logged in as ${formatRole(tempUser.role)}`,
      });
      navigate({ to: "/dashboard" });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* ── Left Side ── */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-10">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div
                className="font-bold text-2xl text-[#0f172a]"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                RG Market
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Property Management System
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl font-extrabold text-[#0f172a] mb-2"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Welcome back
          </h1>

          {/* Form */}
          {step === "login" ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-[#0f172a]">
                  Username, Email, or Phone
                </label>
                <div className="mt-2 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <UserIcon className="h-5 w-5 text-[#2563eb]" />
                  </div>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 text-[#0f172a] text-base bg-white transition-all"
                    placeholder="Enter username, email, or phone"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0f172a]">
                  Password
                </label>
                <div className="mt-2 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Lock className="h-5 w-5 text-[#2563eb]" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 text-[#0f172a] text-base bg-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#2563eb] text-white font-semibold hover:shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 text-base"
              >
                Sign in
                <ArrowRight className="h-5 w-5" />
              </button>
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-100">
                <Link to="/forgot-password" className="text-sm font-semibold text-[#2563eb] hover:underline">
                  Forgot Password?
                </Link>
                <div className="text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link to="/register" className="font-semibold text-[#2563eb] hover:underline">
                    Sign up
                  </Link>
                </div>
              </div>

              {/* Demo Credentials Box */}
              <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col gap-2">
                <p className="text-xs font-bold text-[#2563eb] uppercase tracking-wider">Demo Accounts</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                  <div>
                    <span className="font-semibold">Admin:</span> admin<br />
                    <span className="font-semibold text-xs">Pass:</span> 123456
                  </div>
                  <div>
                    <span className="font-semibold">Tenant:</span> tenant<br />
                    <span className="font-semibold text-xs">Pass:</span> 123456
                  </div>
                </div>
              </div>

            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-6">
                  We've sent a 6-digit one-time password to your registered phone number.
                </p>
                <div className="flex justify-between gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 text-[#0f172a] bg-white transition-all"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Demo: Any 6 digits will be accepted.
                </p>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#2563eb] text-white font-semibold hover:shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 text-base"
              >
                Verify OTP & Login
              </button>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-[#0f172a]"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Right Side ── */}
      <div className="hidden lg:flex flex-1 bg-[#2563eb] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-[120px] animate-rg-blob" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[100px] animate-rg-blob" style={{ animationDelay: "5s" }} />

        <div className="flex items-center justify-center p-12 w-full">
          <div className="max-w-lg text-white">
            <h2
              className="text-4xl font-extrabold mb-6 leading-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Welcome back to{" "}
              <span className="text-white">RG Market.</span>
            </h2>
            <div className="flex justify-center mt-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl max-w-sm w-4/5 border border-white/10 bg-white/5">
                <img
                  src="/images/login-illustration.png"
                  alt="RG Market Illustration"
                  className="w-full h-auto mix-blend-overlay opacity-90 hover:opacity-100 transition-opacity"
                  style={{ mixBlendMode: 'normal' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
