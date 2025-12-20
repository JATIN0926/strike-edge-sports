import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import axios from "axios";
import { setCurrentUser, logoutUser } from "@/redux/user/userSlice";

export const initAuthListener = (dispatch) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        { withCredentials: true }
      );

      dispatch(setCurrentUser(res.data.user));
    } else {
      dispatch(logoutUser());
    }
  });
};
