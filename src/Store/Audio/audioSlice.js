import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, database } from '../../Firebase/firebase';
import { updateUserInfo } from '../../Firebase/DataHandlers/users';
import { ref, remove } from 'firebase/database';
import { deleteUser } from 'firebase/auth';

const initialState = {
    audioPlaying: []
}

export const playAudio = createAsyncThunk(
    'audio/playAudio',
    (audio) => {
      return audio;
});

export const stopAudio = createAsyncThunk(
    'audio/stopAudio',
    (audio) => {
      return audio;
});

export const slice = createSlice({
    name: "audio",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder


      //playAudio
      .addCase(playAudio.fulfilled, (state, action) => {
        state.audioPlaying.push(action.payload);
      })
      
      //stopAudio
      .addCase(stopAudio.fulfilled, (state, action) => {
        state.audioPlaying = state.audioPlaying.filter((audio) => audio !== action.payload);
      })
        
    },
});

export default slice.reducer;