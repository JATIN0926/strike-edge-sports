import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import axios from "axios";
import {
  setCurrentUser,
  logoutUser,
  setAuthChecked,
} from "@/redux/slices/userSlice";

export const initAuthListener = (dispatch) => {
  onAuthStateChanged(auth, async (user) => {
    try {
      if (!user) {
        dispatch(logoutUser());
        return;
      }

      const res = await axios.get(`/api/user/me`, { withCredentials: true });

      dispatch(setCurrentUser(res.data.user));
    } catch (err) {
      console.log(err);
      console.log("Auth listener error:", err?.response?.status);

      dispatch(logoutUser());
    } finally {
      dispatch(setAuthChecked());
    }
  });
};
