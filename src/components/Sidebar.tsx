import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import {
  Sparkles, Receipt, Calculator, TrendingUp, Wallet, Users, History, Bot, Settings,
  Moon, Sun, LogOut, Globe, Plus, ChevronDown, Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  { id: "dashboard", icon: TrendingUp, key: "dashboard" as const },
  { id: "invoice", icon: Sparkles, key: "newInvoice" as const },
  { id: "history", icon: History, key: "history" as const },
  { id: "customers", icon: Users, key: "customers" as const },
  { id: "expenses", icon: Wallet, key: "expenses" as const },
  { id: "calculator", icon: Calculator, key: "calculator" as const },
  { id: "sales", icon: Receipt, key: "sales" as const },
  { id: "tax", icon: Bot, key: "taxAssistant" as const },
  { id: "settings", icon: Settings, key: "settings" as const },
];

interface Props {
  children: React.ReactNode;
}

export default function Sidebar({ children }: Props) {
  const { user, logout, lang, setLang, theme, setTheme, activeTab, setActiveTab, invoices } = useStore();
  const t = translations[lang];

  const thisMonthCount = invoices.filter(
    (i) => new Date(i.createdAt).getMonth() === new Date().getMonth()
  ).length;

  const planLimit = user?.plan === "free" ? 10 : Infinity;
  const remaining = user?.plan === "free" ? Math.max(0, 10 - thisMonthCount) : Infinity;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r glass shrink-0">
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => useStore.getState().setView("landing")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[color:var(--surface-solid)]" />
            </div>
            <div>
              <div className="font-bold text-[15px] tracking-tight">{t.appName}</div>
              <div className="text-[10px] text-[color:var(--text-muted)] font-medium">GST • AI • India</div>
            </div>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-600 dark:text-indigo-300 shadow-sm"
                    : "text-[color:var(--text-muted)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] hover:text-[color:var(--text)]"
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                <span>{t[item.key]}</span>
                {item.id === "invoice" && (
                  <span className="ml-auto text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-1.5 py-0.5 rounded-md">AI</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Plan badge */}
        <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="rounded-xl p-3 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">Plan</span>
              <span className="chip !py-0.5 !px-2 text-[10px]">{user?.plan?.toUpperCase()}</span>
            </div>
            {user?.plan === "free" ? (
              <>
                <div className="text-xs text-[color:var(--text-muted)] mb-2">{remaining} / 10 {t.invoicesLeft}</div>
                <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${Math.min(100, (thisMonthCount / 10) * 100)}%` }} />
                </div>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="mt-3 w-full text-xs font-semibold py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:brightness-110"
                >
                  ⚡ {t.upgrade}
                </button>
              </>
            ) : (
              <div className="text-xs text-[color:var(--text-muted)]">Unlimited invoices ✨</div>
            )}
          </div>
        </div>

        {/* User */}
        <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5 p-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user?.name}</div>
              <div className="text-[11px] text-[color:var(--text-muted)] truncate">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[color:var(--text-muted)]"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <MobileNav />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function MobileNav() {
  const { lang, setLang, theme, setTheme, activeTab, setActiveTab, user, logout, setView } = useStore();
  const t = translations[lang];
  const current = navItems.find((n) => n.id === activeTab);
  const Icon = current?.icon || TrendingUp;

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 glass border-b" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setView("landing")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sm">{t.appName}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="p-2 rounded-lg text-[color:var(--text-muted)]"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg text-[color:var(--text-muted)]"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-[color:var(--text-muted)]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex overflow-x-auto scrollbar-thin gap-1 px-2 pb-2">
        {navItems.slice(0, 6).map((item) => {
          const I = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap",
                active ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300" : "text-[color:var(--text-muted)]"
              )}
            >
              <I className="w-3.5 h-3.5" />
              <span>{t[item.key]}</span>
            </button>
          );
        })}
        <MenuDropdown />
      </div>
    </div>
  );
}

function MenuDropdown() {
  const { lang, activeTab, setActiveTab } = useStore();
  const t = translations[lang];
  const extra = navItems.filter((n) => !["dashboard", "invoice", "history", "customers", "expenses", "calculator"].includes(n.id));
  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[color:var(--text-muted)]">
        <ChevronDown className="w-3.5 h-3.5" />
        More
      </button>
      <div className="absolute right-0 top-full mt-1 hidden group-focus-within:block group-hover:block card p-1 min-w-[160px] z-50">
        {extra.map((item) => {
          const I = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left",
                activeTab === item.id ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300" : "hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <I className="w-3.5 h-3.5" />
              {t[item.key]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
