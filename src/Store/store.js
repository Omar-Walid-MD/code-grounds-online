import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Auth/authSlice';

export default configureStore({
  reducer: {
    auth: authSlice
  }
 
})