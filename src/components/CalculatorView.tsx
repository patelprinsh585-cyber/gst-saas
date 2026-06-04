import { useState } from "react";
import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { Calculator, ArrowRightLeft } from "lucide-react";
import { formatINR } from "@/utils/cn";

type Mode = "exclusive" | "inclusive";

export default function CalculatorView() {
  const { lang } = useStore();
  const t = translations[lang];
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<Mode>("exclusive");
  const [type, setType] = useState<"intra" | "inter">("intra");

  let base = amount;
  let gst = 0;
  let total = 0;

  if (mode === "exclusive") {
    base = amount;
    gst = (amount * rate) / 100;
    total = amount + gst;
  } else {
    base = (amount * 100) / (100 + rate);
    gst = amount - base;
    total = amount;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Calculator className="w-7 h-7 text-indigo-500" />
          {t.calculator}
        </h1>
        <p className="text-[color:var(--text-muted)] mt-1 text-sm">Quick GST computation — inclusive or exclusive</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode("exclusive")}
              className={`py-2.5 rounded-xl text-sm font-semibold ${mode === "exclusive" ? "btn-primary" : "btn-ghost"}`}
            >
              Add GST
            </button>
            <button
              onClick={() => setMode("inclusive")}
              className={`py-2.5 rounded-xl text-sm font-semibold ${mode === "inclusive" ? "btn-primary" : "btn-ghost"}`}
            >
              Remove GST
            </button>
          </div>

          <div>
            <label className="label">{mode === "exclusive" ? "Amount (without GST)" : "Amount (with GST)"}</label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] font-semibold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="input pl-8 text-lg font-bold"
              />
            </div>
          </div>

          <div>
            <label className="label">GST Rate</label>
            <div className="grid grid-cols-5 gap-1.5 mt-1.5">
              {[0, 5, 12, 18, 28].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={`py-2 rounded-xl text-sm font-semibold ${rate === r ? "btn-primary" : "btn-ghost"}`}
                >
                  {r}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={28}
              step={0.25}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full mt-3 accent-indigo-500"
            />
            <div className="text-xs text-[color:var(--text-muted)] text-center">Custom: {rate}%</div>
          </div>

          <div>
            <label className="label">Supply Type</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <button
                onClick={() => setType("intra")}
                className={`py-2 rounded-xl text-sm font-semibold ${type === "intra" ? "btn-primary" : "btn-ghost"}`}
              >
                Intra-state (CGST + SGST)
              </button>
              <button
                onClick={() => setType("inter")}
                className={`py-2 rounded-xl text-sm font-semibold ${type === "inter" ? "btn-primary" : "btn-ghost"}`}
              >
                Inter-state (IGST)
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border-indigo-500/20">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRightLeft className="w-4 h-4 text-indigo-500" />
            <span className="label">Breakdown</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5">
              <span className="text-[color:var(--text-muted)] text-sm">Base Amount</span>
              <span className="font-bold text-lg">{formatINR(base)}</span>
            </div>
            {type === "intra" ? (
              <>
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5">
                  <span className="text-[color:var(--text-muted)] text-sm">CGST ({rate / 2}%)</span>
                  <span className="font-bold">{formatINR(gst / 2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5">
                  <span className="text-[color:var(--text-muted)] text-sm">SGST ({rate / 2}%)</span>
                  <span className="font-bold">{formatINR(gst / 2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5">
                <span className="text-[color:var(--text-muted)] text-sm">IGST ({rate}%)</span>
                <span className="font-bold">{formatINR(gst)}</span>
              </div>
            )}
            <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5">
              <span className="text-[color:var(--text-muted)] text-sm">Total GST</span>
              <span className="font-bold">{formatINR(gst)}</span>
            </div>
            <div className="h-px bg-black/10 dark:bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Total Amount</span>
              <span className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">{formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-3">💡 Quick Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { rate: "0%", desc: "Essentials (milk, salt, bread)" },
            { rate: "5%", desc: "Packaged food, tea, coffee" },
            { rate: "12%", desc: "Processed food, mobiles" },
            { rate: "18%", desc: "Services, IT, consulting, restaurants" },
            { rate: "28%", desc: "Luxury, cars, tobacco" },
            { rate: "3%", desc: "Gold, precious stones" },
            { rate: "0.25%", desc: "Rough diamonds" },
            { rate: "Comp.", desc: "1%/5%/6% composition scheme" },
          ].map((r, i) => (
            <div key={i} className="p-3 rounded-xl bg-black/5 dark:bg-white/5">
              <div className="font-bold text-indigo-500">{r.rate}</div>
              <div className="text-[color:var(--text-muted)] mt-0.5">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
