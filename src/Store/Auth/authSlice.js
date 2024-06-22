import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, database } from '../../Firebase/firebase';
import { removeUserFromFirebase, updateUserInfo } from '../../Firebase/DataHandlers/users';
import { generateAvatar } from '../../Helpers/avatar';
import { ref, remove } from 'firebase/database';

const initialState = {
    user: null,
    loading: true,
}

export const setUser = createAsyncThunk(
    'auth/setUser',
    (user) => {
      return user;
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  (update,{getState}) => {
    updateUserInfo(getState().auth.user.userId,update);
    return update;
});

export const removeUser = createAsyncThunk(
  'auth/removeUser',
  (user) => {
    remove(ref(database, 'users/' + user.userId))
    remove(ref(database, 'usernames/' + user.username))
    console.log("here");
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

      //updateUser
      .addCase(updateUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = {...state.user,...action.payload};
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
      })

      //removeUser
      .addCase(removeUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false;
      })

  
    },
});

export default slice.reducer;