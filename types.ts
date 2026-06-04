export interface InvoiceItem {
  id: string;
  description: string;
  hsn?: string;
  qty: number;
  price: number;
  gstRate: number; // percentage
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  gstin?: string;
  address?: string;
  state?: string;
  stateCode?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  isInterState: boolean;
  notes?: string;
  status: "paid" | "pending" | "overdue";
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  vendor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google";
  business: {
    name: string;
    gstin?: string;
    address?: string;
    state?: string;
    stateCode?: string;
    phone?: string;
    email?: string;
    pan?: string;
  };
  plan: "free" | "pro" | "business";
  invoicesThisMonth: number;
}

// Indian state codes
export const INDIAN_STATES: Record<string, string> = {
  "37": "Andhra Pradesh",
  "12": "Arunachal Pradesh",
  "18": "Assam",
  "10": "Bihar",
  "22": "Chhattisgarh",
  "07": "Delhi",
  "30": "Goa",
  "24": "Gujarat",
  "06": "Haryana",
  "02": "Himachal Pradesh",
  "01": "Jammu and Kashmir",
  "20": "Jharkhand",
  "29": "Karnataka",
  "32": "Kerala",
  "31": "Lakshadweep",
  "23": "Madhya Pradesh",
  "27": "Maharashtra",
  "14": "Manipur",
  "17": "Meghalaya",
  "15": "Mizoram",
  "13": "Nagaland",
  "21": "Odisha",
  "34": "Puducherry",
  "03": "Punjab",
  "08": "Rajasthan",
  "11": "Sikkim",
  "33": "Tamil Nadu",
  "36": "Telangana",
  "16": "Tripura",
  "09": "Uttar Pradesh",
  "05": "Uttarakhand",
  "19": "West Bengal",
};

export const STATE_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(INDIAN_STATES).map(([code, name]) => [name.toLowerCase(), code])
);
