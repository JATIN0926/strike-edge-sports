"use client";

import ProfileLayout from "@/components/Profile/ProfileLayout";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { currentUser, authChecked } = useSelector((state) => state.user);

  const router = useRouter;
  useEffect(() => {
    if (!authChecked) return; // wait

    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, authChecked]);

  return <ProfileLayout />;
}
