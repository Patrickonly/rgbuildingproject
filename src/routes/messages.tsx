import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { MessageSquare, Send, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages · RG Market PMS" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "John Doe", subject: "Water Leak in Bathroom", time: "10:30 AM", unread: true },
    { id: 2, sender: "Aline Uwase", subject: "Rent Payment Confirmation", time: "Yesterday", unread: false },
  ]);

  return (
    <DashboardLayout title="Messages">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f172a]">Tenant Communications</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all">
            <Plus className="h-4 w-4" />
            New Message
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-5 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 cursor-pointer transition-all ${msg.unread ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {msg.sender.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[#0f172a]">{msg.sender}</h4>
                      {msg.unread && <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>}
                    </div>
                    <p className="text-[#0f172a] mt-1">{msg.subject}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 flex-shrink-0">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
