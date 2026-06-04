import { useState } from "react";
import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { Bot, Send, Sparkles, User, Loader2 } from "lucide-react";
import { aiTaxAnswer } from "@/lib/ai";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function TaxAssistantView() {
  const { lang } = useStore();
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "👋 Namaste! I'm your AI Tax Assistant. Ask me anything about GST, ITR, HSN codes, composition scheme, tax-saving tips, or freelancing rules. Main Hindi bhi samajhta hoon!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const answer = aiTaxAnswer(userMsg);
    setMessages((m) => [...m, { role: "ai", content: answer }]);
    setLoading(false);
  };

  const suggestions = [
    "What is the composition scheme?",
    "GST rates for services?",
    "How to save tax u/s 80C?",
    "Freelancer tax rules 44ADA?",
    "When is GSTR-3B due?",
    "What is ITC?",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="w-7 h-7 text-indigo-500" />
          {t.taxAssistant}
        </h1>
        <p className="text-[color:var(--text-muted)] mt-1 text-sm">Your 24/7 GST & tax advisor</p>
      </div>

      <div className="card flex flex-col h-[calc(100vh-240px)] min-h-[500px]">
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""} animate-in`}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-br-sm"
                  : "bg-black/5 dark:bg-white/5 rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                  U
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 animate-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-black/5 dark:bg-white/5">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[color:var(--text-muted)]"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.askAi}
              className="input flex-1"
            />
            <button type="submit" disabled={!input.trim() || loading} className="btn-primary px-5 rounded-xl font-semibold text-sm flex items-center gap-1.5 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
