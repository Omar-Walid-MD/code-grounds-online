import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    websocket: {},
    lastJsonMessage: {},
    userId: "",
    loading: true,
}



export const setWebsocket = createAsyncThunk(
    'websocket/setWebsocket',
    (newState) => {
      return newState;
});

export const setLastJsonMessage = createAsyncThunk(
  'websocket/setLastJsonMessage',
  (newState) => {
    return newState;
});
  
export const slice = createSlice({
    name: "websocket",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder


      //setWebsocket
      .addCase(setWebsocket.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(setWebsocket.fulfilled, (state, action) => {
        state.websocket = action.payload;
        state.loading = false;
      })
      .addCase(setWebsocket.rejected, (state, action) => {
        state.loading = false;
      })

      //setLastJsonMessage
      .addCase(setLastJsonMessage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(setLastJsonMessage.fulfilled, (state, action) => {
        state.lastJsonMessage = action.payload;
        state.loading = false;
      })
      .addCase(setLastJsonMessage.rejected, (state, action) => {
        state.loading = false;
      })


  
    },
});

export default slice.reducer;