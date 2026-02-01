import { API } from "../../constant/apiConstant";


export const ResultService = {

     winnings: async()=>{
      try {
      const response = await fetch(`${API.BASE_URL}/api/winnings/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    const json = await response.json();
    return json;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }

}
}