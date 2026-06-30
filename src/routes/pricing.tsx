import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect for small buildings exploring digital management.",
    features: ["Up to 10 rooms", "Basic tenant records", "Manual payments", "Email support"],
    cta: "Try the demo",
    highlight: false,
  },
  {
    name: "Professional",
    price: "RWF 49,000",
    period: "/month",
    desc: "Everything a mid-size complex needs to operate smoothly.",
    features: ["Unlimited rooms & tenants", "Full payments module", "Maintenance tickets", "Analytics dashboard", "Priority support"],
    cta: "Get started",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For multi-building portfolios and large operators.",
    features: ["Multi-building support", "Custom reports", "Role-based access", "Dedicated manager", "Onsite training"],
    cta: "Contact sales",
    highlight: false,
  },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — RG Market PMS" },
      { name: "description", content: "Simple, transparent pricing for buildings of every size in Kigali." },
      { property: "og:title", content: "Pricing — RG Market PMS" },
      { property: "og:description", content: "Free demo, professional and enterprise tiers." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="PRICING"
        title={<>Simple plans. <span className="rg-gradient-text">No surprises.</span></>}
        subtitle="Pick the plan that fits your building. Cancel any time."
      />

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 grid md:grid-cols-3 gap-6">
        {tiers.map((t, i) => (
          <div
            key={t.name}
            className={`relative p-8 rounded-3xl border bg-white animate-rg-fade-in ${
              t.highlight
                ? "border-transparent shadow-2xl shadow-blue-200/60 ring-2 ring-[#2563eb] -translate-y-2"
                : "border-slate-100 shadow-sm hover-lift"
            }`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#2563eb] text-white text-xs font-bold tracking-wider">
                MOST POPULAR
              </span>
            )}
            <div className="text-sm font-bold tracking-widest text-[#2563eb]">{t.name.toUpperCase()}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#0f172a]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{t.price}</span>
              {t.period && <span className="text-slate-500 text-sm">{t.period}</span>}
            </div>
            <p className="mt-3 text-sm text-slate-600">{t.desc}</p>
            <ul className="mt-6 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#0f172a]">
                  <Check className="h-4 w-4 mt-0.5 text-[#2563eb] shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to={t.name === "Enterprise" ? "/contact" : "/login"}
              className={`mt-8 block text-center px-5 py-3 rounded-xl font-semibold transition-colors ${
                t.highlight
                  ? "bg-[#2563eb] text-white hover:bg-[#1e50c9]"
                  : "bg-slate-100 text-[#0f172a] hover:bg-slate-200"
              }`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
