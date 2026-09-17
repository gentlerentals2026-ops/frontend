import { matchesCatalogueSearch } from "./catalogueSearch";
const item = { title: "Luxury Padded Chair", category: "Seating", description: "Comfortable rental", slug: "luxury-chair" };
test.each(["chair", "luxury", " CHAIR ", "seating", "comfortable", "luxury-chair"])("matches existing fields: %s", query => {
  expect(matchesCatalogueSearch(item, query)).toBe(true);
});
test("empty search restores items and absent terms do not match", () => {
  expect(matchesCatalogueSearch(item, " ")).toBe(true);
  expect(matchesCatalogueSearch(item, "nonexistent")).toBe(false);
});
