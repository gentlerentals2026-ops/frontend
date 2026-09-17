import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthService } from "../../services/auth/Auth";
import { AuthCard, PasswordField } from "./AuthCard";

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [mode, setMode] = useState("request");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "request") {
        await AuthService.forgotPassword(form.email);
        setMode("reset"); setNotice("If the email exists, a reset code has been sent.");
      } else {
        await AuthService.resetPassword(form);
        setMode("done"); setForm({ email: "", otp: "", newPassword: "" });
        setNotice("Password reset successful. You can log in now.");
      }
    } catch (error) { setError(error.message || "Unable to reset password."); }
    finally { busyRef.current = false; setBusy(false); }
  };
  return <AuthCard title="Forgot your password?" subtitle="Enter the email address associated with your account and we'll send you a code to reset your password.">
    {error && <p role="alert" className="customer-auth__error">{error}</p>}
    {notice && <p role="status" className="customer-auth__notice">{notice}</p>}
    {mode !== "done" && <form onSubmit={submit} aria-busy={busy}>
      <label className="customer-auth__field">Email Address<input name="email" type="email" autoComplete="email" required value={form.email} onChange={change} disabled={busy || mode === "reset"} /></label>
      {mode === "reset" && <>
        <label className="customer-auth__field">Reset Code<input name="otp" inputMode="numeric" autoComplete="one-time-code" required value={form.otp} onChange={change} disabled={busy} /></label>
        <PasswordField name="newPassword" label="New Password" autoComplete="new-password" value={form.newPassword} onChange={change} disabled={busy} />
      </>}
      <button className="customer-auth__submit" disabled={busy} type="submit">{busy ? (mode === "request" ? "Sending..." : "Resetting...") : (mode === "request" ? "Send Reset Code" : "Reset Password")}</button>
    </form>}
    {mode === "reset" && <p className="customer-auth__switch"><button type="button" disabled={busy} onClick={() => { setMode("request"); setForm({ ...form, otp: "", newPassword: "" }); setError(""); setNotice(""); }}>Request another code</button></p>}
    <p className="customer-auth__switch"><Link to="/account">Back to Login</Link></p>
  </AuthCard>;
}
