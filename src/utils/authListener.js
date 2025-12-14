import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { setCurrentUser, logoutUser } from "@/redux/user/userSlice";

export const initAuthListener = (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        setCurrentUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );
    } else {
      dispatch(logoutUser());
    }
  });
};
