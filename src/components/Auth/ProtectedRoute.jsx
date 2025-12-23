"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AppLoader from "@/components/Loader/AppLoader";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { currentUser, authChecked } = useSelector((state) => state.user);

  useEffect(() => {
    if (!authChecked) return;

    if (!currentUser) {
      toast.error("Please sign in to continue", {
        id: "auth-required",
      });

      router.replace("/");
    }
  }, [currentUser, authChecked, router]);

  if (!authChecked) {
    return <AppLoader text="Checking authentication…" />;
  }

  if (!currentUser) return null;

  return children;
}
