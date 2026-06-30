import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { CheckCircle2 } from "lucide-react";

const blocks = [
  {
    title: "Room Management",
    desc: "Full control over every unit in your building.",
    items: ["Add unlimited rooms", "Track rent amounts", "Toggle available / occupied", "Edit and delete rooms"],
  },
  {
    title: "Tenant System",
    desc: "Centralize tenant information and room assignments.",
    items: ["Tenant profiles with phone", "One-click room assignment", "Searchable tenant list", "Quick removal"],
  },
  {
    title: "Payments",
    desc: "Stay on top of monthly cash flow.",
    items: ["Record payments per tenant", "Filter by month", "Mark paid / unpaid instantly", "Revenue analytics"],
  },
  {
    title: "Maintenance",
    desc: "Never lose a building complaint again.",
    items: ["Report issues by room", "Open → in-progress → resolved", "Timestamped records", "Full history"],
  },
];

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — RG Market PMS" },
      { name: "description", content: "Explore every module: rooms, tenants, payments and maintenance — all in one professional dashboard." },
      { property: "og:title", content: "Features — RG Market PMS" },
      { property: "og:description", content: "Every feature of the RG Market property management system." },
    ],
  }),
  component: Features,
});

function Features() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="ALL FEATURES"
        title={<>Every module. <span className="text-blue-300">One dashboard.</span></>}
        subtitle="A complete look at the four pillars that power RG Market PMS."
        variant="blue"
      />

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 grid md:grid-cols-2 gap-6">
        {blocks.map((b, i) => (
          <div
            key={b.title}
            className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover-lift animate-rg-fade-in"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <h3 className="text-2xl font-extrabold text-[#0f172a]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              {b.title}
            </h3>
            <p className="mt-2 text-slate-600">{b.desc}</p>
            <ul className="mt-6 space-y-3">
              {b.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-sm text-[#0f172a]">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-5 text-center pb-20">
        <Link to="/login" className="inline-block px-6 py-3.5 rounded-xl bg-[#2563eb] text-white font-semibold shadow-xl shadow-blue-200 hover:bg-[#1e50c9]">
          Open the Dashboard
        </Link>
      </section>
    </SiteLayout>
  );
}
