import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/pms/DashboardLayout";
import { FileText, Upload, Download, Plus, Folder } from "lucide-react";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents · RG Market PMS" }] }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const documents = [
    { name: "Rental Agreement - A101", type: "PDF", size: "245 KB", date: "June 15, 2026" },
    { name: "Building Insurance Policy", type: "PDF", size: "1.2 MB", date: "May 20, 2026" },
    { name: "Tenant Handbook", type: "DOCX", size: "890 KB", date: "April 10, 2026" },
  ];

  return (
    <DashboardLayout title="Documents">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0f172a]">Document Management</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold hover:bg-[#1e50c9] transition-all">
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#2563eb] hover:bg-blue-50 transition-all">
            <Plus className="h-10 w-10 text-slate-400 mb-3" />
            <p className="text-slate-600 font-medium">Add New Folder</p>
          </div>
          {documents.map((doc, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-all">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              <h4 className="font-semibold text-[#0f172a] truncate">{doc.name}</h4>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-slate-500">{doc.type} • {doc.size}</p>
                <p className="text-xs text-slate-400">{doc.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
