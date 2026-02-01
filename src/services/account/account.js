import { API } from "../../constant/apiConstant";


export const AccountService = {

     register: async(user)=>{
      try {
      const response = await fetch(`${API.BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
    const json = await response.json();
    return json;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }

}
}