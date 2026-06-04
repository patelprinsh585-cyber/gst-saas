import { useState } from "react";
import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { Sparkles, Download, Share2, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { parseInvoiceText } from "@/lib/ai";
import { generateInvoicePdf } from "@/lib/pdf";
import type { Invoice, InvoiceItem } from "@/lib/types";
import { uid, formatINR, formatDate } from "@/utils/cn";
import InvoicePreview from "./InvoicePreview";

export default function InvoiceGenerator() {
  const { lang, user, addInvoice, invoices, customers, activeTab, plan } = useStore();
  const t = translations[lang];
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Invoice | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const thisMonthCount = invoices.filter(
    (i) => new Date(i.createdAt).getMonth() === new Date().getMonth()
  ).length;

  const canGenerate = user?.plan !== "free" || thisMonthCount < 10;

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;
    if (!canGenerate) {
      alert("Free plan limit reached (10 invoices/month). Please upgrade to Pro.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const parsed = parseInvoiceText(prompt);
    const subtotal = parsed.items.reduce((s, i) => s + i.qty * i.price, 0);
    const isInterState = parsed.customer.stateCode && parsed.customer.stateCode !== user.business.stateCode;
    const gstAmount = subtotal * (parsed.items[0]?.gstRate || 18) / 100;

    const invoice: Invoice = {
      id: uid(),
      invoiceNumber: `GG-${Date.now().toString().slice(-7)}`,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      customer: {
        id: uid(),
        ...parsed.customer,
        createdAt: new Date().toISOString(),
      },
      items: parsed.items,
      subtotal,
      cgst: isInterState ? 0 : gstAmount / 2,
      sgst: isInterState ? 0 : gstAmount / 2,
      igst: isInterState ? gstAmount : 0,
      total: subtotal + gstAmount,
      isInterState,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setDraft(invoice);
    setShowPreview(true);
    setLoading(false);
  };

  const handleSave = () => {
    if (!draft) return;
    addInvoice(draft);
    setDraft(null);
    setShowPreview(false);
    setPrompt("");
    alert("Invoice saved! ✨");
  };

  const handleDownload = () => {
    if (!draft || !user) return;
    generateInvoicePdf(draft, user.business);
  };

  const handleWhatsApp = () => {
    if (!draft || !user) return;
    const msg = `Hello ${draft.customer.name}! 👋\n\nInvoice #${draft.invoiceNumber}\nDate: ${formatDate(draft.date)}\nAmount: ${formatINR(draft.total)}\n\nPlease find the invoice details below:\n${draft.items.map((i) => `• ${i.description} x ${i.qty} = ${formatINR(i.qty * i.price)}`).join("\n")}\n\nSubtotal: ${formatINR(draft.subtotal)}\nGST: ${formatINR(draft.cgst + draft.sgst + draft.igst)}\n*Total: ${formatINR(draft.total)}*\n\nThank you for your business! 🙏\n- ${user.business.name}`;
    const phone = draft.customer.phone?.replace(/[^0-9+]/g, "") || "";
    const url = phone
      ? `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    if (!draft) return;
    const items = draft.items.map((i) => (i.id === id ? { ...i, [field]: value } : i));
    recalc(items);
  };

  const addItem = () => {
    if (!draft) return;
    const items = [...draft.items, { id: uid(), description: "New Item", qty: 1, price: 0, gstRate: 18, hsn: "9983" }];
    recalc(items);
  };

  const removeItem = (id: string) => {
    if (!draft || draft.items.length <= 1) return;
    const items = draft.items.filter((i) => i.id !== id);
    recalc(items);
  };

  const recalc = (items: InvoiceItem[]) => {
    if (!draft || !user) return;
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    const gstAmount = items.reduce((s, i) => s + i.qty * i.price * (i.gstRate / 100), 0);
    const isInterState = draft.customer.stateCode && draft.customer.stateCode !== user.business.stateCode;
    setDraft({
      ...draft,
      items,
      subtotal,
      cgst: isInterState ? 0 : gstAmount / 2,
      sgst: isInterState ? 0 : gstAmount / 2,
      igst: isInterState ? gstAmount : 0,
      total: subtotal + gstAmount,
      isInterState,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-500" />
          {t.newInvoice}
        </h1>
        <p className="text-[color:var(--text-muted)] mt-1 text-sm">Describe your invoice in plain English or Hindi. AI will do the rest.</p>
      </div>

      {/* AI Input */}
      <div className="card p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">AI Mode</span>
          <span className="chip ml-auto">GPT-ready</span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.aiPlaceholder}
          rows={3}
          className="input resize-none text-base leading-relaxed"
        />
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim() || !canGenerate}
            className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? t.generating : t.generate}
          </button>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Invoice Ramesh Kumar Delhi for 2 web design at 25000 each, 18% GST",
              "Bill Priya Sharma 1 logo design Rs 15000 with 18% GST",
              "Anand Electronics Pune, 5 laptops at Rs 45000, HSN 8471, 18% GST",
            ].map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[color:var(--text-muted)]"
              >
                {ex.slice(0, 45)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent invoices quick list */}
      {!showPreview && (
        <div className="card p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent drafts</h3>
            <span className="text-xs text-[color:var(--text-muted)]">{invoices.length} total</span>
          </div>
          <div className="space-y-2">
            {invoices.slice(0, 3).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onClick={() => { setDraft(inv); setShowPreview(true); }}>
                <div>
                  <div className="text-sm font-medium">{inv.customer.name}</div>
                  <div className="text-xs text-[color:var(--text-muted)]">#{inv.invoiceNumber} • {formatDate(inv.date)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{formatINR(inv.total)}</div>
                  <span className={`text-[10px] font-semibold uppercase ${inv.status === "paid" ? "text-emerald-500" : "text-amber-500"}`}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview / Edit */}
      {showPreview && draft && (
        <div className="card p-4 md:p-6 animate-in">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-bold text-lg">Review Invoice</h3>
              <p className="text-xs text-[color:var(--text-muted)]">Edit any field before saving</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleDownload} className="btn-ghost px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
                <Download className="w-4 h-4" /> PDF
              </button>
              <button onClick={handleWhatsApp} className="btn-ghost px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
                <Share2 className="w-4 h-4" /> WhatsApp
              </button>
              <button onClick={handleSave} className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>

          <InvoicePreview draft={draft} onUpdate={setDraft} onUpdateItem={updateItem} onAddItem={addItem} onRemoveItem={removeItem} />
        </div>
      )}
    </div>
  );
}
