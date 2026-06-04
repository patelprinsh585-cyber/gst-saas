import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer, Expense, Invoice, User } from "./types";
import type { Lang } from "./i18n";

interface AppState {
  user: User | null;
  invoices: Invoice[];
  customers: Customer[];
  expenses: Expense[];
  lang: Lang;
  theme: "light" | "dark";
  view: "landing" | "dashboard";
  activeTab: string;

  // Auth
  login: (user: User) => void;
  logout: () => void;

  // Data
  addInvoice: (inv: Invoice) => void;
  deleteInvoice: (id: string) => void;
  updateInvoiceStatus: (id: string, status: Invoice["status"]) => void;
  addCustomer: (c: Customer) => void;
  updateCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  addExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;

  // Settings
  setLang: (l: Lang) => void;
  setTheme: (t: "light" | "dark") => void;
  updateBusiness: (b: Partial<User["business"]>) => void;
  setPlan: (p: "free" | "pro" | "business") => void;

  // Navigation
  setView: (v: "landing" | "dashboard") => void;
  setActiveTab: (t: string) => void;
}

// Seed data for demo
const seedCustomers: Customer[] = [
  {
    id: "c1",
    name: "Ramesh Kumar",
    email: "ramesh@acmecorp.in",
    phone: "+91 98765 43210",
    gstin: "29ABCDE1234F1Z5",
    address: "12 MG Road, Bengaluru",
    state: "Karnataka",
    stateCode: "29",
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
  },
  {
    id: "c2",
    name: "Priya Sharma",
    email: "priya@novadesign.co",
    phone: "+91 99887 66554",
    gstin: "",
    address: "Connaught Place, New Delhi",
    state: "Delhi",
    stateCode: "07",
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: "c3",
    name: "Anand Electronics",
    email: "sales@anandelec.in",
    phone: "+91 90000 11122",
    gstin: "27AABCA1234M1ZP",
    address: "FC Road, Pune",
    state: "Maharashtra",
    stateCode: "27",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

function makeSeedInvoice(customer: Customer, daysAgo: number, items: Invoice["items"], status: Invoice["status"]): Invoice {
  const date = new Date(Date.now() - 86400000 * daysAgo).toISOString();
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const isInterState = customer.stateCode && customer.stateCode !== "27";
  const gstAmount = subtotal * 0.18;
  return {
    id: "inv-" + customer.id + "-" + daysAgo,
    invoiceNumber: `GG-${(2024000 + daysAgo).toString()}`,
    date,
    customer,
    items,
    subtotal,
    cgst: isInterState ? 0 : gstAmount / 2,
    sgst: isInterState ? 0 : gstAmount / 2,
    igst: isInterState ? gstAmount : 0,
    total: subtotal + gstAmount,
    isInterState,
    status,
    createdAt: date,
  };
}

const seedInvoices: Invoice[] = [
  makeSeedInvoice(seedCustomers[0], 3, [
    { id: "i1", description: "Website Redesign", hsn: "9983", qty: 1, price: 45000, gstRate: 18 },
  ], "paid"),
  makeSeedInvoice(seedCustomers[1], 7, [
    { id: "i2", description: "Brand Identity Package", hsn: "9983", qty: 1, price: 28000, gstRate: 18 },
    { id: "i3", description: "Logo Variations", hsn: "9983", qty: 3, price: 5000, gstRate: 18 },
  ], "pending"),
  makeSeedInvoice(seedCustomers[2], 14, [
    { id: "i4", description: "SEO Audit & Report", hsn: "9983", qty: 1, price: 15000, gstRate: 18 },
  ], "paid"),
  makeSeedInvoice(seedCustomers[0], 22, [
    { id: "i5", description: "Monthly Retainer", hsn: "9983", qty: 1, price: 35000, gstRate: 18 },
  ], "paid"),
  makeSeedInvoice(seedCustomers[1], 35, [
    { id: "i6", description: "Social Media Graphics", hsn: "9983", qty: 12, price: 2500, gstRate: 18 },
  ], "paid"),
  makeSeedInvoice(seedCustomers[2], 45, [
    { id: "i7", description: "Mobile App UI Design", hsn: "9983", qty: 1, price: 85000, gstRate: 18 },
  ], "paid"),
  makeSeedInvoice(seedCustomers[0], 55, [
    { id: "i8", description: "Consulting Hours", hsn: "9983", qty: 10, price: 2000, gstRate: 18 },
  ], "paid"),
];

const seedExpenses: Expense[] = [
  { id: "e1", date: new Date(Date.now() - 86400000 * 2).toISOString(), category: "Software", description: "Figma Annual", amount: 9800, vendor: "Figma Inc" },
  { id: "e2", date: new Date(Date.now() - 86400000 * 8).toISOString(), category: "Hosting", description: "Vercel Pro", amount: 2400, vendor: "Vercel" },
  { id: "e3", date: new Date(Date.now() - 86400000 * 15).toISOString(), category: "Travel", description: "Client meeting Bangalore", amount: 3200 },
  { id: "e4", date: new Date(Date.now() - 86400000 * 22).toISOString(), category: "Marketing", description: "Google Ads", amount: 5500, vendor: "Google" },
  { id: "e5", date: new Date(Date.now() - 86400000 * 30).toISOString(), category: "Office", description: "Co-working day pass", amount: 800 },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      invoices: seedInvoices,
      customers: seedCustomers,
      expenses: seedExpenses,
      lang: "en",
      theme: "light",
      view: "landing",
      activeTab: "dashboard",

      login: (user) => set({ user, view: "dashboard" }),
      logout: () => set({ user: null, view: "landing" }),

      addInvoice: (inv) =>
        set((s) => {
          const month = new Date().getMonth();
          const thisMonthCount = s.invoices.filter(
            (i) => new Date(i.createdAt).getMonth() === month
          ).length;
          return {
            invoices: [inv, ...s.invoices],
            user: s.user
              ? { ...s.user, invoicesThisMonth: thisMonthCount + 1 }
              : null,
          };
        }),
      deleteInvoice: (id) => set((s) => ({ invoices: s.invoices.filter((i) => i.id !== id) })),
      updateInvoiceStatus: (id, status) =>
        set((s) => ({
          invoices: s.invoices.map((i) => (i.id === id ? { ...i, status } : i)),
        })),
      addCustomer: (c) => set((s) => ({ customers: [c, ...s.customers] })),
      updateCustomer: (c) => set((s) => ({ customers: s.customers.map((x) => (x.id === c.id ? c : x)) })),
      deleteCustomer: (id) => set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),
      addExpense: (e) => set((s) => ({ expenses: [e, ...s.expenses] })),
      deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      setLang: (lang) => set({ lang }),
      setTheme: (theme) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
        set({ theme });
      },
      updateBusiness: (b) =>
        set((s) => (s.user ? { user: { ...s.user, business: { ...s.user.business, ...b } } } : {})),
      setPlan: (plan) => set((s) => (s.user ? { user: { ...s.user, plan } } : {})),

      setView: (view) => set({ view }),
      setActiveTab: (activeTab) => set({ activeTab }),
    }),
    {
      name: "gst-genius-ai-storage",
      onRehydrate: (state) => {
        // Apply theme on load
        if (typeof document !== "undefined" && state?.theme === "dark") {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);
