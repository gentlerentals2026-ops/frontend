import { jsPDF } from "jspdf";

const formatPrice = (price) => `N${Number(price || 0).toLocaleString("en-NG")}`;

const addPageFooter = (doc, pageNumber) => {
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(`Page ${pageNumber}`, 190, 287, { align: "right" });
};

const drawSectionTitle = (doc, title, x, y, color) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(color);
  doc.text(title, x, y);
};

const splitLines = (doc, text, width) => doc.splitTextToSize(text || "", width);

export const downloadBrochurePdf = ({ siteSettings, products = [] }) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const brandColor = siteSettings?.topBarColor || "#f59e0b";
  const listingColor = siteSettings?.addToCartColor || brandColor;
  const siteName = siteSettings?.siteName || "Gentle Renters";
  const featuredProducts = products.slice(0, 8);

  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, 210, 297, "F");
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, 210, 20, "F");
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  doc.line(18, 35, 192, 35);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text(siteName.toUpperCase(), 18, 58);

  doc.setFontSize(17);
  doc.setTextColor(253, 230, 138);
  doc.text("Events and Equipment Rental Brochure", 18, 72);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(229, 231, 235);
  const intro = splitLines(
    doc,
    "We provide stylish chairs, tables, and event rental essentials for weddings, parties, and premium celebrations. Explore our collection and request a quotation tailored to your event.",
    128
  );
  doc.text(intro, 18, 92);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(18, 120, 80, 56, 4, 4, "F");
  doc.roundedRect(108, 120, 84, 56, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(14);
  doc.text("Why clients choose us", 24, 136);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const benefits = [
    "Premium event furniture and rental styling",
    "Fast quotation turnaround for bookings",
    "Reliable delivery for weddings and celebrations",
    "Support for intimate and large-scale events"
  ];
  benefits.forEach((item, index) => {
    doc.text(`- ${item}`, 24, 148 + index * 8);
  });

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Booking flow", 114, 136);
  doc.setFont("helvetica", "normal");
  const flow = [
    "1. Browse listings",
    "2. Add preferred items to cart",
    "3. Generate your quotation",
    "4. Confirm logistics with our team"
  ];
  flow.forEach((item, index) => {
    doc.text(item, 114, 148 + index * 8);
  });

  doc.setFillColor(245, 158, 11);
  doc.roundedRect(18, 205, 174, 34, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(17, 24, 39);
  doc.text("Request a custom quotation for your event date and location.", 24, 225);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  doc.text("Phone: +2348148928379  |  Email: gentlerentals@gmail.com", 24, 236);
  addPageFooter(doc, 1);

  doc.addPage();
  drawSectionTitle(doc, "Featured Rental Listings", 18, 24, brandColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  doc.text("A quick preview of some event pieces currently available in our catalogue.", 18, 32);

  let y = 44;
  featuredProducts.forEach((product, index) => {
    if (y > 250) {
      addPageFooter(doc, doc.getNumberOfPages());
      doc.addPage();
      y = 24;
    }

    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(18, y, 174, 24, 3, 3, "FD");

    doc.setFillColor(...hexToRgb(index % 2 === 0 ? brandColor : listingColor));
    doc.roundedRect(22, y + 4, 18, 16, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(String(index + 1), 31, y + 14, { align: "center" });

    doc.setTextColor(17, 24, 39);
    doc.text(product.title || "Rental listing", 46, y + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`Category: ${product.category || "Rental"}`, 46, y + 16);
    doc.text(`Status: ${product.availabilityStatus || product.status || "Available"}`, 110, y + 16);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...hexToRgb(listingColor));
    doc.text(formatPrice(product.price), 182, y + 10, { align: "right" });

    y += 30;
  });

  if (featuredProducts.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text("Product highlights will appear here as soon as listings are available.", 18, 52);
  }

  addPageFooter(doc, doc.getNumberOfPages());
  doc.save(`${siteName.replace(/\s+/g, "-").toLowerCase()}-brochure.pdf`);
};

const hexToRgb = (hex) => {
  const normalized = String(hex || "#f59e0b").replace("#", "");
  const safeHex = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized.padEnd(6, "0").slice(0, 6);

  const value = Number.parseInt(safeHex, 16);

  return [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255
  ];
};
