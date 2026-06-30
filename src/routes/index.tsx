import { SiteLayout } from "@/components/site/SiteLayout";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Crown,
  DoorOpen,
  Layers,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Utensils,
  Wrench,
  Zap
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RG Market — Smart Building Management for Kigali" },
      {
        name: "description",
        content:
          "Professional property management system for RG Market Building in Kigali: rooms, tenants, payments, maintenance, and role-based access — all in one dashboard.",
      },
      { property: "og:title", content: "RG Market Building Management System" },
      {
        property: "og:description",
        content:
          "Manage RG Market Building in Kigali efficiently with our modern property management system.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <SiteLayout>
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#2563eb] min-h-[90vh] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-[120px] animate-rg-blob" />
        <div
          className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px] animate-rg-blob"
          style={{ animationDelay: "5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-300/10 blur-[150px] animate-rg-blob"
          style={{ animationDelay: "10s" }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-0 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-white">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-blue-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full animate-rg-fade-in backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" /> KIGALI ·
              KICUKIRO CENTER
            </span>
            <h1
              className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] animate-rg-fade-in"
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                animationDelay: "0.1s",
              }}
            >
              Premium Commercial Space {" "}
              <span className="text-white">in Kigali.</span>
            </h1>
            <p
              className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed animate-rg-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Discover the perfect location for your business at RG Market. A modern B+G+5 complex in the heart of Kicukiro Center offering retail shops, executive offices, and premium facilities.
            </p>
            <div
              className="mt-10 flex flex-wrap gap-4 animate-rg-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-[#2563eb] font-bold shadow-xl shadow-black/10 hover:-translate-y-1 transition-all hover:shadow-2xl text-base"
              >
                Apply for Space
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm font-semibold text-white hover:bg-white/10 transition-all text-base"
              >
                Tenant Login
              </Link>
            </div>
            <div
              className="mt-12 flex items-center gap-6 text-sm text-white/50 animate-rg-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> High Visibility
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 24/7 Security
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Dedicated Parking
              </div>
            </div>
          </div>

          {/* Right — Hero Visual */}
          <div
            className="relative animate-rg-fade-in-slow"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-3xl blur-2xl scale-105" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-950/50">
                <img
                  src="/images/rg-building-1.jpg"
                  alt="RG Market Building in Kigali"
                  className="w-full h-auto"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2563eb]/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-[#2563eb]">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        RG Market Building
                      </div>
                      <div className="text-xs text-blue-100">
                        B+G+5 · Kicukiro Center, Kigali
                      </div>
                    </div>
                    <div className="ml-auto px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                value: "B+G+5",
                label: "Building Floors",
                icon: Layers,
                color: "text-[#2563eb]",
                bg: "bg-blue-50",
              },
              {
                value: "14+",
                label: "Commercial Units",
                icon: DoorOpen,
                color: "text-violet-600",
                bg: "bg-violet-50",
              },
              {
                value: "Prime",
                label: "Location",
                icon: Crown,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                value: "24/7",
                label: "Security",
                icon: ShieldCheck,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
            ].map((s, i) => (
              <div
                key={s.label}
                className="flex items-center gap-4 animate-rg-count"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}
                >
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <div
                    className={`text-2xl md:text-3xl font-extrabold ${s.color}`}
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#2563eb] bg-blue-50 px-3 py-1.5 rounded-full">
            <Zap className="h-3 w-3" /> WHY CHOOSE RG MARKET
          </span>
          <h2
            className="mt-5 text-3xl md:text-5xl font-extrabold text-[#0f172a]"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            The best location to grow{" "}
            <span className="rg-gradient-text">your business.</span>
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            RG Market Building offers unparalleled advantages for retail and corporate tenants in Kigali.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Crown,
              title: "Prime Location",
              desc: "Located in the bustling Kicukiro Center, guaranteeing high foot traffic and excellent visibility for your brand.",
              color: "from-blue-500 to-blue-600",
              iconBg: "bg-blue-50",
              iconColor: "text-[#2563eb]",
            },
            {
              icon: Building2,
              title: "Modern Facilities",
              desc: "A brand new B+G+5 commercial complex built to international standards with modern amenities.",
              color: "from-emerald-500 to-emerald-600",
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
            },
            {
              icon: Layers,
              title: "Flexible Spaces",
              desc: "From ground-floor retail shops to upper-level corporate offices, we have spaces tailored to your needs.",
              color: "from-amber-500 to-amber-600",
              iconBg: "bg-amber-50",
              iconColor: "text-amber-600",
            },
            {
              icon: ShieldCheck,
              title: "Secure & Accessible",
              desc: "24/7 security with CCTV surveillance and secure access control for peace of mind.",
              color: "from-violet-500 to-violet-600",
              iconBg: "bg-violet-50",
              iconColor: "text-violet-600",
            },
            {
              icon: Zap,
              title: "Reliable Utilities",
              desc: "Uninterrupted power supply, high-speed fiber internet, and constant water availability.",
              color: "from-cyan-500 to-cyan-600",
              iconBg: "bg-cyan-50",
              iconColor: "text-cyan-600",
            },
            {
              icon: Wrench,
              title: "On-Site Management",
              desc: "Dedicated property management team using a modern portal to resolve any issues instantly.",
              color: "from-rose-500 to-rose-600",
              iconBg: "bg-rose-50",
              iconColor: "text-rose-600",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group relative p-8 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 hover-lift animate-rg-fade-in overflow-hidden"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Hover gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
              />
              <div className="relative">
                <div
                  className={`h-14 w-14 rounded-2xl ${f.iconBg} flex items-center justify-center ${f.iconColor} mb-6`}
                >
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
                <div className="mt-5 text-sm font-semibold text-[#2563eb] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ROLES SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full">
              <Building2 className="h-3 w-3" /> SPACES
            </span>
            <h2
              className="mt-5 text-3xl md:text-5xl font-extrabold text-[#0f172a]"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Types of Spaces{" "}
              <span className="text-[#2563eb]">Available.</span>
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Whether you need a storefront or a quiet office, we have the perfect fit.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                role: "Retail Shops",
                icon: Store,
                desc: "High-visibility storefronts on the ground floor perfect for retail, boutiques, and customer-facing businesses.",
                color:
                  "bg-[#2563eb]",
                bgLight: "bg-violet-50",
                textColor: "text-violet-700",
                borderColor: "border-violet-200",
                permissions: [
                  "Ground & First Floor",
                  "Large Glass Frontages",
                  "High Foot Traffic",
                  "Dedicated Signage Space",
                ],
                credential: "RWF 300,000 / month",
              },
              {
                role: "Corporate Offices",
                icon: Briefcase,
                desc: "Professional office spaces on upper floors providing a quiet, productive environment with great views.",
                color:
                  "bg-[#2563eb]",
                bgLight: "bg-emerald-50",
                textColor: "text-emerald-700",
                borderColor: "border-emerald-200",
                permissions: [
                  "Floors 2 to 5",
                  "Natural Lighting",
                  "High-Speed Internet Ready",
                  "Access to Meeting Rooms",
                ],
                credential: "RWF 150,000 / month",
              },
              {
                role: "Restaurants & Cafes",
                icon: Utensils,
                desc: "Specially designed spaces with proper ventilation and plumbing connections for food service businesses.",
                color:
                  "bg-[#2563eb]",
                bgLight: "bg-amber-50",
                textColor: "text-amber-700",
                borderColor: "border-amber-200",
                permissions: [
                  "Rooftop & Ground Options",
                  "Commercial Ventilation",
                  "Enhanced Plumbing",
                  "Outdoor Seating Area",
                ],
                credential: "RWF 400,000 / month",
              },
            ].map((r, i) => (
              <div
                key={r.role}
                className="group relative rounded-3xl bg-white border border-slate-100 overflow-hidden hover-lift animate-rg-fade-in"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {/* Header gradient */}
                <div
                  className={`${r.color} p-6 text-white`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <r.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{r.role}</h3>
                      <p className="text-sm text-white/70">{r.desc}</p>
                    </div>
                  </div>
                </div>
                {/* Permissions */}
                <div className="p-6 space-y-3">
                  {r.permissions.map((p) => (
                    <div
                      key={p}
                      className="flex items-center gap-2.5 text-sm text-slate-700"
                    >
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${r.textColor}`}
                      />
                      {p}
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 mb-2">
                      Starting from
                    </p>
                    <code
                      className={`text-xs font-mono ${r.bgLight} ${r.textColor} px-3 py-1.5 rounded-lg border ${r.borderColor}`}
                    >
                      {r.credential}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-[#2563eb]">
            APPLICATION PROCESS
          </span>
          <h2
            className="mt-3 text-3xl md:text-5xl font-extrabold text-[#0f172a]"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            How to secure your space.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Apply Online",
              desc: "Browse available spaces and submit your application with necessary business documents directly through our portal.",
              icon: DoorOpen,
            },
            {
              step: "02",
              title: "Review & Approval",
              desc: "Our management team reviews your application. Upon approval, you pay the registration fee to secure the room.",
              icon: ShieldCheck,
            },
            {
              step: "03",
              title: "Move In",
              desc: "Sign your digital lease, receive your keys, and move your business into Kigali's premier commercial hub.",
              icon: Building2,
            },
          ].map((s, i) => (
            <div
              key={s.step}
              className="relative text-center p-8 rounded-3xl bg-white border border-slate-100 hover-lift animate-rg-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-[#2563eb] text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-200">
                {s.step}
              </div>
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2563eb] mx-auto mt-4 mb-6">
                <s.icon className="h-7 w-7" />
              </div>
              <h3
                className="text-xl font-bold text-[#0f172a] mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {s.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHY US
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#2563eb] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-28 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-blue-200">
              WHY RG MARKET PMS
            </span>
            <h2
              className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Built specifically for{" "}
              <span className="text-white">RG Market.</span>
            </h2>
            <p className="mt-5 text-blue-100 text-lg leading-relaxed">
              A dedicated property management system designed from the ground up
              for your B+G+5 commercial building in Kicukiro Center, Kigali.
            </p>
            <ul className="mt-10 space-y-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Role-based security",
                  desc: "Three access levels protect tenant and financial data with granular permissions.",
                },
                {
                  icon: BarChart3,
                  title: "Live analytics",
                  desc: "Real-time occupancy, revenue trends, and maintenance reports at a glance.",
                },
                {
                  icon: Sparkles,
                  title: "Modern & intuitive",
                  desc: "Clean interface designed for efficiency — your team will love using it daily.",
                },
              ].map((p) => (
                <li key={p.title} className="flex gap-4">
                  <div className="shrink-0 h-12 w-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{p.title}</div>
                    <div className="text-sm text-blue-100 mt-0.5">
                      {p.desc}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl scale-105" />
            <div className="relative">
              <img
                src="/images/rg-building-2.jpg"
                alt="Professional office space"
                className="rounded-3xl w-full h-[500px] object-cover border border-white/20 shadow-2xl shadow-black/20"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-[#0f172a] p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-rg-bounce">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-[#2563eb]" />
                </div>
                <div>
                  <div className="font-bold text-lg">RG Market</div>
                  <div className="text-xs text-slate-500">Premium Commercial Space</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ABOUT US
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-28 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-[#2563eb]/5 rounded-3xl blur-2xl scale-105" />
            <img
              src="/images/rg-building-3.jpg"
              alt="RG Market Building"
              className="relative rounded-3xl w-full h-[500px] object-cover border border-slate-200 shadow-xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-xs font-bold tracking-[0.2em] text-[#2563eb]">
              ABOUT RG MARKET
            </span>
            <h2
              className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight text-[#0f172a]"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Premium commercial spaces in the heart of Kigali.
            </h2>
            <p className="mt-5 text-slate-600 text-lg leading-relaxed">
              Located in Kicukiro Center, RG Market is a B+G+5 modern commercial building offering state-of-the-art facilities for businesses of all sizes. From prime retail shops on the ground floor to executive offices on the upper levels, we provide an environment designed for success.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-extrabold text-[#2563eb]">6</div>
                <div className="text-sm font-semibold text-slate-500 mt-1">Floors of Space</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#2563eb]">24/7</div>
                <div className="text-sm font-semibold text-slate-500 mt-1">Security & Access</div>
              </div>
            </div>
            <Link
              to="/login"
              className="mt-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2563eb] text-white font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              Access Portal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIAL
      ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-28">
        <div className="relative bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2563eb]" />
          <div className="p-10 md:p-14">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p
              className="mt-6 text-2xl md:text-3xl text-[#0f172a] leading-relaxed font-medium"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              "Managing our building used to be chaotic with paper records and
              spreadsheets. Now everything is in one clean, organized system. We
              can track every room, every tenant, and every payment instantly."
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
                RG
              </div>
              <div>
                <div className="font-bold text-[#0f172a] text-lg">
                  RG Market Admin
                </div>
                <div className="text-sm text-slate-500">
                  Building Manager · Kicukiro Center, Kigali
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-[#2563eb] p-12 md:p-20 text-white text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          <div className="relative">
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Ready to move your business <br className="hidden md:block" />
              to RG Market?
            </h2>
            <p className="mt-5 text-white/70 max-w-xl mx-auto text-lg">
              Apply online today and secure your spot in Kicukiro's most sought-after commercial building.
            </p>
            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-white text-[#0f172a] font-bold hover:bg-blue-50 transition-all shadow-xl shadow-black/10 text-base"
              >
                Apply Now
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all text-base"
              >
                Tenant Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
