import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth } from '../../Firebase/firebase';

const initialState = {
    user: null,
    loading: true,
}



export const setUser = createAsyncThunk(
    'auth/setUser',
    (user) => {
      return user;
});


export const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder


      //setUser
      .addCase(setUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(setUser.rejected, (state, action) => {
        state.loading = false;
      })

  
    },
});

export default slice.reducer;