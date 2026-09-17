import { jsPDF } from "jspdf";

// Contact details already used by the customer footer and original brochure.
const CONTACT = { phone: "+2348148928379", email: "gentlerentals@gmail.com" };
export const CARD = { width: 86, height: 106, imageHeight: 78, gap: 10, top: 40, left: 14 };
export const formatBrochurePrice = price => {
  const value = Number(price);
  return Number.isFinite(value) && value >= 0
    ? `\u20a6${value.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`
    : "Price on request";
};
export const resolveBrochureImage = product => product.imageUrl || product.images?.find(Boolean) || "";
export const brochureCardPosition = index => ({
  page: Math.floor(index / 4) + 2,
  x: CARD.left + (index % 2) * (CARD.width + CARD.gap),
  y: CARD.top + (Math.floor(index / 2) % 2) * (CARD.height + CARD.gap)
});

export const loadBrochureImage = (source, label) => new Promise(resolve => {
  if (!source) { console.warn("Brochure image missing:", label); resolve(null); return; }
  const image = new Image();
  let settled = false;
  const finish = result => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    image.onload = null;
    image.onerror = null;
    resolve(result);
  };
  const fail = () => { console.warn("Brochure image could not be loaded:", label, source); finish(null); };
  const timer = setTimeout(fail, 25000);
  image.crossOrigin = "anonymous";
  image.onload = async () => {
    try {
      await image.decode();
      if (settled) return;
      // Bound memory/file size while retaining roughly 300 dpi for catalogue images.
      const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      finish({ data: canvas.toDataURL("image/jpeg", 0.92), width: canvas.width, height: canvas.height });
    } catch { fail(); }
  };
  image.onerror = fail;
  try { image.src = new URL(source, window.location.origin).href; } catch { fail(); }
});

const containImage = (doc, image, x, y, width, height) => {
  if (!image) return;
  const scale = Math.min(width / image.width, height / image.height);
  const w = image.width * scale, h = image.height * scale;
  doc.addImage(image.data, "JPEG", x + (width - w) / 2, y + (height - h) / 2, w, h);
};
const text = (doc, value, x, y, size = 11, color = "#111827", weight = "normal") => {
  doc.setFont("helvetica", weight); doc.setFontSize(size); doc.setTextColor(color); doc.text(value, x, y);
};
// Standard PDF fonts lack the Naira glyph. Rasterize only prices at high resolution.
const drawPrice = (doc, price, x, y) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const label = formatBrochurePrice(price);
  ctx.font = "bold 48px Arial";
  canvas.width = Math.ceil(ctx.measureText(label).width) + 8; canvas.height = 64;
  ctx.font = "bold 48px Arial"; ctx.fillStyle = "#111827"; ctx.fillText(label, 4, 49);
  const width = Math.min(74, canvas.width / 12);
  doc.addImage(canvas.toDataURL("image/png"), "PNG", x, y, width, width * 64 / canvas.width);
};
const cardTitle = (doc, title) => {
  doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  const lines = doc.splitTextToSize(String(title || "Rental listing"), CARD.width - 10);
  if (lines.length <= 2) return lines;
  let second = lines[1];
  while (second && doc.getTextWidth(`${second}...`) > CARD.width - 10) second = second.slice(0, -1);
  return [lines[0], `${second}...`];
};

export const createBrochurePdf = async ({ siteSettings = {}, products = [] }) => {
  if (document.fonts?.ready) await document.fonts.ready;
  // The public catalogue endpoint defines which products customers can browse.
  const images = new Array(products.length);
  let next = 0;
  const worker = async () => {
    while (next < products.length) {
      const index = next++, product = products[index];
      images[index] = await loadBrochureImage(resolveBrochureImage(product), `${product._id || index}: ${product.title}`);
    }
  };
  const [logo] = await Promise.all([
    loadBrochureImage(siteSettings.logoUrl || "/logo.png", "Gentle Events logo"),
    ...Array.from({ length: Math.min(4, products.length) }, worker)
  ]);
  // All images have decoded or reached a handled failure before PDF creation/saving.
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  const brand = siteSettings.topBarColor || "#f59e0b";
  const siteName = siteSettings.siteName || "Gentle Events";
  const origin = window.location.origin;
  doc.setProperties({ title: `${siteName} - Rental Collection`, subject: "Event rental catalogue", creator: siteName });
  doc.setFillColor("#111827"); doc.rect(0, 0, 210, 297, "F");
  doc.setFillColor(brand); doc.rect(14, 14, 2, 36, "F");
  containImage(doc, logo, 21, 14, 45, 36);
  text(doc, siteName.toUpperCase(), 14, 64, 16, "#ffffff", "bold");
  text(doc, "RENTAL COLLECTION", 14, 82, 29, brand, "bold");
  text(doc, "Events & Equipment Rental Catalogue", 14, 94, 14, "#ffffff");
  text(doc, ["Thoughtful pieces for unforgettable celebrations.", "Explore our furniture and rental essentials, then request", "a quotation tailored to your event."], 14, 106, 11, "#e5e7eb");
  images.filter(Boolean).slice(0, 2).forEach((image, index) => {
    const x = 14 + index * 96;
    doc.setFillColor("#ffffff"); doc.rect(x, 128, 86, 80, "F");
    containImage(doc, image, x + 4, 132, 78, 72);
  });
  text(doc, "Browse  /  Select  /  Request Quote  /  Get Delivered", 14, 223, 12, brand, "bold");
  text(doc, ["Add your preferred pieces to your cart and generate a quotation.", "Our team will help confirm your event date, location and logistics."], 14, 233, 10, "#e5e7eb");
  doc.setDrawColor(brand); doc.line(14, 250, 196, 250);
  text(doc, "Planning an event? Let's make it memorable.", 14, 261, 14, "#ffffff", "bold");
  text(doc, `Phone: ${CONTACT.phone}   |   Email: ${CONTACT.email}`, 14, 272, 10, "#e5e7eb");
  text(doc, origin, 14, 282, 10, brand); doc.link(14, 275, 182, 10, { url: origin });

  const pageCount = Math.max(1, Math.ceil(products.length / 4));
  for (let page = 0; page < pageCount; page++) {
    doc.addPage();
    text(doc, "OUR RENTAL COLLECTION", 14, 20, 19, "#111827", "bold");
    text(doc, "Browse event furniture and rental essentials.", 14, 29, 10, "#4b5563");
    doc.setDrawColor(brand); doc.setLineWidth(1); doc.line(14, 34, 196, 34);
    const start = page * 4;
    products.slice(start, start + 4).forEach((product, offset) => {
      const index = start + offset, { x, y } = brochureCardPosition(index);
      doc.setFillColor("#f9fafb"); doc.setDrawColor("#e5e7eb"); doc.setLineWidth(0.2);
      doc.rect(x, y, CARD.width, CARD.height, "FD");
      doc.setFillColor("#ffffff"); doc.rect(x + 1, y + 1, CARD.width - 2, CARD.imageHeight - 1, "F");
      containImage(doc, images[index], x + 4, y + 4, CARD.width - 8, CARD.imageHeight - 8);
      if (!images[index]) text(doc, "Image unavailable", x + 23, y + 40, 10, "#6b7280");
      text(doc, cardTitle(doc, product.title), x + 5, y + 85, 11, "#111827", "bold");
      drawPrice(doc, product.price, x + 5, y + 97);
      if (product.slug) doc.link(x, y, CARD.width, CARD.height, { url: `${origin}/products/${encodeURIComponent(product.slug)}` });
    });
    if (!products.length) text(doc, "Explore our current collection online or contact our team.", 14, 60);
    if (page === pageCount - 1) {
      text(doc, "READY TO PLAN YOUR EVENT?", 14, 273, 10, "#111827", "bold");
      text(doc, `${CONTACT.phone}  |  ${CONTACT.email}`, 14, 280, 9, "#4b5563");
      text(doc, origin, 14, 287, 9, "#4b5563"); doc.link(14, 282, 150, 7, { url: origin });
    }
    text(doc, `${page + 2} / ${pageCount + 1}`, 184, 287, 9, "#6b7280");
  }
  return doc;
};

export const downloadBrochurePdf = async options => {
  const doc = await createBrochurePdf(options);
  const name = (options.siteSettings?.siteName || "Gentle Events").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`${name}-brochure.pdf`);
  return doc;
};
