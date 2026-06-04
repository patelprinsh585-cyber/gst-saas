import type { Invoice, InvoiceItem } from "@/lib/types";
import { formatINR, formatDate } from "@/utils/cn";
import { Trash2, Plus } from "lucide-react";

interface Props {
  draft: Invoice;
  onUpdate: (inv: Invoice) => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export default function InvoicePreview({ draft, onUpdate, onUpdateItem, onAddItem, onRemoveItem }: Props) {
  const gstTotal = draft.cgst + draft.sgst + draft.igst;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Invoice #</label>
          <input
            className="input mt-1.5"
            value={draft.invoiceNumber}
            onChange={(e) => onUpdate({ ...draft, invoiceNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="input mt-1.5"
            value={draft.date.slice(0, 10)}
            onChange={(e) => onUpdate({ ...draft, date: new Date(e.target.value).toISOString() })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="label mb-2">Bill To</div>
          <input
            className="input mb-2"
            value={draft.customer.name}
            onChange={(e) => onUpdate({ ...draft, customer: { ...draft.customer, name: e.target.value } })}
            placeholder="Customer Name"
          />
          <input
            className="input mb-2"
            value={draft.customer.address || ""}
            onChange={(e) => onUpdate({ ...draft, customer: { ...draft.customer, address: e.target.value } })}
            placeholder="Address"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              value={draft.customer.state || ""}
              onChange={(e) => onUpdate({ ...draft, customer: { ...draft.customer, state: e.target.value } })}
              placeholder="State"
            />
            <input
              className="input"
              value={draft.customer.gstin || ""}
              onChange={(e) => onUpdate({ ...draft, customer: { ...draft.customer, gstin: e.target.value } })}
              placeholder="GSTIN"
            />
          </div>
          <input
            className="input mt-2"
            value={draft.customer.phone || ""}
            onChange={(e) => onUpdate({ ...draft, customer: { ...draft.customer, phone: e.target.value } })}
            placeholder="Phone (for WhatsApp)"
          />
        </div>

        <div className="card p-4">
          <div className="label mb-2">Status</div>
          <div className="flex gap-2 mb-3">
            {(["paid", "pending", "overdue"] as const).map((s) => (
              <button
                key={s}
                onClick={() => onUpdate({ ...draft, status: s })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase ${
                  draft.status === s
                    ? s === "paid" ? "bg-emerald-500 text-white" : s === "pending" ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                    : "btn-ghost"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="label mb-1.5">Due Date</div>
          <input
            type="date"
            className="input"
            value={draft.dueDate?.slice(0, 10) || ""}
            onChange={(e) => onUpdate({ ...draft, dueDate: new Date(e.target.value).toISOString() })}
          />
          <div className="label mt-3 mb-1.5">Notes</div>
          <textarea
            className="input text-sm"
            rows={2}
            value={draft.notes || ""}
            onChange={(e) => onUpdate({ ...draft, notes: e.target.value })}
            placeholder="Optional note to customer..."
          />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="label">Line Items</div>
          <button onClick={onAddItem} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add item
          </button>
        </div>
        <div className="space-y-2">
          {draft.items.map((item) => (
            <div key={item.id} className="card p-3 grid grid-cols-12 gap-2 items-center">
              <input
                className="input col-span-12 md:col-span-5 text-sm"
                value={item.description}
                onChange={(e) => onUpdateItem(item.id, "description", e.target.value)}
                placeholder="Item description"
              />
              <input
                className="input col-span-4 md:col-span-2 text-sm"
                value={item.hsn || ""}
                onChange={(e) => onUpdateItem(item.id, "hsn", e.target.value)}
                placeholder="HSN"
              />
              <input
                type="number"
                className="input col-span-2 md:col-span-1 text-sm text-right"
                value={item.qty}
                onChange={(e) => onUpdateItem(item.id, "qty", Number(e.target.value))}
              />
              <input
                type="number"
                className="input col-span-3 md:col-span-2 text-sm text-right"
                value={item.price}
                onChange={(e) => onUpdateItem(item.id, "price", Number(e.target.value))}
              />
              <div className="hidden md:flex col-span-1 items-center justify-end text-sm text-[color:var(--text-muted)]">
                {item.gstRate}%
              </div>
              <div className="col-span-2 md:col-span-1 text-right text-sm font-semibold">
                {formatINR(item.qty * item.price)}
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="card p-4 min-w-[280px] space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[color:var(--text-muted)]">Subtotal</span>
            <span className="font-semibold">{formatINR(draft.subtotal)}</span>
          </div>
          {draft.isInterState ? (
            <div className="flex justify-between text-sm">
              <span className="text-[color:var(--text-muted)]">IGST</span>
              <span className="font-semibold">{formatINR(draft.igst)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--text-muted)]">CGST</span>
                <span className="font-semibold">{formatINR(draft.cgst)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--text-muted)]">SGST</span>
                <span className="font-semibold">{formatINR(draft.sgst)}</span>
              </div>
            </>
          )}
          <div className="h-px bg-black/10 dark:bg-white/10" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">{formatINR(draft.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
