import { productCategories, productCategory, matchesCategorySearch, rentalNavigationCategories } from "./productCategories";
test("navigation uses active rental API categories, including empty and newly created categories, in display order", () => {
  const names = ["Chairs", "Tables", "AstroTurf", "Tents", "Props", "Lighting"];
  const categories = names.map((name, displayOrder) => ({ key: name.toLowerCase(), name, displayOrder }));
  expect(rentalNavigationCategories([
    ...categories.slice().reverse(),
    { key: "rental", name: "Rental", displayOrder: 0 },
    { key: "legacy", name: " Rental ", displayOrder: 0 },
    { key: "inactive", name: "Inactive", active: false },
    { key: "event-prop:chairs", name: "Prop chairs", scope: "EVENT_PROP" }
  ]).map(c => c.name)).toEqual(names);
});
test.each(["chairs", "tables", "astroturf", "tents", "props"])("%s uses assigned category, not the product name, and excludes unpublished records", category => {
  const rows = [
    { title: "Louis", category, isPublished: true },
    { title: category, category: "other", isPublished: true },
    { title: "Hidden Louis", category, isPublished: false }
  ];
  expect(rows.filter(p => matchesCategorySearch(p, category, "Louis")).map(p => p.title)).toEqual(["Louis"]);
  expect(rows.filter(p => matchesCategorySearch(p, category, "")).map(p => p.title)).toEqual(["Louis"]);
});
const products = [
  { title: "Louis", category: "chairs", categoryInfo: { key: "chairs", name: "Chair seating", displayOrder: 2 } },
  { title: "Banquet", category: "tables", categoryInfo: { key: "tables", name: "Tables", displayOrder: 1 } },
  { title: "Fan", category: "fans", categoryInfo: { key: "fans", name: "Fans", displayOrder: 3 } },
  { title: "Loose" }, { title: "Hidden Louis", category: "chairs", isPublished: false }
];
test("category options use main Product metadata in display order and uncategorized last", () => {
  expect(productCategories(products).map(c => c.name)).toEqual(["Tables", "Chair seating", "Fans", "Uncategorized"]);
  expect(productCategory({ category: "rental" }).name).toBe("Rental");
});
test.each([["", "", ["Louis", "Banquet", "Fan", "Loose"]], ["chairs", "", ["Louis"]], ["tables", "", ["Banquet"]], ["chairs", "louis", ["Louis"]], ["tables", "louis", []], ["__uncategorized", "", ["Loose"]]])("category %s and search %s combine without exposing hidden products", (category, query, expected) => {
  expect(products.filter(p => matchesCategorySearch(p, category, query)).map(p => p.title)).toEqual(expected);
});
