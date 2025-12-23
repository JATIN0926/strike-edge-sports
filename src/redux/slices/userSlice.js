import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentUser: null,
  authChecked: false, // 👈 REQUIRED
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.authChecked = true;
    },

    logoutUser: (state) => {
      state.currentUser = null;
      state.authChecked = true; 
    },

    setAuthChecked: (state) => {
      state.authChecked = true;
    },
  },
});

export const { setCurrentUser, logoutUser, setAuthChecked } =
  userSlice.actions;

export default userSlice.reducer;
