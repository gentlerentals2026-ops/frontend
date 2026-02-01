import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import AppState from './Reducers/appState'
import {persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER,} from 'redux-persist'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }

  
  //const persistedReducer = persistReducer(persistConfig, rootReducer)
  const persistedReducer = persistReducer(persistConfig, AppState)

  export const store = configureStore({
    reducer: {appState:persistedReducer},
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })