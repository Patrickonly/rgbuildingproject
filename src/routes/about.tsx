import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Target, Eye, Heart, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — RG Market Building Management System" },
      { name: "description", content: "Learn about RG Market PMS — purpose-built for Kigali's modern commercial buildings." },
      { property: "og:title", content: "About — RG Market PMS" },
      { property: "og:description", content: "Purpose-built property management for Kigali's mixed-use complexes." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="ABOUT US"
        title={<>Building smarter commercial spaces in <span className="rg-gradient-text">Kigali</span>.</>}
        subtitle="RG Market PMS is the digital backbone of our B+G+5 mixed-use complex — and the same system is ready for any modern building."
      />

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-rg-fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Our story
          </h2>
          <p className="mt-5 text-slate-600 leading-relaxed">
            RG Market is a mixed-use commercial complex at the heart of Kicukiro Center. Managing
            30+ shops with paper, WhatsApp groups and spreadsheets simply wasn't scaling. So we
            built a clean, modern property management system tailored to how buildings really
            operate in Kigali.
          </p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Today, RG Market PMS handles rooms, tenants, payments and maintenance — all from one
            beautiful dashboard accessible on any device.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Target, title: "Mission", desc: "Make building management effortless." },
            { icon: Eye, title: "Vision", desc: "A digital twin for every Kigali complex." },
            { icon: Heart, title: "Values", desc: "Simplicity, transparency, reliability." },
            { icon: Award, title: "Quality", desc: "Built to professional SaaS standards." },
          ].map((c, i) => (
            <div key={c.title} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover-lift animate-rg-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-bold text-[#0f172a]">{c.title}</div>
              <div className="mt-1 text-sm text-slate-600">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Want to see it in action?
          </h2>
          <p className="mt-3 text-slate-600">Log in with the demo credentials to explore the full system.</p>
          <Link to="/login" className="mt-8 inline-block px-6 py-3 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] shadow-lg shadow-blue-200">
            Try the Dashboard
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
