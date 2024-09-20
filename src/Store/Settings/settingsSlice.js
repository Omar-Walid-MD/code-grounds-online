import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    
}

export const getTutorialPopupsDisbled = createAsyncThunk(
    'settings/getTutorialPopupsDisbled',
    () => {
        return localStorage.getItem("tutorial-popups-disabled");
});

export const disableTutorialPopups = createAsyncThunk(
    'settings/disableTutorialPopups',
    (enabled) => {
        return enabled;
});

export const slice = createSlice({
    name: "settings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder

      //getTutorialPopupsDisbled
      .addCase(getTutorialPopupsDisbled.fulfilled, (state, {payload}) => {
        if(payload)
        {
            document.querySelector("html").setAttribute("tutorial-popups-disabled","true");
        }
      })

      //disableTutorialPopups
      .addCase(disableTutorialPopups.fulfilled, (state, {payload}) => {
        document.querySelector("html").setAttribute("tutorial-popups-disabled","true");
        localStorage.setItem("tutorial-popups-disabled","true");
      })
        
    },
});

export default slice.reducer;