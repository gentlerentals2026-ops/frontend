import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CatalogueGrid from "./CatalogueGrid";

const products = [{ _id: "1", slug: "chair", title: "A long rental product name", price: 12500, imageUrl: "/chair.png" }];

test("catalogue uses real names, formatted prices and the existing detail route", () => {
  render(<MemoryRouter><CatalogueGrid products={products} isLoading={false} /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "View listing: A long rental product name" })).toHaveAttribute("href", "/products/chair");
  expect(screen.getByRole("heading", { name: products[0].title })).toBeInTheDocument();
  expect(screen.getByText(/12,500/)).toBeInTheDocument();
});

test("skeleton state exposes busy status without interactive placeholder products", () => {
  render(<MemoryRouter><CatalogueGrid products={products} isLoading skeletonCount={5} /></MemoryRouter>);
  expect(screen.getByLabelText("Rental catalogue")).toHaveAttribute("aria-busy", "true");
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});

test("missing images retain a catalogue tile and an accessible detail link", () => {
  render(<MemoryRouter><CatalogueGrid products={[{ ...products[0], imageUrl: "" }]} isLoading={false} /></MemoryRouter>);
  expect(screen.getByText("Image unavailable")).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/products/chair");
});
