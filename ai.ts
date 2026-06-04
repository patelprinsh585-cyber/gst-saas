import type { Customer, InvoiceItem } from "./types";
import { STATE_NAME_TO_CODE } from "./types";

/**
 * Rule-based NLP parser that extracts invoice data from natural language.
 * Handles English + Hinglish + Hindi input common in India.
 */

const NUM = (s: string) => Number(String(s).replace(/[,₹\s]/g, "")) || 0;

// Regex building blocks
const RE_NUM = /(?:rs\.?|rupees?|रुपये?|₹|inr)?\s*([\d,]+(?:\.\d+)?)/i;
const RE_QTY = /(\d+)\s*(?:x|×|pcs?|pieces?|units?|nos?|नग|pcs)/i;
const RE_PRICE = /(?:at|@|for|प्रति|rate|कीमत|price|each)\s*rs\.?\s*([\d,]+(?:\.\d+)?)/i;
const RE_PRICE_2 = /rs\.?\s*([\d,]+(?:\.\d+)?)(?:\s*(?:each|per|प्रति|एक))/i;
const RE_GST = /(\d+(?:\.\d+)?)\s*%\s*gst/i;
const RE_GST_2 = /gst\s*(?:at|@)?\s*(\d+(?:\.\d+)?)%/i;

const STATE_PATTERNS: Array<[RegExp, string]> = [
  [/\b(delhi|new delhi|दिल्ली)\b/i, "Delhi"],
  [/\b(mumbai|मुंबई)\b/i, "Maharashtra"],
  [/\b(bangalore|bengaluru|बेंगलुरु)\b/i, "Karnataka"],
  [/\b(chennai|चेन्नई)\b/i, "Tamil Nadu"],
  [/\b(kolkata|calcutta|कोलकाता)\b/i, "West Bengal"],
  [/\b(hyderabad|हैदराबाद)\b/i, "Telangana"],
  [/\b(pune|पुणे)\b/i, "Maharashtra"],
  [/\b(ahmedabad|अहमदाबाद)\b/i, "Gujarat"],
  [/\b(jaipur|जयपुर)\b/i, "Rajasthan"],
  [/\b(lucknow|लखनऊ)\b/i, "Uttar Pradesh"],
  [/\b(chandigarh|चंडीगढ़)\b/i, "Punjab"],
  [/\b(indore|इंदौर)\b/i, "Madhya Pradesh"],
  [/\b(kochi|कोच्चि)\b/i, "Kerala"],
  [/\b(bhopal|भोपाल)\b/i, "Madhya Pradesh"],
  [/\b(surat|सूरत)\b/i, "Gujarat"],
];

export interface ParsedInvoice {
  customer: Omit<Customer, "id" | "createdAt">;
  items: InvoiceItem[];
  notes?: string;
}

export function parseInvoiceText(text: string): ParsedInvoice {
  const original = text.trim();
  const lower = original.toLowerCase();

  // ---------- Customer name ----------
  let customerName = "Customer";
  // "to <Name>", "invoice to <Name>", "for <Name>", "बिल <Name> को"
  const namePatterns = [
    /\b(?:invoice|bill|generate|create|make|issue)\s+(?:for|to)\s+(?:mr\.?|ms\.?|mrs\.?|shri|श्री)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i,
    /\b(?:to|for|के लिए|को)\s+(?:mr\.?|ms\.?|mrs\.?|shri|श्री)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:\s+(?:from|of|का)|\s*(?:,|\.|$))/,
  ];
  for (const p of namePatterns) {
    const m = original.match(p);
    if (m && m[1]) {
      const candidate = m[1].trim();
      const stopWords = ["Invoice", "Bill", "For", "To", "Make", "Create", "Generate", "With", "From", "The", "And", "This", "That", "With"];
      if (!stopWords.includes(candidate) && candidate.length > 2) {
        customerName = candidate;
        break;
      }
    }
  }

  // ---------- State / location ----------
  let state: string | undefined;
  for (const [re, st] of STATE_PATTERNS) {
    if (re.test(lower)) { state = st; break; }
  }

  // ---------- Phone / email ----------
  const phoneMatch = original.match(/(\+?\d[\d -]{8,}\d)/);
  const phone = phoneMatch ? phoneMatch[1].trim() : undefined;
  const emailMatch = original.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const email = emailMatch ? emailMatch[0] : undefined;

  // ---------- GSTIN ----------
  const gstinMatch = original.match(/\b\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]\b/);
  const gstin = gstinMatch ? gstinMatch[0] : undefined;

  // ---------- Items ----------
  // Strategy: split by "and" / "," / ";" and try to find qty+price per line
  const items: InvoiceItem[] = [];

  // Try per-item regex across whole text
  const itemRegex = /(\d+)\s*(?:x|×|pcs?|pieces?|units?|nos?|नग)?\s+([A-Za-z0-9 &\/\-]+?)(?:\s+(?:at|@|for|प्रति|rate|कीमत))?\s+(?:rs\.?|₹|rupees?|रुपये?)?\s*([\d,]+(?:\.\d+)?)(?:\s*(?:each|per|प्रति|एक|apiece))?/gi;
  let m;
  while ((m = itemRegex.exec(original)) !== null) {
    items.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      description: m[2].trim().replace(/[.,]+$/, ""),
      qty: NUM(m[1]),
      price: NUM(m[3]),
      gstRate: 18,
      hsn: "9983",
    });
  }

  // Fallback: look for a single "total amount" style entry
  if (items.length === 0) {
    const totalMatch = original.match(RE_NUM);
    if (totalMatch) {
      // Extract item description - everything before the amount
      const idx = original.indexOf(totalMatch[0]);
      let desc = original.slice(0, idx).trim();
      // Remove leading customer / invoice / for / to
      desc = desc
        .replace(/^.*?(?:invoice|bill)\s+(?:for|to)\s+/i, "")
        .replace(/\b(for|to|invoice|bill)\s+/gi, "")
        .replace(customerName, "")
        .trim()
        .replace(/^[,\s]+|[,\s]+$/g, "");
      if (!desc) desc = "Service";

      items.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
        description: desc.charAt(0).toUpperCase() + desc.slice(1),
        qty: 1,
        price: NUM(totalMatch[1]),
        gstRate: 18,
        hsn: "9983",
      });
    } else {
      items.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
        description: "Professional Service",
        qty: 1,
        price: 10000,
        gstRate: 18,
        hsn: "9983",
      });
    }
  }

  // ---------- Quantity overrides ----------
  const qtyMatch = original.match(RE_QTY);
  if (qtyMatch && items.length === 1) {
    items[0].qty = NUM(qtyMatch[1]);
  }

  // ---------- GST rate ----------
  const gstMatch = original.match(RE_GST) || original.match(RE_GST_2);
  if (gstMatch) {
    const rate = NUM(gstMatch[1]);
    if ([0, 5, 12, 18, 28].includes(rate) || rate > 0) {
      items.forEach((it) => (it.gstRate = rate));
    }
  }

  // ---------- HSN hints ----------
  const hsnMatch = original.match(/\b(?:hsn|sac)\s*[:\-]?\s*(\d{4,8})\b/i);
  if (hsnMatch) items.forEach((it) => (it.hsn = hsnMatch[1]));

  // Infer HSN from keywords
  const descLower = items.map((i) => i.description.toLowerCase()).join(" ");
  if (/(laptop|computer|mobile|phone|device|hardware)/.test(descLower)) {
    items.forEach((it) => (it.hsn = it.hsn || "8471"));
  } else if (/(software|web|design|development|consulting|service|design|freelance|consult)/.test(descLower)) {
    items.forEach((it) => (it.hsn = it.hsn || "9983"));
  }

  const stateCode = state ? STATE_NAME_TO_CODE[state.toLowerCase()] : undefined;

  return {
    customer: {
      name: customerName,
      email,
      phone,
      gstin,
      address: state ? `${state}, India` : "India",
      state,
      stateCode,
    },
    items,
  };
}

/**
 * AI Tax Assistant — answers common Indian tax questions.
 */
export function aiTaxAnswer(question: string): string {
  const q = question.toLowerCase();

  if (/(composition|कम्पोज़िशन)/.test(q)) {
    return "📋 Composition Scheme is for businesses with turnover up to ₹1.5 Cr (₹75L in special states). You pay tax at a flat rate: 1% (traders/manufacturers), 5% (restaurants), 6% (services). You cannot charge GST to customers or claim ITC. File quarterly using CMP-08 and annual GSTR-4.";
  }
  if (/(itr|income tax|आयकर|return)/.test(q)) {
    return "📑 For FY 2025-26, individuals up to ₹7L income pay zero tax under the new regime (rebate u/s 87A). ITR-1 (Sahaj) is for salary < ₹50L. ITR-3 is for business/freelance. File by 31st July (non-audit). Presumptive: use ITR-4 (44AD/44ADA).";
  }
  if (/(gstr|gstr-1|gstr-3b|gstr 3b)/.test(q)) {
    return "📅 GSTR-1 (outward supplies): due 11th of next month (monthly) or 13th (quarterly QRMP). GSTR-3B (summary + tax payment): due 20th (monthly) or 22nd/24th (QRMP). Late fee ₹50/day (₹20 for nil).";
  }
  if (/(hsn|sac)/.test(q)) {
    return "🔢 HSN (Harmonized System) is for goods, SAC (Services Accounting Code) is for services. Turnover > ₹5Cr: 6-digit HSN. > ₹1.5Cr: 4-digit. Below: 2-digit optional. Services usually start with 99.";
  }
  if (/(itc|input tax|इनपुट)/.test(q)) {
    return "🔄 Input Tax Credit (ITC) lets you offset GST paid on purchases against GST on sales. Conditions: valid invoice, goods/services received, supplier filed GSTR-1, appears in your GSTR-2B, and paid within 180 days. Blocked under Section 17(5): personal use, motor vehicles, food, etc.";
  }
  if (/(registration|register|रजिस्टर)/.test(q)) {
    return "📝 GST registration required if turnover > ₹40L (goods, normal states), ₹20L (services), ₹10L (special states), or if you do inter-state sales, e-commerce, or are a casual taxable person. Apply online at gst.gov.in — takes 3-7 working days.";
  }
  if (/(save|saving|deduction|धारा|80c|80d)/.test(q)) {
    return "💰 Tax saving tips: Use 80C (₹1.5L) — ELSS, PPF, EPF, LIC. 80D — health insurance ₹25K+₹50K for parents. 80CCD(1B) — NPS ₹50K extra. Section 44ADA: freelancers can declare 50% income as profit. Keep all business expenses documented.";
  }
  if (/(rate|slab|percent|प्रतिशत)/.test(q)) {
    return "📊 GST rate slabs: 0% (essentials), 5% (packaged food, tea), 12% (processed food, mobiles), 18% (most services, electronics, restaurant), 28% (luxury, cars, tobacco). Services like consulting, IT, and freelance are typically 18%.";
  }
  if (/(e.?invoice|eway|e-way|e invoice)/.test(q)) {
    return "📦 E-Invoice mandatory for B2B if turnover > ₹5 Cr. E-way bill required for goods movement > ₹50,000 (inter-state). Generate on einvoice1.gst.gov.in and ewaybillgst.gov.in.";
  }
  if (/(freelance|consult|consultant|डिज़ाइन|developer)/.test(q)) {
    return "💼 As a freelancer/consultant: Use SAC 9983. Charge 18% GST if registered. Use Section 44ADA (presumptive) to declare only 50% as income if receipts < ₹75L. Maintain bank statements + invoices. TDS 194J (10%) may be deducted by clients — claim refund via ITR.";
  }
  if (/(hello|hi|hey|नमस्ते|नमस्कार)/.test(q)) {
    return "👋 Namaste! Main aapka GST assistant hoon. Aap mujhse GST registration, rates, ITR filing, ITC, HSN codes, composition scheme, ya tax saving ke baare mein poochh sakte hain. / Hello! Ask me about GST registration, rates, ITR, ITC, HSN, composition scheme, or tax saving tips.";
  }

  return "🤖 I can help you with: GST registration, GST rates & slabs, GSTR-1 / GSTR-3B filing dates, Input Tax Credit (ITC), HSN/SAC codes, Composition Scheme, ITR filing, 80C/80D deductions, e-invoice & e-way bills, and freelancer tax tips. Try asking about one of these topics!";
}
