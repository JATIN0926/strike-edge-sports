import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { setCurrentUser, logoutUser, setAuthChecked } from "@/redux/slices/userSlice";
import axiosInstance from "./axiosInstance";

export const initAuthListener = (dispatch) => {
  onAuthStateChanged(auth, async (user) => {
    try {
      if (!user) {
        dispatch(logoutUser());
        return;
      }

      const token = await user.getIdToken();

      await axiosInstance.post(`/api/auth/google`, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        token
      });

      const res = await axiosInstance.get(`/api/user/me`);

      dispatch(setCurrentUser(res.data.user));
      toast.success("Logged in successfully 🎉", { id: "google-auth" });
    } catch (err) {
      console.log("Auth listener error:", err);
      dispatch(logoutUser());
    } finally {
      dispatch(setAuthChecked());
    }
  });
};
