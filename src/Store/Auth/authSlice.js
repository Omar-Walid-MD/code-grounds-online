import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth } from '../../Firebase/firebase';
import { updateUserInfo } from '../../Firebase/DataHandlers/users';
import { generateAvatar } from '../../Helpers/avatar';

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
        if(action.payload.avatar)
        {
          action.payload.avatar = generateAvatar(action.payload.avatar);
        }
        state.user = {...state.user,...action.payload};
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
      })

  
    },
});

export default slice.reducer;