import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import AppHeader from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
const  App = ()=> {

  

  return (
    <div>
    <AppHeader />
      <Box
 
      >
  
        <Routes>
          <Route path="/" element={<Home />} />
     
        </Routes>
      </Box>
      <Footer />
      </div>
  );
}


export default App;
