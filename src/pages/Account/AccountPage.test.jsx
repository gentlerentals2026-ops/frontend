import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AccountPage from "./AccountPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import { AuthService } from "../../services/auth/Auth";
import { AccountService } from "../../services/account/account";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({ useDispatch: () => mockDispatch }));
jest.mock("../../context/SiteSettingsContext", () => ({ useSiteSettings: () => ({ siteSettings: { topBarColor: "#FFD700" } }) }));
jest.mock("../../services/auth/Auth", () => ({ AuthService: { login: jest.fn(), forgotPassword: jest.fn(), resetPassword: jest.fn() } }));
jest.mock("../../services/account/account", () => ({ AccountService: { register: jest.fn() } }));
const renderPage = (path = "/account") => render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/account" element={<AccountPage />} /><Route path="/forgot-password" element={<ForgotPasswordPage />} /><Route path="/products" element={<h1>Rental Listings</h1>} /></Routes></MemoryRouter>);
const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
beforeEach(() => jest.clearAllMocks());

test("login contains only login fields, accessible visibility control and routing links", () => {
  renderPage();
  expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
  expect(screen.getAllByLabelText("Email Address")).toHaveLength(1);
  expect(screen.queryByText(/Delete account/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /reset code/i })).not.toBeInTheDocument();
  fill("Password", "secret");
  fireEvent.click(screen.getByRole("button", { name: "Show password" }));
  expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
  expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute("href", "/forgot-password");
  expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute("href", "/account?mode=signup");
});
test("invalid login errors remain visible and submissions cannot overlap", async () => {
  let reject;
  AuthService.login.mockReturnValue(new Promise((resolve, fail) => { reject = fail; }));
  renderPage(); fill("Email Address", "person@example.test"); fill("Password", "bad");
  const button = screen.getByRole("button", { name: "Login" });
  fireEvent.click(button); fireEvent.click(button);
  expect(AuthService.login).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Logging in..." })).toBeDisabled();
  reject(new Error("Invalid credentials"));
  expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
  expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
});
test("successful login uses existing API payload and Redux session actions", async () => {
  AuthService.login.mockResolvedValue({ data: { user: { fullName: "Customer" }, token: "test-token" } });
  renderPage(); fill("Email Address", "person@example.test"); fill("Password", "secret");
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  await screen.findByRole("heading", { name: "Rental Listings" });
  expect(AuthService.login).toHaveBeenCalledWith({ email: "person@example.test", password: "secret" });
  expect(mockDispatch).toHaveBeenCalledTimes(3);
});
test("signup link preserves existing registration fields and API", async () => {
  AccountService.register.mockResolvedValue({ data: { user: {}, token: "signup-token" } });
  renderPage(); fireEvent.click(screen.getByRole("link", { name: "Create an account" }));
  fill("Full Name", "Test Customer"); fill("Email Address", "person@example.test"); fill("Phone Number", "1234"); fill("Password", "secret");
  fireEvent.click(screen.getByRole("button", { name: "Create Account" }));
  await screen.findByRole("heading", { name: "Rental Listings" });
  expect(AccountService.register).toHaveBeenCalledWith({ fullName: "Test Customer", email: "person@example.test", phone: "1234", password: "secret" });
});
test("dedicated recovery page reuses code request and password reset APIs", async () => {
  AuthService.forgotPassword.mockResolvedValue({}); AuthService.resetPassword.mockResolvedValue({});
  renderPage(); fireEvent.click(screen.getByRole("link", { name: "Forgot password?" }));
  fill("Email Address", "person@example.test"); fireEvent.click(screen.getByRole("button", { name: "Send Reset Code" }));
  await screen.findByLabelText("Reset Code"); fill("Reset Code", "123456"); fill("New Password", "new-password");
  fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Password reset successful"));
  expect(AuthService.forgotPassword).toHaveBeenCalledWith("person@example.test");
  expect(AuthService.resetPassword).toHaveBeenCalledWith({ email: "person@example.test", otp: "123456", newPassword: "new-password" });
  fireEvent.click(screen.getByRole("link", { name: "Back to Login" }));
  expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
});
