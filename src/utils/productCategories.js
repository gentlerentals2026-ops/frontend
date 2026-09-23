export const productCategory = product => product.categoryInfo || (product.category
  ? { key: product.category, name: product.category.charAt(0).toUpperCase() + product.category.slice(1), displayOrder: 10000 }
  : { key: "__uncategorized", name: "Uncategorized", displayOrder: Number.MAX_SAFE_INTEGER });
export const productCategories = products => {
  const map = new Map();
  products.filter(p => p.isPublished !== false).forEach(p => { const c = productCategory(p); map.set(c.key, c); });
  return [...map.values()].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, "en") || a.key.localeCompare(b.key, "en"));
};
export const matchesCategorySearch = (product, category = "", query = "") => product.isPublished !== false
  && (!category || productCategory(product).key === category)
  && [product.title, product.description, product.category, productCategory(product).name, product.slug].filter(Boolean).join(" ").toLowerCase().includes(query.trim().toLowerCase());
