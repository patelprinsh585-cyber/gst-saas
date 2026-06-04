import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { Zap, Sparkles, Receipt, Calculator, TrendingUp, Wallet, Users, History, Bot, ArrowRight, Check, Star, Shield, Globe } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function LandingPage() {
  const { lang, setLang, theme, setTheme, user } = useStore();
  const t = translations[lang];
  const [authOpen, setAuthOpen] = useState(false);

  const features = [
    { icon: Sparkles, title: "AI Invoice Generator", desc: "Type in plain English or Hindi. AI creates GST-compliant invoices instantly.", gradient: "from-indigo-500 to-blue-600" },
    { icon: Receipt, title: "PDF Export", desc: "Professional PDF invoices ready to send to clients or upload to GST portal.", gradient: "from-violet-500 to-purple-600" },
    { icon: Bot, title: "Tax Assistant", desc: "Ask anything about GST, ITR, HSN codes, or tax-saving strategies.", gradient: "from-pink-500 to-rose-600" },
    { icon: Calculator, title: "GST Calculator", desc: "Quick GST computation with inclusive/exclusive modes and rate slabs.", gradient: "from-amber-500 to-orange-600" },
    { icon: TrendingUp, title: "Sales Dashboard", desc: "Track monthly revenue, expenses, profit, and GST collected.", gradient: "from-emerald-500 to-teal-600" },
    { icon: Wallet, title: "Expense Tracker", desc: "Categorize expenses, track vendors, and optimize your cash flow.", gradient: "from-cyan-500 to-blue-600" },
    { icon: Users, title: "Customer Management", desc: "Store customer details, GSTIN, and track revenue per client.", gradient: "from-fuchsia-500 to-pink-600" },
    { icon: History, title: "Invoice History", desc: "Search, filter, and manage all your invoices in one place.", gradient: "from-sky-500 to-indigo-600" },
    { icon: Globe, title: "Multi-language", desc: "English and Hindi support. Works for businesses across India.", gradient: "from-teal-500 to-cyan-600" },
  ];

  const testimonials = [
    { name: "Rajesh Verma", role: "Freelance Designer, Delhi", text: "GST Genius AI saved me hours every month. I just type 'invoice Ramesh 25000' and it's done!", rating: 5 },
    { name: "Priya Patel", role: "Agency Owner, Mumbai", text: "The AI tax assistant is amazing. Asked about 44ADA and got a clear answer in seconds.", rating: 5 },
    { name: "Anand Electronics", role: "Retail Shop, Pune", text: "Finally a GST tool that's simple enough for my staff to use. PDF export is perfect.", rating: 5 },
  ];

  const faqs = [
    { q: "Is my data secure?", a: "Yes. We use Supabase with row-level security. Your invoices and customer data are encrypted and private." },
    { q: "Can I use it for my CA?", a: "Absolutely. Export PDF invoices and monthly reports for your accountant. GST-compliant format." },
    { q: "Do you support e-invoice?", a: "E-invoice generation is coming soon. For now, you can export invoices in the required format." },
    { q: "What about GSTR-1/3B?", a: "Track all invoices and GST collected. Export data for GSTR-1 and GSTR-3B filing." },
    { q: "Can I cancel anytime?", a: "Yes, cancel your subscription anytime. No lock-in period. Free plan always available." },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight">{t.appName}</div>
              <div className="text-[10px] text-[color:var(--text-muted)] font-medium -mt-0.5">GST • AI • India</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="text-[color:var(--text-muted)] hover:text-[color:var(--text)]">{t.features}</a>
            <a href="#pricing" className="text-[color:var(--text-muted)] hover:text-[color:var(--text)]">{t.pricing}</a>
            <a href="#testimonials" className="text-[color:var(--text-muted)] hover:text-[color:var(--text)]">{t.testimonials}</a>
            <a href="#faq" className="text-[color:var(--text-muted)] hover:text-[color:var(--text)]">{t.faq}</a>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="p-2 rounded-lg text-[color:var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5">
              <Globe className="w-4 h-4" />
            </button>
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="p-2 rounded-lg text-[color:var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5">
              {theme === "light" ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            </button>
            <button onClick={() => setAuthOpen(true)} className="btn-ghost px-4 py-2 rounded-xl font-semibold text-sm">
              {t.login}
            </button>
            <button onClick={() => setAuthOpen(true)} className="btn-primary px-4 py-2 rounded-xl font-semibold text-sm hidden md:inline-flex items-center gap-1.5">
              {t.getStarted} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 chip mb-6">
            <Sparkles className="w-3 h-3" />
            <span>AI-powered GST invoicing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-[color:var(--text-muted)] mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => setAuthOpen(true)} className="btn-primary px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-2 shadow-2xl shadow-indigo-500/30">
              {t.getStarted} <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setAuthOpen(true)} className="btn-ghost px-8 py-4 rounded-2xl font-bold text-base">
              Watch Demo
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[color:var(--text-muted)]">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Free forever plan</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> No credit card</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> GST compliant</div>
          </div>
        </div>

        {/* Hero mockup */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="card p-6 md:p-8 shadow-2xl animate-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">AI Mode</span>
              <span className="chip ml-auto">GPT-4 ready</span>
            </div>
            <div className="input p-4 text-left mb-4">
              <span className="text-[color:var(--text-muted)]">Invoice to Ramesh Kumar from Delhi for 2 web design services at ₹25,000 each with 18% GST</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">Generated Invoice</div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold">Ramesh Kumar</div>
                      <div className="text-xs text-[color:var(--text-muted)]">Delhi, India</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono">#GG-2026001</div>
                      <div className="text-xs text-[color:var(--text-muted)]">Jan 15, 2026</div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Web Design Service x 2</span><span>₹50,000</span></div>
                    <div className="flex justify-between text-[color:var(--text-muted)]"><span>CGST (9%)</span><span>₹4,500</span></div>
                    <div className="flex justify-between text-[color:var(--text-muted)]"><span>SGST (9%)</span><span>₹4,500</span></div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2" style={{ borderColor: "var(--border)" }}>
                      <span>Total</span><span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">₹59,000</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">Quick Actions</div>
                <div className="space-y-2">
                  <button className="w-full btn-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download PDF
                  </button>
                  <button className="w-full btn-ghost py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Share on WhatsApp
                  </button>
                  <button className="w-full btn-ghost py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Save to History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 chip mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need for GST</h2>
            <p className="text-[color:var(--text-muted)] text-lg max-w-2xl mx-auto">
              From AI invoice generation to tax advisory, all in one beautiful dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-[color:var(--text-muted)] text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 chip mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-[color:var(--text-muted)] text-lg">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Free", price: "₹0", features: ["10 invoices/month", "1 user", "PDF export", "WhatsApp sharing", "Basic support"] },
              { name: "Pro", price: "₹499", popular: true, features: ["Unlimited invoices", "1 user", "AI tax assistant", "Advanced reports", "Priority support", "Custom branding"] },
              { name: "Business", price: "₹1,499", features: ["Unlimited invoices", "Team access (5 users)", "Multi-branch", "API access", "Dedicated manager", "White-label"] },
            ].map((plan) => (
              <div key={plan.name} className={`card p-8 relative ${plan.popular ? "ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">{plan.name}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-[color:var(--text-muted)]">/month</span>
                </div>
                <button onClick={() => setAuthOpen(true)} className={`mt-6 w-full py-3 rounded-xl font-bold ${plan.popular ? "btn-primary" : "btn-ghost"}`}>
                  {t.getStarted}
                </button>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 chip mb-4">
              <Star className="w-3 h-3" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Indian businesses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-[color:var(--text-muted)]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 chip mb-4">
              <Shield className="w-3 h-3" />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group">
                <summary className="p-5 cursor-pointer font-semibold flex items-center justify-between list-none">
                  {f.q}
                  <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-sm text-[color:var(--text-muted)] leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-pink-500/10 border-indigo-500/20">
            <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to simplify GST?</h2>
            <p className="text-lg text-[color:var(--text-muted)] mb-8 max-w-xl mx-auto">
              Join thousands of Indian businesses using AI to create invoices, track expenses, and save on taxes.
            </p>
            <button onClick={() => setAuthOpen(true)} className="btn-primary px-8 py-4 rounded-2xl font-bold text-base inline-flex items-center gap-2 shadow-2xl shadow-indigo-500/30">
              {t.getStarted} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold">{t.appName}</span>
          </div>
          <p className="text-sm text-[color:var(--text-muted)]">
            © 2026 GST Genius AI. Made with ❤️ for Indian businesses.
          </p>
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
