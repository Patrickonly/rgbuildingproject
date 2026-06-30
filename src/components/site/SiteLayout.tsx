import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Building2, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/60">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-200/50 group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-[#0f172a] text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>RG Market</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-medium">Building PMS</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${active
                    ? "text-[#2563eb] bg-blue-50/80"
                    : "text-slate-600 hover:text-[#0f172a] hover:bg-slate-50"
                  }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium px-5 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-all"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-[#2563eb] text-white hover:shadow-lg hover:shadow-blue-200 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            Open Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl animate-rg-fade-in">
          <nav className="px-5 py-4 space-y-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === n.to
                    ? "bg-blue-50 text-[#2563eb]"
                    : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl border border-slate-200 text-center text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl bg-[#2563eb] text-white text-center text-sm font-semibold"
              >
                Dashboard
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#0f172a] text-slate-300 mt-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#2563eb] flex items-center justify-center text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="font-bold text-white text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              RG Market PMS
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Smart management for modern commercial buildings in Kigali. Trusted by RG Market — a B+G+5 mixed-use complex in Kicukiro Center.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              ● System Online
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">Navigate</h4>
          <ul className="mt-4 space-y-3 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-white transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">System</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/features" className="hover:text-white transition-colors">
                Modules
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              Kicukiro Center, Kigali
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-500" />
              +250 788 000 000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-500" />
              hello@rgmarket.rw
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© 2026 RG Market Building. All rights reserved.</span>
          <span className="text-[#2563eb]/60 font-medium">
            Powered by Global Technologies Rwanda
          </span>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl animate-rg-blob" />
      <div
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl animate-rg-blob"
        style={{ animationDelay: "3s" }}
      />
      <div className="relative max-w-5xl mx-auto px-5 lg:px-8 py-20 lg:py-28 text-center">
        <span className="inline-block text-xs font-bold tracking-[0.2em] text-[#2563eb] bg-blue-50 px-3 py-1.5 rounded-full animate-rg-fade-in">
          {eyebrow}
        </span>
        <h1
          className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0f172a] animate-rg-fade-in"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            animationDelay: "0.1s",
          }}
        >
          {title}
        </h1>
        <p
          className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto animate-rg-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
