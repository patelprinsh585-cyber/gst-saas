import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { formatINR, formatDate } from "@/utils/cn";
import { Search, Download, Share2, Trash2, CheckCircle2, Clock, AlertCircle, Receipt } from "lucide-react";
import { useState } from "react";
import { generateInvoicePdf } from "@/lib/pdf";
import type { Invoice } from "@/lib/types";

export default function InvoiceHistory() {
  const { invoices, lang, user, deleteInvoice, updateInvoiceStatus } = useStore();
  const t = translations[lang];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");

  const filtered = invoices.filter((i) => {
    const matchesQuery = !query || i.customer.name.toLowerCase().includes(query.toLowerCase()) || i.invoiceNumber.includes(query);
    const matchesFilter = filter === "all" || i.status === filter;
    return matchesQuery && matchesFilter;
  });

  const handleDownload = (inv: Invoice) => {
    if (!user) return;
    generateInvoicePdf(inv, user.business);
  };

  const handleWhatsApp = (inv: Invoice) => {
    if (!user) return;
    const msg = `Hi ${inv.customer.name}! Invoice #${inv.invoiceNumber} for ${formatINR(inv.total)} on ${formatDate(inv.date)}. Thanks! - ${user.business.name}`;
    const phone = inv.customer.phone?.replace(/[^0-9]/g, "") || "";
    const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Receipt className="w-7 h-7 text-indigo-500" />
          {t.history}
        </h1>
        <p className="text-[color:var(--text-muted)] mt-1 text-sm">{invoices.length} invoices total</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "paid", "pending", "overdue"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize ${filter === f ? "btn-primary" : "btn-ghost"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-xs uppercase text-[color:var(--text-muted)]">
              <tr>
                <th className="text-left px-5 py-3">Invoice</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Date</th>
                <th className="text-right px-5 py-3">Amount</th>
                <th className="text-center px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-4 font-mono text-xs font-semibold">#{inv.invoiceNumber}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{inv.customer.name}</div>
                    <div className="text-xs text-[color:var(--text-muted)]">{inv.customer.state || "—"}</div>
                  </td>
                  <td className="px-5 py-4 text-[color:var(--text-muted)] hidden md:table-cell">{formatDate(inv.date)}</td>
                  <td className="px-5 py-4 text-right font-bold">{formatINR(inv.total)}</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => updateInvoiceStatus(inv.id, inv.status === "paid" ? "pending" : "paid")}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        inv.status === "paid" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : inv.status === "pending" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-red-500/15 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {inv.status === "paid" ? <CheckCircle2 className="w-3 h-3" /> : inv.status === "pending" ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {inv.status}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleDownload(inv)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleWhatsApp(inv)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-emerald-500" title="Share WhatsApp">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirm("Delete this invoice?") && deleteInvoice(inv.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[color:var(--text-muted)]">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
