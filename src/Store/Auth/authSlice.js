import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, database } from '../../Firebase/firebase';
import { updateUserInfo } from '../../Firebase/DataHandlers/users';
import { ref, remove } from 'firebase/database';
import { deleteUser } from 'firebase/auth';

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
  ({anonymous,updatedUser},{getState}) => {
    if(!anonymous)
    {
      updateUserInfo(getState().auth.user,updatedUser);
    }
    return updatedUser;
});

export const removeUser = createAsyncThunk(
  'auth/removeUser',
  ({anonymous,user}) => {
    if(!anonymous)
    {
      remove(ref(database, 'users/' + user.userId))
      remove(ref(database, 'usernames/' + user.username))
    }
    return null;
});

export const signOut = createAsyncThunk(
  'auth/signOut',
  ({anonymous,username}) => {
    if(anonymous)
    {
      deleteUser(auth.currentUser);
    }
    
    auth.signOut();
    return null;
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

      //signOut
      .addCase(signOut.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state, action) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
      })

  
    },
});

export default slice.reducer;