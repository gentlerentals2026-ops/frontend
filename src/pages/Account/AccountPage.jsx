import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AccountService } from "../../services/account/account";
import { AuthService } from "../../services/auth/Auth";
import { setAccessToken, setIsAuthenticated, setUser } from "../../Redux/Reducers/appState";
import { AuthCard, PasswordField } from "./AuthCard";

export default function AccountPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const signup = params.get("mode") === "signup";
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState("");
  useEffect(() => { setError(""); }, [signup]);
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setError("");
    try {
      const response = signup
        ? await AccountService.register(form)
        : await AuthService.login({ email: form.email, password: form.password });
      dispatch(setUser(response.data.user));
      dispatch(setIsAuthenticated(true));
      dispatch(setAccessToken(response.data.token));
      navigate("/products");
    } catch (error) { setError(error.message || (signup ? "Unable to create account." : "Unable to login.")); }
    finally { busyRef.current = false; setBusy(false); }
  };
  return <AuthCard title={signup ? "Create your account" : "Welcome back"} subtitle={signup ? "Sign up to book rentals faster and keep track of your activity." : "Login to manage your rentals and continue browsing."}>
    {error && <p className="customer-auth__error" role="alert">{error}</p>}
    <form onSubmit={submit} aria-busy={busy}>
      {signup && <label className="customer-auth__field">Full Name<input name="fullName" autoComplete="name" required value={form.fullName} onChange={change} disabled={busy} /></label>}
      <label className="customer-auth__field">Email Address<input name="email" type="email" autoComplete="email" required value={form.email} onChange={change} disabled={busy} /></label>
      {signup && <label className="customer-auth__field">Phone Number<input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={change} disabled={busy} /></label>}
      <PasswordField key={signup ? "signup" : "login"} name="password" label="Password" autoComplete={signup ? "new-password" : "current-password"} value={form.password} onChange={change} disabled={busy} />
      {!signup && <div className="customer-auth__recovery"><Link to="/forgot-password">Forgot password?</Link></div>}
      <button className="customer-auth__submit" type="submit" disabled={busy}>{busy ? (signup ? "Creating account..." : "Logging in...") : (signup ? "Create Account" : "Login")}</button>
    </form>
    <p className="customer-auth__switch">{signup ? "Already have an account? " : "Don't have an account? "}<Link to={signup ? "/account" : "/account?mode=signup"}>{signup ? "Login" : "Create an account"}</Link></p>
  </AuthCard>;
}
