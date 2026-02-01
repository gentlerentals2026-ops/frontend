import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user:{},
  isAuthenticated : false, 
  acesssToken:"",

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
},
})

// Action creators are generated for each case reducer function
export const {setUser,setIsAuthenticated,setAccessToken} = AppState.actions

export default AppState.reducer