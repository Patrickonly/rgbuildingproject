import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Building2, Users, Wallet, Wrench, BarChart3, Bell, ArrowRight } from "lucide-react";

const services = [
  { icon: Building2, title: "Room Management", desc: "Add, edit, and monitor every unit's availability and rent in real time." },
  { icon: Users, title: "Tenant Records", desc: "Onboard tenants, assign rooms, and keep contact info organized." },
  { icon: Wallet, title: "Payment Tracking", desc: "Record monthly payments, filter by period, and flag unpaid dues." },
  { icon: Wrench, title: "Maintenance Ops", desc: "Report and resolve building issues with full status history." },
  { icon: BarChart3, title: "Live Analytics", desc: "Revenue, occupancy and pending payments — always at a glance." },
  { icon: Bell, title: "Smart Notifications", desc: "Instant toasts keep your team informed on every change." },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — RG Market PMS" },
      { name: "description", content: "All-in-one property management services: rooms, tenants, payments, maintenance and analytics." },
      { property: "og:title", content: "Services — RG Market PMS" },
      { property: "og:description", content: "Everything a Kigali commercial building needs to run smoothly." },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="WHAT WE OFFER"
        title={<>Services built for <span className="rg-gradient-text">real buildings</span>.</>}
        subtitle="Every module is designed around how property managers actually operate in Kigali."
      />

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => (
          <div
            key={s.title}
            className="group p-7 rounded-2xl border border-slate-100 bg-white hover-lift animate-rg-fade-in"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="h-12 w-12 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-md shadow-blue-200 group-hover:scale-110 transition-transform">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-bold text-[#0f172a] text-lg">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            <Link to="/features" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] group-hover:gap-2 transition-all">
              See details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
