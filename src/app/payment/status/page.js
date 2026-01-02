"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import AppLoader from "@/components/Loader/AppLoader";

export default function PaymentStatus() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const orderId = params.get("order_id");

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!orderId) return;
  
    let attempts = 0;
    const maxAttempts = 30;   // ~60 seconds
    const delay = 2000;       // 2 sec each
  
    const interval = setInterval(async () => {
      attempts++;
  
      try {
        const res = await axiosInstance.get(`/api/orders/by-cf/${orderId}`);
  
        if (res.data?.order) {
          setStatus("success");
  
          toast.success("Payment confirmed 🎉");
  
          dispatch(clearCart());
  
          clearInterval(interval);
  
          setTimeout(() => router.replace("/order-success"), 1500);
        }
      } catch (err) {
        // ignore errors — webhook may still be processing
      }
  
      if (attempts === 15) {
        toast("Still verifying payment…", { icon: "⏳" });
      }
  
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setStatus("failed");
      }
    }, delay);
  
    return () => clearInterval(interval);
  }, [orderId]);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fa] via-white to-blue-50/30 pt-20 sm:pt-28 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* CHECKING STATE */}
          {status === "checking" && (
            <motion.div
              key="checking"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="
                text-center
                p-8 sm:p-12 lg:p-16
                rounded-3xl
                bg-white/70 backdrop-blur-xl
                border border-white/50
                shadow-2xl shadow-blue-500/10
              "
            >
              {/* Animated Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="
                  w-20 h-20 sm:w-24 sm:h-24
                  mx-auto mb-6 sm:mb-8
                  rounded-full
                  bg-gradient-to-br from-emerald-500 to-blue-500
                  flex items-center justify-center
                  shadow-lg shadow-emerald-500/30
                "
              >
                <Loader2 className="text-white" size={40} strokeWidth={2.5} />
              </motion.div>

              {/* Text */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="
                  text-2xl sm:text-3xl lg:text-4xl
                  font-bold text-black mb-3 sm:mb-4
                "
              >
                Verifying Payment
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="
                  text-sm sm:text-base lg:text-lg
                  text-black/70 mb-2
                "
              >
                Please wait while we confirm your payment...
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="
                  text-xs sm:text-sm
                  text-black/50
                "
              >
                This usually takes just a few seconds
              </motion.p>

              {/* Warning */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="
                  mt-6 sm:mt-8
                  p-4 sm:p-5
                  rounded-2xl
                  bg-amber-50/80 backdrop-blur
                  border border-amber-200/50
                "
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
                    <strong>Important:</strong> Please do not refresh or close this page
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="
                text-center
                p-8 sm:p-12 lg:p-16
                rounded-3xl
                bg-white/70 backdrop-blur-xl
                border border-white/50
                shadow-2xl shadow-emerald-500/10
              "
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="
                  w-20 h-20 sm:w-24 sm:h-24
                  mx-auto mb-6 sm:mb-8
                  rounded-full
                  bg-gradient-to-br from-emerald-500 to-green-600
                  flex items-center justify-center
                  shadow-lg shadow-emerald-500/30
                "
              >
                <CheckCircle className="text-white" size={48} strokeWidth={2.5} />
              </motion.div>

              {/* Text */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="
                  text-2xl sm:text-3xl lg:text-4xl
                  font-bold
                  bg-gradient-to-r from-emerald-600 to-green-600
                  bg-clip-text text-transparent
                  mb-3 sm:mb-4
                "
              >
                Payment Successful! 🎉
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="
                  text-sm sm:text-base lg:text-lg
                  text-black/70
                "
              >
                Your order has been confirmed
              </motion.p>

              {/* Success Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="
                  mt-6 sm:mt-8
                  p-4 sm:p-5
                  rounded-2xl
                  bg-gradient-to-br from-emerald-50/80 to-green-50/80
                  backdrop-blur
                  border border-emerald-200/50
                "
              >
                <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                  Redirecting you to order details...
                </p>
              </motion.div>

              {/* Loading Dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center gap-1.5 mt-6"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* FAILED STATE */}
          {status === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="
                text-center
                p-8 sm:p-12 lg:p-16
                rounded-3xl
                bg-white/70 backdrop-blur-xl
                border border-white/50
                shadow-2xl shadow-red-500/10
              "
            >
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="
                  w-20 h-20 sm:w-24 sm:h-24
                  mx-auto mb-6 sm:mb-8
                  rounded-full
                  bg-gradient-to-br from-red-500 to-orange-600
                  flex items-center justify-center
                  shadow-lg shadow-red-500/30
                "
              >
                <XCircle className="text-white" size={48} strokeWidth={2.5} />
              </motion.div>

              {/* Text */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="
                  text-2xl sm:text-3xl lg:text-4xl
                  font-bold text-red-600
                  mb-3 sm:mb-4
                "
              >
                Payment Verification Failed
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="
                  text-sm sm:text-base lg:text-lg
                  text-black/70 mb-2
                "
              >
                We couldn't verify your payment at this moment
              </motion.p>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="
                  mt-6 sm:mt-8
                  p-4 sm:p-5
                  rounded-2xl
                  bg-blue-50/80 backdrop-blur
                  border border-blue-200/50
                "
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700 leading-relaxed text-left">
                    If money was deducted from your account, don't worry! Your order will be created automatically within a few minutes. Check your orders page or email for confirmation.
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.replace("/profile?tab=orders")}
                  className="
                    cursor-pointer
                    flex-1
                    flex items-center justify-center gap-2
                    px-6 py-3 sm:py-3.5
                    rounded-xl
                    bg-white/70 backdrop-blur
                    border border-black/10
                    text-black font-semibold text-sm sm:text-base
                    hover:bg-white hover:border-black/20
                    transition-all duration-200
                  "
                >
                  <ShoppingBag size={18} />
                  <span>Check Orders</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.replace("/checkout")}
                  className="
                    cursor-pointer
                    flex-1
                    flex items-center justify-center gap-2
                    px-6 py-3 sm:py-3.5
                    rounded-xl
                    bg-gradient-to-r from-emerald-500 to-green-600
                    text-white font-semibold text-sm sm:text-base
                    shadow-lg shadow-emerald-500/30
                    hover:shadow-xl hover:shadow-emerald-500/40
                    transition-all duration-200
                  "
                >
                  <span>Back to Checkout</span>
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}