import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import "./RentalSteps.css";

const steps = [
  { title: "Explore Rentals", description: "Browse our collection and find the perfect items for your event.", Icon: SearchIcon },
  { title: "Add Your Items", description: "Choose what you need and add the required quantities to your cart.", Icon: ShoppingCartOutlinedIcon },
  { title: "Get Your Quote", description: "Enter your event details and generate your rental quotation.", Icon: DescriptionOutlinedIcon },
  { title: "Confirm & Get Ready", description: "Confirm your booking and arrange delivery or pickup for your event.", Icon: LocalShippingOutlinedIcon },
];

export default function RentalSteps() {
  return (
    <section className="rental-steps" aria-labelledby="rental-steps-title">
      <div className="rental-steps__inner">
        <h2 id="rental-steps-title">Renting Made Simple</h2>
        <p className="rental-steps__subtitle">Everything you need for your event, in four easy steps.</p>
        <ol className="rental-steps__grid">
          {steps.map(({ title, description, Icon }, index) => (
            <li className="rental-steps__step" key={title}>
              <div className="rental-steps__marker" aria-hidden="true">
                <Icon />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
