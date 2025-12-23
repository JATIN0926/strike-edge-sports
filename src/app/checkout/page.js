"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import CheckoutPage from "@/components/Checkout/CheckoutPage";

export default function Page() {
  return (
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  );
}
