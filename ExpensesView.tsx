import { useState } from "react";
import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { Wallet, Plus, Trash2, Receipt, PieChart } from "lucide-react";
import { uid, formatINR, formatDate } from "@/utils/cn";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CATEGORIES = ["Software", "Hosting", "Travel", "Marketing", "Office", "Utilities", "Meals", "Equipment", "Other"];
const COLORS = ["#2041f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444", "#6366f1", "#64748b"];

export default function ExpensesView() {
  const { expenses, lang, addExpense, deleteExpense } = useStore();
  const t = translations[lang];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), category: "Software", description: "", amount: 0, vendor: "" });

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = CATEGORIES.map((cat) => ({
    name: cat,
    value: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.value > 0);

  const submit = () => {
    if (!form.description.trim() || !form.amount) return;
    addExpense({
      id: uid(),
      date: new Date(form.date).toISOString(),
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      vendor: form.vendor,
    });
    setForm({ date: new Date().toISOString().slice(0, 10), category: "Software", description: "", amount: 0, vendor: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="w-7 h-7 text-indigo-500" />
            {t.expenses}
          </h1>
          <p className="text-[color:var(--text-muted)] mt-1 text-sm">Track where your money goes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> {t.addExpense}
        </button>
      </div>

      {showForm && (
        <div className="card p-5 space-y-3 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input className="input" placeholder="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="input" placeholder="Vendor (optional)" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
            <input type="number" className="input" placeholder="Amount *" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
          </div>
          <div className="flex gap-2">
            <button onClick={submit} className="btn-primary px-4 py-2 rounded-xl font-semibold text-sm">{t.save}</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost px-4 py-2 rounded-xl font-semibold text-sm">{t.cancel}</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold">Total Expenses</h3>
          </div>
          <div className="text-3xl font-bold mt-3">{formatINR(total)}</div>
          <div className="text-xs text-[color:var(--text-muted)] mt-1">{expenses.length} entries</div>
        </div>
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold">By Category</h3>
          </div>
          <div className="h-52">
            {byCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {byCategory.map((e, i) => <Cell key={e.name} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--surface-solid)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => formatINR(v)} />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[color:var(--text-muted)] text-sm">No data yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-xs uppercase text-[color:var(--text-muted)]">
              <tr>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Description</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Vendor</th>
                <th className="text-right px-5 py-3">Amount</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-4 text-[color:var(--text-muted)]">{formatDate(e.date)}</td>
                  <td className="px-5 py-4">
                    <span className="chip">{e.category}</span>
                  </td>
                  <td className="px-5 py-4 font-medium">{e.description}</td>
                  <td className="px-5 py-4 hidden md:table-cell text-[color:var(--text-muted)]">{e.vendor || "—"}</td>
                  <td className="px-5 py-4 text-right font-bold">{formatINR(e.amount)}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => confirm("Delete?") && deleteExpense(e.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
