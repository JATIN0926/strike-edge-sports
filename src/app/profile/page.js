"use client";

import ProfileLayout from "@/components/Profile/ProfileLayout";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileLayout />
    </ProtectedRoute>
  );
}
