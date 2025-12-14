"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AuthModal({ open, onClose, onGoogleSignIn }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="
              fixed z-50 top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              w-[90%] max-w-sm
              rounded-2xl
              bg-black/80 backdrop-blur-xl
              border border-white/15
              shadow-[0_20px_60px_rgba(0,0,0,0.8)]
              p-6
            "
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-white text-xl font-semibold">
                Welcome to StrikeEdgeSports
              </h2>

              <p className="text-white/60 text-sm">
                Sign in to continue shopping premium cricket gear
              </p>

              <button
                onClick={onGoogleSignIn}
                className=" cursor-pointer
    mt-4 w-full py-2.5 rounded-full
    bg-white text-black
    text-sm font-semibold
    hover:bg-gray-200 transition
    flex items-center justify-center gap-3
  "
              >
                {/* Google Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.7 2.3 30.3 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.8 6C12.1 13.1 17.6 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.1 24.5c0-1.7-.1-3-.4-4.4H24v8.4h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.3 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6l-7.8-6C.9 16.7 0 20.2 0 24s.9 7.3 2.5 10.6l7.8-6z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.3 0 11.7-2.1 15.6-5.7l-7.4-5.7c-2 1.4-4.7 2.3-8.2 2.3-6.4 0-11.9-3.6-13.7-8.8l-7.8 6C6.4 42.6 14.6 48 24 48z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
