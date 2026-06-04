import { useState } from "react";
import { useStore } from "@/store";
import { translations } from "@/lib/i18n";
import { Mail, Lock, X, Zap } from "lucide-react";
import type { User } from "@/lib/types";
import { uid } from "@/utils/cn";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, lang } = useStore();
  const t = translations[lang];

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user: User = {
        id: uid(),
        name: name || email.split("@")[0] || "User",
        email: email || "demo@gstgenius.ai",
        provider: "email",
        business: {
          name: "Your Business",
          gstin: "",
          address: "Mumbai, Maharashtra",
          state: "Maharashtra",
          stateCode: "27",
          email,
        },
        plan: "free",
        invoicesThisMonth: 0,
      };
      login(user);
      setLoading(false);
      onClose();
    }, 600);
  };

  const googleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const user: User = {
        id: uid(),
        name: "Priya Patel",
        email: "priya.patel@gmail.com",
        avatar: "",
        provider: "google",
        business: {
          name: "Priya Design Studio",
          gstin: "27AABCP1234M1Z5",
          address: "Andheri West, Mumbai",
          state: "Maharashtra",
          stateCode: "27",
          email: "priya.patel@gmail.com",
          phone: "+91 98765 43210",
        },
        plan: "free",
        invoicesThisMonth: 0,
      };
      login(user);
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md card p-6 md:p-8 animate-in shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold">{t.appName}</div>
            <div className="text-xs text-[color:var(--text-muted)]">{mode === "login" ? t.login : t.signup}</div>
          </div>
        </div>

        <button
          onClick={googleLogin}
          disabled={loading}
          className="w-full btn-ghost rounded-xl py-3 flex items-center justify-center gap-2.5 font-semibold text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
          <span className="text-xs text-[color:var(--text-muted)]">or</span>
          <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="input mt-1.5"
                required
              />
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <div className="relative mt-1.5">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input pl-9"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative mt-1.5">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pl-9"
                required
                minLength={6}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl font-semibold text-sm">
            {loading ? "..." : mode === "login" ? t.login : t.signup}
          </button>
        </form>

        <div className="text-center text-xs text-[color:var(--text-muted)] mt-5">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-indigo-600 dark:text-indigo-400 font-semibold">
            {mode === "login" ? t.signup : t.login}
          </button>
        </div>
      </div>
    </div>
  );
}
