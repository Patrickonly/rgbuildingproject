import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — RG Market PMS" },
      { name: "description", content: "Get in touch with the RG Market team in Kicukiro Center, Kigali." },
      { property: "og:title", content: "Contact — RG Market PMS" },
      { property: "og:description", content: "Talk to the team behind RG Market PMS." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Message sent — we'll be in touch soon");
    setForm({ name: "", email: "", message: "" });
  };

  const info = [
    { icon: MapPin, label: "Address", value: "Kicukiro Center, Kigali, Rwanda" },
    { icon: Phone, label: "Phone", value: "+250 788 000 000" },
    { icon: Mail, label: "Email", value: "hello@rgmarket.rw" },
  ];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="GET IN TOUCH"
        title={<>Let's talk about your <span className="text-blue-300">building</span>.</>}
        subtitle="We'd love to hear from property owners, managers and partners."
        variant="blue"
      />

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {info.map((c, i) => (
            <div key={c.label} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex gap-4 animate-rg-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">{c.label}</div>
                <div className="mt-1 font-semibold text-[#0f172a]">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="lg:col-span-2 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4 animate-rg-fade-in">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#0f172a]">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#0f172a]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#0f172a]">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#2563eb] focus:outline-none resize-none"
              placeholder="Tell us about your building..."
            />
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] shadow-lg shadow-blue-200">
            <Send className="h-4 w-4" /> Send message
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
