import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import axios from "axios";
import { setCurrentUser, logoutUser } from "@/redux/slices/userSlice";

export const initAuthListener = (dispatch) => {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      dispatch(logoutUser());
      return;
    }

    try {
      // ❗ Backend cookie might not be ready yet
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        { withCredentials: true }
      );

      dispatch(setCurrentUser(res.data.user));
    } catch (err) {
      /**
       * IMPORTANT:
       * Ignore 401 silently
       * Login flow will set user manually
       */
      if (err?.response?.status !== 401) {
        console.error("Auth listener error:", err);
      }
    }
  });
};
