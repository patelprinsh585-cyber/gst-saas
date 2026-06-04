import { useState } from "react";
import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { Users, Plus, Trash2, Mail, Phone, Building2 } from "lucide-react";
import { uid, formatINR } from "@/utils/cn";
import type { Customer } from "@/lib/types";

export default function CustomersView() {
  const { customers, invoices, lang, addCustomer, deleteCustomer, updateCustomer } = useStore();
  const t = translations[lang];
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const [form, setForm] = useState<Partial<Customer>>({ name: "", email: "", phone: "", gstin: "", address: "", state: "" });

  const getCustomerRevenue = (id: string) =>
    invoices.filter((i) => i.customer.id === id).reduce((s, i) => s + i.total, 0);

  const submit = () => {
    if (!form.name?.trim()) return;
    if (editing) {
      updateCustomer({ ...editing, ...form } as Customer);
    } else {
      addCustomer({ id: uid(), ...form, createdAt: new Date().toISOString() } as Customer);
    }
    setForm({ name: "", email: "", phone: "", gstin: "", address: "", state: "" });
    setShowForm(false);
    setEditing(null);
  };

  const startEdit = (c: Customer) => {
    setEditing(c);
    setForm(c);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-500" />
            {t.customers}
          </h1>
          <p className="text-[color:var(--text-muted)] mt-1 text-sm">{customers.length} contacts</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({}); setShowForm(true); }} className="btn-primary px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> {t.addCustomer}
        </button>
      </div>

      {showForm && (
        <div className="card p-5 space-y-3 animate-in">
          <h3 className="font-semibold">{editing ? t.edit : t.addCustomer}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" placeholder="Name *" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input" placeholder="GSTIN" value={form.gstin || ""} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
            <input className="input" placeholder="State" value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <input className="input" placeholder="Address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button onClick={submit} className="btn-primary px-4 py-2 rounded-xl font-semibold text-sm">{t.save}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn-ghost px-4 py-2 rounded-xl font-semibold text-sm">{t.cancel}</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => {
          const revenue = getCustomerRevenue(c.id);
          return (
            <div key={c.id} className="card p-5 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-[color:var(--text-muted)] flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {c.state || "India"}
                    </div>
                  </div>
                </div>
                <button onClick={() => confirm("Delete customer?") && deleteCustomer(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5 text-sm">
                {c.email && <div className="flex items-center gap-2 text-[color:var(--text-muted)]"><Mail className="w-3.5 h-3.5" /> {c.email}</div>}
                {c.phone && <div className="flex items-center gap-2 text-[color:var(--text-muted)]"><Phone className="w-3.5 h-3.5" /> {c.phone}</div>}
                {c.gstin && <div className="text-xs font-mono text-[color:var(--text-muted)]">GSTIN: {c.gstin}</div>}
              </div>
              <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <span className="text-xs text-[color:var(--text-muted)]">Total revenue</span>
                <span className="font-bold text-sm">{formatINR(revenue)}</span>
              </div>
              <button onClick={() => startEdit(c)} className="mt-3 w-full btn-ghost py-2 rounded-lg text-xs font-semibold">{t.edit}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
