import { API } from "../../constant/apiConstant";


export const AuthService = {

      login: async (credentials) => {
      
    try {
      const response = await fetch(`${API.BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
    const json = await response.json();
    return json;
    } catch (error) {
      console.error("Error signing in account:", error);
      throw error;
    }

     },
       logout: async (credentials) => {
     
      
    try {
      const response = await fetch(`${API.BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
    const json = await response.json();
    return json;
    } catch (error) {
      console.error("Error signing in account:", error);
      throw error;
    }

     },
    
     getProfile: async ()=>{


     }
      
}