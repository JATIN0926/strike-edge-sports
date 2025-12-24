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
    toggleSavedProduct: (state, action) => {
      const productId = action.payload;

      if (!state.currentUser) return;

      const saved = state.currentUser.savedProducts || [];

      if (saved.includes(productId)) {
        state.currentUser.savedProducts = saved.filter(
          (id) => id !== productId
        );
      } else {
        state.currentUser.savedProducts = [...saved, productId];
      }
    },
  },
});

export const {
  setCurrentUser,
  logoutUser,
  setAuthChecked,
  toggleSavedProduct,
} = userSlice.actions;

export default userSlice.reducer;
