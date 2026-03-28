import { Routes, Route } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import AppHeader from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import WhatsAppFloat from "./components/WhatsApp/whatsapp";
import ProductsListingPage from "./pages/Products/ProductsListingPage";
import ProductDetailsPage from "./pages/Products/ProductDetailsPage";
import AccountPage from "./pages/Account/AccountPage";
import CartPage from "./pages/Cart/CartPage";
import AboutPage from "./pages/About/AboutPage";
import ContactPage from "./pages/Contact/ContactPage";
import FaqPage from "./pages/Info/FaqPage";
import PolicyPage from "./pages/Info/PolicyPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
const  App = ()=> {

  

  return (
    <div>
      <AppHeader />
      <Toolbar sx={{ minHeight: { xs: 104, md: 112 } }} />
      <Box
 
      >
  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
          <Route path="/cancellation-policy" element={<PolicyPage type="cancellation" />} />
          <Route path="/brochure" element={<PolicyPage type="brochure" />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products" element={<ProductsListingPage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
      <WhatsAppFloat />
      <Footer />
      </div>
  );
}


export default App;
