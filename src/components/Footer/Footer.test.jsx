import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

let mockSettings;
jest.mock("../../context/SiteSettingsContext", () => ({ useSiteSettings: () => ({ siteSettings: mockSettings }) }));
const renderFooter = () => render(<MemoryRouter><Footer /></MemoryRouter>);
beforeEach(() => {
  mockSettings = { topBarColor: "#FFD700", siteName: "Gentle Events", facebookUrl: "", instagramUrl: "", twitterUrl: "", tiktokUrl: "" };
  global.fetch = jest.fn();
});
test("preserves eight routes, contact details, and displays the duplicate phone only once", () => {
  renderFooter();
  const links = { Home: "/", "About Us": "/about", "Contact Us": "/contact", Equipment: "/products", FAQs: "/faqs", "Privacy Policy": "/privacy-policy", "Cancellation Policy": "/cancellation-policy", Brochure: "/brochure" };
  for (const [name, href] of Object.entries(links)) expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  expect(screen.getAllByText("+2348148928379")).toHaveLength(1);
  expect(screen.getByRole("link", { name: "+2348148928379" })).toHaveAttribute("href", "tel:+2348148928379");
  expect(screen.getByRole("link", { name: "gentlerentals@gmail.com" })).toHaveAttribute("href", "mailto:gentlerentals@gmail.com");
});
test("missing social destinations remain visible without invented links", () => {
  renderFooter();
  for (const name of ["Facebook", "Instagram", "X / Twitter", "TikTok"]) {
    expect(screen.getByRole("img", { name: `${name}: link not configured` })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name })).not.toBeInTheDocument();
  }
});
test("configured social links open safely and unsafe protocols are rejected", () => {
  const socials = [["Facebook", "facebookUrl"], ["Instagram", "instagramUrl"], ["X / Twitter", "twitterUrl"], ["TikTok", "tiktokUrl"]];
  for (const [, key] of socials) mockSettings[key] = `https://example.test/${key}`;
  const { rerender } = renderFooter();
  for (const [name, key] of socials) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", mockSettings[key]);
    expect(screen.getByRole("link", { name })).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name })).toHaveAttribute("target", "_blank");
  }
  mockSettings.instagramUrl = "data:text/html,test";
  rerender(<MemoryRouter><Footer /></MemoryRouter>);
  expect(screen.queryByRole("link", { name: "Instagram" })).not.toBeInTheDocument();
});
test("subscription uses existing endpoint, normalizes email, and prevents repeat submissions", async () => {
  let resolve;
  fetch.mockReturnValue(new Promise(done => { resolve = done; }));
  renderFooter();
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "Test@Example.com" } });
  const form = screen.getByRole("form", { name: "Newsletter subscription" });
  fireEvent.submit(form); fireEvent.submit(form);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/newsletter/subscribe"), expect.objectContaining({ method: "POST", body: JSON.stringify({ email: "test@example.com" }) }));
  expect(screen.getByRole("button", { name: "Subscribing..." })).toBeDisabled();
  resolve({ ok: true, text: async () => JSON.stringify({ success: true }) });
  expect(await screen.findByRole("status")).toHaveTextContent("You're subscribed");
  expect(screen.getByLabelText("Email address")).toHaveValue("");
});
test("subscription errors are shown and entered email is retained", async () => {
  fetch.mockResolvedValue({ ok: false, status: 400, text: async () => JSON.stringify({ message: "Unable to subscribe" }) });
  renderFooter();
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "test@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Unable to subscribe");
  expect(screen.getByLabelText("Email address")).toHaveValue("test@example.com");
  expect(screen.getByRole("button", { name: "Subscribe" })).toBeEnabled();
});
