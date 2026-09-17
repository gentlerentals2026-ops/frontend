export const matchesCatalogueSearch = (product, query) => {
  const text = [product.title, product.description, product.category, product.slug].filter(Boolean).join(" ").toLowerCase();
  return text.includes(String(query || "").trim().toLowerCase());
};

export const scrollToCatalogue = (id = "rental-catalogue") => {
  const section = document.getElementById(id);
  if (!section) return;
  const nav = document.querySelector(".customer-header__nav");
  section.style.scrollMarginTop = `${(nav?.getBoundingClientRect().height || 0) + 20}px`;
  section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
};
