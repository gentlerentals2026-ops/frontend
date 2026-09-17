import { act, render, screen } from "@testing-library/react";
import ServicesSection from "./ServiceSection";

test("preserves benefits and services anchor, disconnecting the entrance observer", () => {
  const original = window.IntersectionObserver;
  const originalMatch = window.matchMedia;
  let notify;
  const disconnect = jest.fn();
  window.matchMedia = jest.fn(() => ({ matches: false }));
  window.IntersectionObserver = jest.fn(callback => {
    notify = callback;
    return { observe: jest.fn(), disconnect };
  });
  try {
    const { unmount } = render(<ServicesSection />);
    expect(screen.getByRole("region")).toHaveAttribute("id", "services");
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    act(() => notify([{ isIntersecting: true }]));
    expect(screen.getByRole("region")).toHaveClass("service-benefits--entered");
    expect(disconnect).toHaveBeenCalledTimes(1);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(2);
  } finally {
    window.IntersectionObserver = original;
    window.matchMedia = originalMatch;
  }
});

test("reduced motion keeps benefits visible without animation", () => {
  const original = window.matchMedia;
  window.matchMedia = jest.fn(() => ({ matches: true }));
  try {
    render(<ServicesSection />);
    expect(screen.getByRole("region")).not.toHaveClass("service-benefits--entered");
    expect(screen.getByText("Satisfaction Guaranteed")).toBeVisible();
  } finally {
    window.matchMedia = original;
  }
});
