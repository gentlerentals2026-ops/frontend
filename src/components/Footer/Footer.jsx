import { useRef, useState } from "react";
import { Facebook, Instagram, Twitter, MusicNote } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { API } from "../../constant/apiConstant";
import { getErrorMessage, parseJsonSafely } from "../../utils/http";
import "./Footer.css";

const quickLinks = [["Home", "/"], ["About Us", "/about"], ["Contact Us", "/contact"], ["Equipment", "/products"]];
const helpLinks = [["FAQs", "/faqs"], ["Privacy Policy", "/privacy-policy"], ["Cancellation Policy", "/cancellation-policy"], ["Brochure", "/brochure"]];
const safeSocialUrl = value => {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
};

export default function Footer() {
  const { siteSettings } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const socialLinks = [
    { label: "Facebook", url: siteSettings.facebookUrl, Icon: Facebook },
    { label: "Instagram", url: siteSettings.instagramUrl, Icon: Instagram },
    { label: "X / Twitter", url: siteSettings.twitterUrl, Icon: Twitter },
    { label: "TikTok", url: siteSettings.tiktokUrl, Icon: MusicNote }
  ];
  const subscribe = async event => {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); setMessage(""); setError("");
    try {
      const response = await fetch(`${API.BASE_URL}/api/newsletter/subscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim().toLowerCase() }) });
      const payload = await parseJsonSafely(response);
      if (!response.ok) throw new Error(getErrorMessage(response, payload, "Unable to subscribe. Please try again."));
      setMessage("You're subscribed. Thank you for joining us!"); setEmail("");
    } catch (error) { setError(error.message || "Unable to subscribe. Please try again."); }
    finally { busyRef.current = false; setBusy(false); }
  };
  return <footer className="customer-footer" style={{ "--footer-brand": siteSettings.topBarColor, backgroundColor: siteSettings.footerBackgroundColor || "#000000" }}>
    <div className="customer-footer__inner">
      <div className="customer-footer__grid">
        <div className="customer-footer__brand">
          <img className="customer-footer__logo" src={siteSettings.logoUrl || "/logo.png"} alt={`${siteSettings.siteName || "Gentle Events"} logo`} loading="lazy" />
          <p className="customer-footer__tagline">We've got your event(s) covered</p>
          <address className="customer-footer__contact">
            <div><span>Phone</span><a href="tel:+2348148928379">+2348148928379</a></div>
            <div><span>Email</span><a href="mailto:gentlerentals@gmail.com">gentlerentals@gmail.com</a></div>
            <div><span>Location</span><p>No 23 , Okuokuokor road off fresh ville road,Okpe Delta State</p></div>
          </address>
        </div>
        <div className="customer-footer__links">
          {[["Quick Links", quickLinks], ["Help & Info", helpLinks]].map(([title, links]) => <nav key={title} aria-label={`Footer ${title}`}><h2>{title}</h2><ul>{links.map(([label, to]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul></nav>)}
        </div>
        <section className="customer-footer__newsletter" aria-labelledby="footer-newsletter-heading">
          <h2 id="footer-newsletter-heading">Stay in the Loop</h2>
          <p>Get rental updates, new arrivals and event inspiration.</p>
          <form onSubmit={subscribe} aria-label="Newsletter subscription" aria-busy={busy}>
            <label htmlFor="footer-newsletter-email">Email address</label>
            <input id="footer-newsletter-email" type="email" name="email" autoComplete="email" placeholder="Your email address" required value={email} onChange={event => setEmail(event.target.value)} disabled={busy} />
            <button type="submit" disabled={busy}>{busy ? "Subscribing..." : "Subscribe"}</button>
          </form>
          {message && <p role="status" className="customer-footer__feedback">{message}</p>}
          {error && <p role="alert" className="customer-footer__feedback">{error}</p>}
          <div className="customer-footer__social" aria-label="Social media">
            {socialLinks.map(({ label, url, Icon }) => safeSocialUrl(url)
              ? <a key={label} href={safeSocialUrl(url)} aria-label={label} target="_blank" rel="noopener noreferrer"><Icon /></a>
              : <span key={label} role="img" aria-label={`${label}: link not configured`} title={`${label}: link not configured`}><Icon /></span>)}
          </div>
        </section>
      </div>
      <p className="customer-footer__copyright">&copy; 2026 Gentle Event Rentals. All Rights Reserved.</p>
    </div>
  </footer>;
}
