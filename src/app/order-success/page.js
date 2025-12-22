"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="
          max-w-md w-full
          p-8 rounded-2xl
          bg-white/70 backdrop-blur
          border text-center
          shadow-xl
        "
      >
        <CheckCircle size={64} className="mx-auto text-emerald-500 mb-4" />

        <h1 className="text-2xl font-bold mb-2">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-black/60 text-sm mb-6">
          Your order has been placed with Cash on Delivery. You can track it
          from your profile.
        </p>

        <button
          onClick={() => router.push("/profile")}
          className=" cursor-pointer
            w-full py-3 rounded-full
            bg-black text-white font-medium
            hover:bg-emerald-600 transition
          "
        >
          Go to My Orders
        </button>
      </motion.div>
    </div>
  );
}
