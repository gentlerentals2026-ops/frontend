import { useId, useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import "./auth.css";

export function AuthCard({ title, subtitle, children }) {
  const { siteSettings } = useSiteSettings();
  const headingId = useId();
  return <section className="customer-auth" style={{ "--auth-brand": siteSettings.topBarColor }} aria-labelledby={headingId}>
    <div className="customer-auth__card">
      <h1 id={headingId}>{title}</h1>
      <p className="customer-auth__subtitle">{subtitle}</p>
      {children}
    </div>
  </section>;
}

export function PasswordField({ label, ...props }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return <div className="customer-auth__field">
    <label htmlFor={id}>{label}</label>
    <div className="customer-auth__password">
      <input {...props} id={id} required type={visible ? "text" : "password"} />
      <button type="button" aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-pressed={visible} disabled={props.disabled} onClick={() => setVisible(!visible)}>{visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</button>
    </div>
  </div>;
}
