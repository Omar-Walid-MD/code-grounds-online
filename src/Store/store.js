import { configureStore } from '@reduxjs/toolkit';
import websocketSlice from './Websocket/websocketSlice';
import authSlice from './Auth/authSlice';

export default configureStore({
  reducer: {
    websocket: websocketSlice,
    auth: authSlice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})