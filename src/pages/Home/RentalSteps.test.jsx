import { render, screen, within } from "@testing-library/react";
import RentalSteps from "./RentalSteps";

test("explains the rental journey in four ordered, non-interactive steps", () => {
  render(<RentalSteps />);
  const section = screen.getByRole("region", { name: "Renting Made Simple" });
  const steps = within(section).getAllByRole("listitem");
  expect(steps).toHaveLength(4);
  ["Explore Rentals", "Add Your Items", "Get Your Quote", "Confirm & Get Ready"].forEach((title, index) => {
    expect(within(steps[index]).getByRole("heading", { level: 3, name: title })).toBeInTheDocument();
  });
  expect(within(section).getByText("Enter your event details and generate your rental quotation.")).toBeInTheDocument();
  expect(within(section).queryByRole("button")).not.toBeInTheDocument();
  expect(within(section).queryByRole("link")).not.toBeInTheDocument();
});
