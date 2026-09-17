import { useEffect, useRef, useState } from "react";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import "./ServiceSection.css";

const benefits = [
  { title: "Tents", Icon: HolidayVillageOutlinedIcon },
  { title: "24/7 Customer Care", Icon: SupportAgentOutlinedIcon },
  { title: "We Deliver To You", Icon: LocalShippingOutlinedIcon },
  { title: "Satisfaction Guaranteed", Icon: VerifiedUserOutlinedIcon },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section id="services" ref={sectionRef} className={`service-benefits${entered ? " service-benefits--entered" : ""}`} aria-labelledby="service-benefits-title">
      <div className="service-benefits__inner">
        <header className="service-benefits__intro">
          <div>
            <p className="service-benefits__eyebrow">WELCOME</p>
            <h2 id="service-benefits-title">We Provide Quality Rental Services to You</h2>
          </div>
          <p className="service-benefits__description">We provide quality services by offering well-maintained rental equipment, exceptional customer care, and seamless booking experiences.</p>
        </header>
        <ul className="service-benefits__grid">
          {benefits.map(({ title, Icon }, index) => (
            <li className="service-benefits__item" key={title} style={{ "--benefit-delay": `${index * 80}ms` }}>
              <div className="service-benefits__card">
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
