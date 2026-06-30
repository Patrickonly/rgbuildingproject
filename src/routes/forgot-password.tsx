import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Mail
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password · RG Market PMS" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy reset logic
    toast.success(`Password reset link sent!`, {
      description: `Check your email inbox`,
    });
    navigate({ to: "/login" });
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
            Reset password
          </h1>
          <p className="text-slate-500 mb-8 font-medium">Enter your email address and we'll send you a link to reset your password.</p>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-[#0f172a]">
                Email Address
              </label>
              <div className="mt-2 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Mail className="h-5 w-5 text-[#2563eb]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 text-[#0f172a] text-base bg-white transition-all"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#2563eb] text-white font-semibold hover:shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 text-base mt-2"
            >
              Send Reset Link
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Remember your password?{" "}
                <Link to="/login" className="font-semibold text-[#2563eb] hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
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
              Secure your{" "}
              <span className="text-white">account.</span>
            </h2>
            <div className="flex justify-center mt-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl max-w-sm w-4/5 border border-white/10 bg-white/5">
                <img
                  src="/images/forgot-password-illustration.png"
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
