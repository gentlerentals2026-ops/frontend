import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import AppHeader from "./Header";
import ProductsListingPage from "../../pages/Products/ProductsListingPage";
import { ProductService } from "../../services/products/Product";

jest.setTimeout(30000);

const click = async (element) => { await act(async () => element.click()); };
// user-event v13 is synchronous; React 19 router transitions need an awaited act.
// eslint-disable-next-line testing-library/no-unnecessary-act
const enter = async (element) => { await act(async () => userEvent.type(element, "{enter}")); };

let mockCartItems = [];
const mockAddToCart = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
  useSelector: (select) => select({ appState: { isAuthenticated: true, user: { fullName: "Test Customer" } } })
}));
jest.mock("../../services/api/cartApi", () => ({
  useGetCartQuery: () => ({ data: { data: { items: mockCartItems } } }),
  useAddToCartMutation: () => [mockAddToCart, { isLoading: false }],
  cartApi: { util: { resetApiState: jest.fn() } }
}));
jest.mock("../../context/SiteSettingsContext", () => ({
  useSiteSettings: () => ({ siteSettings: { siteName: "Gentle Events", logoUrl: "/logo.png", topBarColor: "#f59e0b", addToCartColor: "#f59e0b" } })
}));
jest.mock("../../services/products/Product", () => ({ ProductService: { getProducts: jest.fn() } }));
jest.mock("../../services/auth/Auth", () => ({ AuthService: { logout: jest.fn() } }));
jest.mock("../../utils/brochure", () => ({ downloadBrochurePdf: jest.fn() }));

const products = [
  { _id: "chair", title: "Gold Chiavari Chair", slug: "gold-chair", category: "Chairs", price: 1500, quantityAvailable: 10, status: "available" },
  { _id: "table", title: "Round Table", slug: "round-table", category: "Tables", price: 2500, quantityAvailable: 5, status: "available" }
];
function Location() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}{location.hash}</output>;
}
function TestApp() {
  return <MemoryRouter initialEntries={["/products"]}>
    <AppHeader /><Location />
    <Routes><Route path="/products" element={<ProductsListingPage />} /><Route path="*" element={<div>Destination</div>} /></Routes>
  </MemoryRouter>;
}
beforeEach(() => {
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0, writable: true });
  mockCartItems = [{ quantity: 2 }, { quantity: 1 }];
  ProductService.getProducts.mockResolvedValue({ data: products });
  mockAddToCart.mockReturnValue({ unwrap: () => Promise.resolve() });
  window.ResizeObserver = class { observe() {} disconnect() {} };
});

test("scroll collapse uses hysteresis and restores existing controls", async () => {
  render(<TestApp />);
  await screen.findByText("Gold Chiavari Chair");
  const header = screen.getByRole("banner");
  const scroll = (y) => {
    window.scrollY = y;
    fireEvent.scroll(window);
  };
  scroll(99);
  expect(header).not.toHaveClass("customer-header--collapsed");
  scroll(100);
  expect(header).toHaveClass("customer-header--collapsed");
  expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  expect(screen.getByRole("search", { hidden: true })).toHaveAttribute("inert");
  expect(screen.getByRole("navigation")).toBeInTheDocument();
  for (const y of [101, 98, 80, 51, 600]) {
    scroll(y);
    expect(header).toHaveClass("customer-header--collapsed");
  }
  scroll(50);
  expect(header).not.toHaveClass("customer-header--collapsed");
  expect(screen.getByRole("searchbox")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View cart, 3 items" })).toBeInTheDocument();
  scroll(80);
  expect(header).not.toHaveClass("customer-header--collapsed");
});

test("restored scroll positions collapse on mount and the passive listener is cleaned up", async () => {
  window.scrollY = 250;
  const add = jest.spyOn(window, "addEventListener");
  const remove = jest.spyOn(window, "removeEventListener");
  const view = render(<TestApp />);
  await screen.findByText("Gold Chiavari Chair");
  expect(screen.getByRole("banner")).toHaveClass("customer-header--collapsed");
  const registration = add.mock.calls.find(([name, , options]) => name === "scroll" && options?.passive);
  expect(registration).toBeDefined();
  view.unmount();
  expect(remove).toHaveBeenCalledWith("scroll", registration[1]);
  add.mockRestore();
  remove.mockRestore();
});

test("search button and Enter use the existing listings with partial, case-insensitive, empty and unmatched queries", async () => {
  render(<TestApp />);
  await screen.findByText("Gold Chiavari Chair");
  const input = screen.getByRole("searchbox", { name: "Search catalogue" });
  fireEvent.change(input, { target: { value: "cHiAv" } });
  await click(screen.getByRole("button", { name: "Search", exact: true }));
  expect(screen.getByText("Gold Chiavari Chair")).toBeInTheDocument();
  expect(screen.queryByText("Round Table")).not.toBeInTheDocument();
  fireEvent.change(input, { target: { value: "Round Table" } });
  await enter(input);
  expect(await screen.findByText("Round Table")).toBeInTheDocument();
  expect(screen.queryByText("Gold Chiavari Chair")).not.toBeInTheDocument();
  fireEvent.change(input, { target: { value: "" } });
  await enter(input);
  expect(await screen.findByText("Gold Chiavari Chair")).toBeInTheDocument();
  expect(screen.getByText("Round Table")).toBeInTheDocument();
  fireEvent.change(input, { target: { value: "not-a-product" } });
  await enter(input);
  expect(await screen.findByText("No listings match your search.")).toBeInTheDocument();
  expect(input).toHaveAttribute("enterkeyhint", "search");
});

test("cart count follows query state and the cart link uses the existing route", async () => {
  const view = render(<TestApp />);
  await screen.findByText("Gold Chiavari Chair");
  expect(screen.getByRole("link", { name: "View cart, 3 items" })).toHaveAttribute("href", "/cart");
  mockCartItems = [{ quantity: 4 }];
  view.rerender(<TestApp />);
  expect(screen.getByRole("link", { name: "View cart, 4 items" })).toBeInTheDocument();
  mockCartItems = [];
  view.rerender(<TestApp />);
  await click(screen.getByRole("link", { name: "View cart, 0 items" }));
  expect(screen.getByTestId("location")).toHaveTextContent("/cart");
});

test("hamburger preserves existing routes and closes after navigation", async () => {
  render(<TestApp />);
  await screen.findByText("Gold Chiavari Chair");
  await click(screen.getByRole("button", { name: "Open navigation menu" }));
  const menu = screen.getByRole("menu");
  for (const [label, path] of [["Home", "/"], ["Rentals", "/products"], ["Services", "/#services"], ["About", "/about"], ["Contact", "/contact"], ["Account", "/account"], ["Cart", "/cart"]]) {
    expect(within(menu).getByRole("menuitem", { name: label })).toHaveAttribute("href", path);
  }
  await click(within(menu).getByRole("menuitem", { name: "About" }));
  expect(screen.getByTestId("location")).toHaveTextContent("/about");
});

test("Rentals uses real product categories and filters listings", async () => {
  render(<TestApp />);
  await click(screen.getByRole("button", { name: "Rental categories" }));
  await click(await screen.findByRole("menuitem", { name: "Chairs" }));
  await waitFor(() => expect(screen.queryByText("Round Table")).not.toBeInTheDocument());
  expect(screen.getByText("Gold Chiavari Chair")).toBeInTheDocument();
  expect(screen.getByTestId("location")).toHaveTextContent("/products?category=Chairs");
});

test("filtered cards preserve View Listing, Add to Cart and Order Now quotation handoff", async () => {
  render(<TestApp />);
  await screen.findByText("Gold Chiavari Chair");
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Gold" } });
  await enter(screen.getByRole("searchbox"));
  expect(screen.getByRole("link", { name: "View Listing" })).toHaveAttribute("href", "/products/gold-chair");
  await click(screen.getByRole("button", { name: "Add to Cart" }));
  expect(mockAddToCart).toHaveBeenCalledWith({ productId: "chair", quantity: 1 });
  await screen.findByText("Gold Chiavari Chair added to cart.");
  await click(screen.getByRole("button", { name: "Order Now" }));
  expect(screen.getByTestId("location")).toHaveTextContent("/generate-quotation");
  expect(JSON.parse(sessionStorage.getItem("gentle_events_order_now"))).toMatchObject({ productId: "chair", quantity: 1, unitPrice: 1500 });
});
