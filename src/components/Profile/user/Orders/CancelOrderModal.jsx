"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "react-hot-toast";

const REASONS = [
  "Ordered by mistake",
  "Found better price elsewhere",
  "Delivery time too long",
  "Changed my mind",
  "Other",
];

export default function CancelOrderModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const finalReason = reason === "Other" ? customReason : reason;

  const handleConfirm = () => {
    if (finalReason) {
      onConfirm(finalReason);
      // Reset state
      setReason("");
      setCustomReason("");
    } else {
      toast.error("Please Select Cancellation Reason");
    }
  };

  const handleClose = () => {
    setReason("");
    setCustomReason("");
    onClose();
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="
                w-full max-w-md pointer-events-auto
                bg-white/90 backdrop-blur-xl
                rounded-3xl
                shadow-2xl shadow-red-500/10
                border border-white/50
                overflow-hidden
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-br from-red-50 to-orange-50 p-6 pb-8">
                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="
                    cursor-pointer
                    absolute top-4 right-4
                    w-8 h-8 rounded-full
                    bg-white/80 backdrop-blur
                    border border-black/5
                    flex items-center justify-center
                    text-black/60 hover:text-black
                    transition-colors
                  "
                >
                  <X size={18} />
                </motion.button>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="
                    w-16 h-16 mx-auto mb-4
                    rounded-2xl
                    bg-gradient-to-br from-red-500 to-orange-500
                    flex items-center justify-center
                    shadow-lg shadow-red-500/30
                  "
                >
                  <AlertTriangle className="text-white" size={32} />
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-center text-black"
                >
                  Cancel Order
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm text-center text-black/60 mt-2"
                >
                  This action cannot be undone. Please select a reason.
                </motion.p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Reason Selector */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-black mb-2">
                    Cancellation Reason
                  </label>
                  <div className="relative">
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="
                        w-full p-3 pr-10 rounded-xl
                        bg-white/70 backdrop-blur
                        border border-black/10
                        focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50
                        transition-all duration-200
                        appearance-none
                        cursor-pointer
                      "
                    >
                      <option value="">Select a reason...</option>
                      {REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-black/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Custom reason textarea */}
                <AnimatePresence>
                  {reason === "Other" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-black mb-2">
                        Please specify
                      </label>
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Write your reason here..."
                        rows={3}
                        className="
                          w-full p-3 rounded-xl
                          bg-white/70 backdrop-blur
                          border border-black/10
                          focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50
                          transition-all duration-200
                          resize-none
                        "
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex gap-3 pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="
                      cursor-pointer
                      flex-1 px-5 py-3 rounded-xl
                      bg-white/70 backdrop-blur
                      border border-black/10
                      text-black font-semibold
                      hover:bg-white hover:border-black/20
                      transition-all duration-200
                    "
                  >
                    Go Back
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: finalReason ? 1.02 : 1 }}
                    whileTap={{ scale: finalReason ? 0.98 : 1 }}
                    onClick={handleConfirm}
                    className="
                      cursor-pointer
                      flex-1 px-5 py-3 rounded-xl
                      bg-gradient-to-r from-red-600 to-orange-600
                      text-white font-semibold
                      shadow-lg shadow-red-500/30
                      hover:shadow-xl hover:shadow-red-500/40
                      disabled:opacity-50 disabled:cursor-not-allowed
                      disabled:shadow-none
                      transition-all duration-200
                    "
                  >
                    Cancel Order
                  </motion.button>
                </motion.div>

                {/* Warning note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="
                    flex items-start gap-2 p-3 rounded-xl
                    bg-amber-50/80 backdrop-blur
                    border border-amber-200/50
                  "
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-amber-600"
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
                  <p className="text-xs text-amber-700">
                    Once cancelled, you cannot undo this action. Make sure you
                    want to proceed.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Portal se render karo - document.body me
  return createPortal(modalContent, document.body);
}