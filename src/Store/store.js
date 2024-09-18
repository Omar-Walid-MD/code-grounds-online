import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Auth/authSlice';
import audioSlice from './Audio/audioSlice';

export default configureStore({
  reducer: {
    auth: authSlice,
    audio: audioSlice
  }
 
})