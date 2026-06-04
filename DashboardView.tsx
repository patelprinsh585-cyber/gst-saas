import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { formatINR } from "@/utils/cn";
import { TrendingUp, IndianRupee, Receipt, Clock, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { subDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

export default function DashboardView() {
  const { invoices, expenses, lang, user, setActiveTab } = useStore();
  const t = translations[lang];

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const monthInvoices = invoices.filter(
    (i) => new Date(i.createdAt).getMonth() === thisMonth && new Date(i.createdAt).getFullYear() === thisYear
  );
  const monthExpenses = expenses.filter(
    (e) => new Date(e.date).getMonth() === thisMonth && new Date(e.date).getFullYear() === thisYear
  );

  const totalRevenue = monthInvoices.reduce((s, i) => s + i.total, 0);
  const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const pending = monthInvoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.total, 0);

  // Chart data — last 14 days
  const days = eachDayOfInterval({ start: subDays(now, 13), end: now });
  const chartData = days.map((day) => {
    const dayInvoices = invoices.filter((i) => isSameDay(new Date(i.createdAt), day));
    return {
      day: format(day, "d"),
      revenue: dayInvoices.reduce((s, i) => s + i.total, 0),
      count: dayInvoices.length,
    };
  });

  // Top customers
  const customerTotals: Record<string, { name: string; total: number }> = {};
  invoices.forEach((inv) => {
    const k = inv.customer.name;
    customerTotals[k] = customerTotals[k] || { name: k, total: 0 };
    customerTotals[k].total += inv.total;
  });
  const topCustomers = Object.values(customerTotals).sort((a, b) => b.total - a.total).slice(0, 4);

  const recent = invoices.slice(0, 5);

  const Stat = ({ icon: Icon, label, value, change, gradient }: any) => (
    <div className="card p-5 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">{label}</div>
        <div className="text-2xl font-bold mt-1 tracking-tight">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="card p-6 overflow-hidden relative">
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">{t.thisMonth}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Namaste, {user?.name?.split(" ")[0] || "there"} 🙏
          </h1>
          <p className="text-[color:var(--text-muted)] mt-1 text-sm">Here's your business at a glance.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Stat icon={IndianRupee} label={t.totalRevenue} value={formatINR(totalRevenue)} change={12} gradient="from-indigo-500 to-blue-600" />
        <Stat icon={Receipt} label={t.totalInvoices} value={monthInvoices.length} change={8} gradient="from-violet-500 to-purple-600" />
        <Stat icon={Clock} label={t.pending} value={formatINR(pending)} change={-4} gradient="from-amber-500 to-orange-500" />
        <Stat icon={TrendingUp} label="Net Profit" value={formatINR(netProfit)} change={18} gradient="from-emerald-500 to-teal-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Revenue — Last 14 days</h3>
              <p className="text-xs text-[color:var(--text-muted)]">Daily invoice totals</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{formatINR(totalRevenue)}</div>
              <div className="text-xs text-emerald-500 font-semibold">+12% vs last period</div>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2041f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2041f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="currentColor" opacity={0.3} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" opacity={0.3} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "var(--surface-solid)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [formatINR(v), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2041f1" strokeWidth={2.5} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-1">Top Customers</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-4">All-time revenue</p>
          <div className="space-y-3">
            {topCustomers.map((c, i) => {
              const max = topCustomers[0]?.total || 1;
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-[color:var(--text-muted)]">{formatINR(c.total)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        i === 0 ? "from-indigo-500 to-violet-500" : i === 1 ? "from-pink-500 to-rose-500" : i === 2 ? "from-amber-500 to-orange-500" : "from-emerald-500 to-teal-500"
                      }`}
                      style={{ width: `${(c.total / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Invoices</h3>
          <button onClick={() => setActiveTab("history")} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recent.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center font-bold text-sm text-indigo-600 dark:text-indigo-300">
                  {inv.customer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{inv.customer.name}</div>
                  <div className="text-xs text-[color:var(--text-muted)] truncate">#{inv.invoiceNumber} • {format(new Date(inv.date), "d MMM")}</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold">{formatINR(inv.total)}</div>
                <span className={`text-[10px] font-bold uppercase ${
                  inv.status === "paid" ? "text-emerald-500" : inv.status === "pending" ? "text-amber-500" : "text-red-500"
                }`}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
