import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import AppHeader from "./components/Header/Header";
import Home from "./pages/Home/Home";

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

      </div>
  );
}


export default App;
