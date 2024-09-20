import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Auth/authSlice';
import audioSlice from './Audio/audioSlice';
import settingsSlice from './Settings/settingsSlice';

export default configureStore({
  reducer: {
    auth: authSlice,
    audio: audioSlice,
    settings: settingsSlice
  }
 
})