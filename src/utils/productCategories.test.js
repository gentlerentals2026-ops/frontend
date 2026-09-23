import { productCategories, productCategory, matchesCategorySearch } from "./productCategories";
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
