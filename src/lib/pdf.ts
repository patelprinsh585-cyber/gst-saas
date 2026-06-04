import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice } from "./types";
import { formatDate, formatINR } from "@/utils/cn";

export function generateInvoicePdf(invoice: Invoice, business: Invoice["customer"] & { pan?: string }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(32, 65, 241);
  doc.rect(0, 0, W, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("TAX INVOICE", 14, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`#${invoice.invoiceNumber}`, 14, 23);
  doc.text(`Date: ${formatDate(invoice.date)}`, W - 14, 16, { align: "right" });
  if (invoice.dueDate) doc.text(`Due: ${formatDate(invoice.dueDate)}`, W - 14, 23, { align: "right" });
  doc.text("GST Genius AI", W - 14, 30, { align: "right" });

  // From / To
  doc.setTextColor(30, 30, 40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("FROM", 14, 52);
  doc.text("BILL TO", W / 2 + 10, 52);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const fromLines = [
    business.name,
    business.address || "",
    business.state ? `${business.state}${business.stateCode ? ` (${business.stateCode})` : ""}` : "",
    business.email || "",
    business.phone ? `Phone: ${business.phone}` : "",
    business.gstin ? `GSTIN: ${business.gstin}` : "",
    business.pan ? `PAN: ${business.pan}` : "",
  ].filter(Boolean);
  let y = 59;
  fromLines.forEach((l) => { doc.text(String(l), 14, y); y += 5; });

  const toLines = [
    invoice.customer.name,
    invoice.customer.address || "",
    invoice.customer.state ? `${invoice.customer.state} (${invoice.customer.stateCode})` : "",
    invoice.customer.email || "",
    invoice.customer.phone ? `Phone: ${invoice.customer.phone}` : "",
    invoice.customer.gstin ? `GSTIN: ${invoice.customer.gstin}` : "",
  ].filter(Boolean);
  y = 59;
  toLines.forEach((l) => { doc.text(String(l), W / 2 + 10, y); y += 5; });

  // Items table
  const head = [["#", "Description", "HSN/SAC", "Qty", "Price", "GST %", "Amount"]];
  const body = invoice.items.map((it, i) => [
    String(i + 1),
    it.description,
    it.hsn || "-",
    String(it.qty),
    formatINR(it.price),
    `${it.gstRate}%`,
    formatINR(it.qty * it.price),
  ]);

  autoTable(doc, {
    startY: Math.max(y + 8, 95),
    head,
    body,
    theme: "striped",
    headStyles: { fillColor: [32, 65, 241], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 9.5, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 60 },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
    },
  });

  // Totals
  // @ts-expect-error jspdf-autotable adds lastAutoTable
  let cursorY = (doc.lastAutoTable?.finalY || 140) + 8;
  const rightX = W - 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Subtotal", W - 60, cursorY);
  doc.text(formatINR(invoice.subtotal), rightX, cursorY, { align: "right" });
  cursorY += 6;
  if (invoice.isInterState) {
    doc.text("IGST", W - 60, cursorY);
    doc.text(formatINR(invoice.igst), rightX, cursorY, { align: "right" });
  } else {
    doc.text("CGST", W - 60, cursorY);
    doc.text(formatINR(invoice.cgst), rightX, cursorY, { align: "right" });
    cursorY += 6;
    doc.text("SGST", W - 60, cursorY);
    doc.text(formatINR(invoice.sgst), rightX, cursorY, { align: "right" });
  }
  cursorY += 8;
  doc.setDrawColor(200);
  doc.line(W - 65, cursorY - 3, rightX, cursorY - 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total", W - 60, cursorY + 3);
  doc.text(formatINR(invoice.total), rightX, cursorY + 3, { align: "right" });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text("This is a computer-generated GST-compliant invoice.", 14, 280);
  doc.text("Generated with GST Genius AI • gstgenius.ai", 14, 285);

  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
}
