import Slider from "../../components/Slider/Slider";
import ServicesSection from "./ServiceSection";
import ProductPage from "./Product/Product";
import RentalSteps from "./RentalSteps";
const Home = ()=> {

  

  return (
    <div >
         <Slider />
         <ProductPage />
         <RentalSteps />
         <ServicesSection />
 
      </div>
  );
}


export default Home;
