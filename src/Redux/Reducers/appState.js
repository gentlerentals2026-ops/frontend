import { createSlice } from '@reduxjs/toolkit'

export const defaultSiteSettings = {
  siteName: "Gentle Renters",
  logoUrl: "",
  topBarColor: "#f59e0b",
  addToCartColor: "#f59e0b",
  footerBackgroundColor: "#000000",
  brochureUrl: "",
  brochurePublicId: "",
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  tiktokUrl: "",
  faqs: [
    {
      question: "How do I request a quotation?",
      answer: "Browse listings, add your preferred items to cart, and generate a quotation with your event date and location."
    },
    {
      question: "Do you deliver event rentals?",
      answer: "Yes. Delivery and logistics can be arranged based on your event location and booking details."
    }
  ],
  privacyPolicyContent:
    "We respect your privacy and only use your personal details to process quotations, bookings, customer support, and service communication.",
  cancellationPolicyContent:
    "Cancellations should be communicated early so we can review timing, logistics, and any non-refundable arrangements already committed to your booking.",
  brochureContent:
    "Our brochure highlights featured rental collections, event styling inspiration, and booking guidance for your celebration.",
  sliderImages: [
    "https://plus.unsplash.com/premium_photo-1679280550151-4c56e920b277?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY5fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1722768331920-eeedb2e1c73f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDkxfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1714520270545-937450f41506?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1754407189758-fde7fb4394ad?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D"
  ],
  sliderSpeed: 3000
};

const initialState = {
  user:{},
  isAuthenticated : false, 
  acesssToken:"",
  siteSettings: defaultSiteSettings
}

const  AppState = createSlice({
  name: 'appState',
  initialState,
  reducers: {
     setUser: (state,action) => {     
  state.user = action.payload;
},
setIsAuthenticated: (state,action) => {     
  state.isAuthenticated  = action.payload;
},
setAccessToken: (state,action) => {     
  state.acesssToken  = action.payload;
},
setSiteSettings: (state, action) => {
  state.siteSettings = {
    ...state.siteSettings,
    ...action.payload
  };
},
},
})

// Action creators are generated for each case reducer function
export const {setUser,setIsAuthenticated,setAccessToken,setSiteSettings} = AppState.actions

export default AppState.reducer
