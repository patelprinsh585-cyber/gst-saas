import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { Settings as SettingsIcon, Check, Sparkles, Globe, Moon, Sun, Building2 } from "lucide-react";

export default function SettingsView() {
  const { user, lang, setLang, theme, setTheme, updateBusiness, setPlan } = useStore();
  const t = translations[lang];

  if (!user) return null;

  const plans = [
    {
      id: "free" as const,
      name: "Free",
      price: "₹0",
      features: ["10 invoices/month", "1 user", "PDF export", "WhatsApp sharing", "Basic support"],
    },
    {
      id: "pro" as const,
      name: "Pro",
      price: "₹499",
      features: ["Unlimited invoices", "1 user", "AI tax assistant", "Advanced reports", "Priority support", "Custom branding"],
      popular: true,
    },
    {
      id: "business" as const,
      name: "Business",
      price: "₹1,499",
      features: ["Unlimited invoices", "Team access (5 users)", "Multi-branch", "API access", "Dedicated manager", "White-label"],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-indigo-500" />
          {t.settings}
        </h1>
        <p className="text-[color:var(--text-muted)] mt-1 text-sm">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Business info */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold">Business Profile</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="label">Business Name</label>
              <input className="input mt-1.5" defaultValue={user.business.name} onBlur={(e) => updateBusiness({ name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">GSTIN</label>
                <input className="input mt-1.5 font-mono text-xs" defaultValue={user.business.gstin} onBlur={(e) => updateBusiness({ gstin: e.target.value })} placeholder="22AAAAA0000A1Z5" />
              </div>
              <div>
                <label className="label">PAN</label>
                <input className="input mt-1.5 font-mono text-xs" defaultValue={user.business.pan} onBlur={(e) => updateBusiness({ pan: e.target.value })} placeholder="AAAAA0000A" />
              </div>
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input mt-1.5" defaultValue={user.business.address} onBlur={(e) => updateBusiness({ address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">State</label>
                <input className="input mt-1.5" defaultValue={user.business.state} onBlur={(e) => updateBusiness({ state: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input mt-1.5" defaultValue={user.business.phone} onBlur={(e) => updateBusiness({ phone: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-indigo-500" />
              <h3 className="font-semibold">{t.language}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: "en" as const, name: "English", flag: "🇬🇧" },
                { code: "hi" as const, name: "हिंदी", flag: "🇮🇳" },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`p-3 rounded-xl flex items-center gap-2 ${lang === l.code ? "btn-primary" : "btn-ghost"}`}
                >
                  <span className="text-xl">{l.flag}</span>
                  <span className="font-semibold text-sm">{l.name}</span>
                  {lang === l.code && <Check className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              {theme === "light" ? <Sun className="w-4 h-4 text-indigo-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              <h3 className="font-semibold">{t.theme}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setTheme("light")} className={`p-3 rounded-xl flex items-center gap-2 ${theme === "light" ? "btn-primary" : "btn-ghost"}`}>
                <Sun className="w-4 h-4" /> {t.light}
                {theme === "light" && <Check className="w-4 h-4 ml-auto" />}
              </button>
              <button onClick={() => setTheme("dark")} className={`p-3 rounded-xl flex items-center gap-2 ${theme === "dark" ? "btn-primary" : "btn-ghost"}`}>
                <Moon className="w-4 h-4" /> {t.dark}
                {theme === "dark" && <Check className="w-4 h-4 ml-auto" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          {t.pricing}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className={`card p-6 relative ${p.popular ? "ring-2 ring-indigo-500" : ""}`}>
              {p.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{p.price}</span>
                <span className="text-sm text-[color:var(--text-muted)]">/{t.month}</span>
              </div>
              <ul className="space-y-2 mt-5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setPlan(p.id)}
                disabled={user.plan === p.id}
                className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-sm ${
                  user.plan === p.id ? "btn-ghost" : p.popular ? "btn-primary" : "btn-ghost"
                }`}
              >
                {user.plan === p.id ? `✓ ${t.currentPlan}` : t.choosePlan}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
