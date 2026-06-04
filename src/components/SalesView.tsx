import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { formatINR } from "@/utils/cn";
import { TrendingUp, IndianRupee, Receipt } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export default function SalesView() {
  const { invoices, expenses, lang } = useStore();
  const t = translations[lang];

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthInvoices = invoices.filter((inv) => isWithinInterval(new Date(inv.date), { start, end }));
    const revenue = monthInvoices.reduce((s, i) => s + i.total, 0);
    const gst = monthInvoices.reduce((s, i) => s + i.cgst + i.sgst + i.igst, 0);
    const monthExpenses = expenses.filter((e) => isWithinInterval(new Date(e.date), { start, end }));
    const exp = monthExpenses.reduce((s, e) => s + e.amount, 0);
    return {
      month: format(date, "MMM"),
      revenue,
      gst,
      expenses: exp,
      profit: revenue - exp,
      count: monthInvoices.length,
    };
  });

  const totalRevenue = months.reduce((s, m) => s + m.revenue, 0);
  const totalGST = months.reduce((s, m) => s + m.gst, 0);
  const totalProfit = months.reduce((s, m) => s + m.profit, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-indigo-500" />
          {t.monthlySales}
        </h1>
        <p className="text-[color:var(--text-muted)] mt-1 text-sm">Last 6 months performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-[color:var(--text-muted)]">
            <IndianRupee className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold mt-2">{formatINR(totalRevenue)}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-[color:var(--text-muted)]">
            <Receipt className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">GST Collected</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-indigo-500">{formatINR(totalGST)}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-[color:var(--text-muted)]">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Net Profit</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-emerald-500">{formatINR(totalProfit)}</div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Revenue vs Expenses</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={months}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.15)" />
              <XAxis dataKey="month" stroke="currentColor" opacity={0.4} fontSize={11} tickLine={false} />
              <YAxis stroke="currentColor" opacity={0.4} fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "var(--surface-solid)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => formatINR(v)} />
              <Bar dataKey="revenue" fill="#2041f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Profit Trend</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={months}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.15)" />
              <XAxis dataKey="month" stroke="currentColor" opacity={0.4} fontSize={11} tickLine={false} />
              <YAxis stroke="currentColor" opacity={0.4} fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "var(--surface-solid)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => formatINR(v)} />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-xs uppercase text-[color:var(--text-muted)]">
              <tr>
                <th className="text-left px-5 py-3">Month</th>
                <th className="text-right px-5 py-3">Invoices</th>
                <th className="text-right px-5 py-3">Revenue</th>
                <th className="text-right px-5 py-3">GST</th>
                <th className="text-right px-5 py-3">Expenses</th>
                <th className="text-right px-5 py-3">Profit</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.month} className="border-t hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-4 font-semibold">{m.month}</td>
                  <td className="px-5 py-4 text-right">{m.count}</td>
                  <td className="px-5 py-4 text-right font-bold">{formatINR(m.revenue)}</td>
                  <td className="px-5 py-4 text-right text-indigo-500">{formatINR(m.gst)}</td>
                  <td className="px-5 py-4 text-right text-pink-500">{formatINR(m.expenses)}</td>
                  <td className={`px-5 py-4 text-right font-bold ${m.profit >= 0 ? "text-emerald-500" : "text-red-500"}`}>{formatINR(m.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
