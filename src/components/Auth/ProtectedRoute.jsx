"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AppLoader from "@/components/Loader/AppLoader";
import { setShowAuthModal } from "@/redux/slices/userSlice";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser, authChecked } = useSelector((state) => state.user);

  useEffect(() => {
    if (!authChecked) return;

    if (!currentUser) {
      toast.error("Please sign in to continue", {
        id: "auth-required",
      });

      dispatch(setShowAuthModal(true)); 

      router.replace("/");
    }
  }, [currentUser, authChecked, router,dispatch]);

  if (!authChecked) {
    return <AppLoader text="Checking authentication…" />;
  }

  if (!currentUser) return null;

  return children;
}
