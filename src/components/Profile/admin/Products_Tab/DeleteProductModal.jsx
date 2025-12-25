"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function DeleteProductModal({
  open,
  onClose,
  onConfirm,
  loading,
  productTitle,
}) {
  const [mounted, setMounted] = useState(false);

  /* ---------- mount for portal (SSR safe) ---------- */
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    return () => setMounted(false);
  }, []);

  /* ---------- lock body scroll ---------- */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="
                w-full max-w-md pointer-events-auto
                bg-white/90 backdrop-blur-xl
                rounded-3xl
                shadow-2xl shadow-red-500/10
                border border-white/50
                overflow-hidden
              "
            >
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-br from-red-50 to-orange-50 p-6 pb-8">
                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  disabled={loading}
                  className="
                    cursor-pointer
                    absolute top-4 right-4
                    w-8 h-8 rounded-full
                    bg-white/80 backdrop-blur
                    border border-black/5
                    flex items-center justify-center
                    text-black/60 hover:text-black
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  <X size={18} strokeWidth={2.5} />
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
                  <Trash2 className="text-white" size={32} strokeWidth={2.5} />
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-center text-black"
                >
                  Delete Product
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm text-center text-black/60 mt-2"
                >
                  This action cannot be undone
                </motion.p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Product Info Box */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="
                    p-4 rounded-xl
                    bg-white/70 backdrop-blur
                    border border-black/10
                  "
                >
                  <p className="text-xs font-medium text-black/50 mb-1">
                    Product Name
                  </p>
                  <p className="text-sm font-semibold text-black line-clamp-2">
                    {productTitle}
                  </p>
                </motion.div>

                {/* Warning message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="
                    flex items-start gap-3 p-4 rounded-xl
                    bg-amber-50/80 backdrop-blur
                    border border-amber-200/50
                  "
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="text-amber-600" size={16} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Once deleted, this product will be permanently removed from your inventory and cannot be recovered.
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3 pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    disabled={loading}
                    className="
                      cursor-pointer
                      flex-1 px-5 py-3 rounded-xl
                      bg-white/70 backdrop-blur
                      border border-black/10
                      text-black font-semibold text-sm
                      hover:bg-white hover:border-black/20
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                    "
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    onClick={onConfirm}
                    disabled={loading}
                    className="
                      cursor-pointer
                      flex-1 px-5 py-3 rounded-xl
                      bg-gradient-to-r from-red-600 to-orange-600
                      text-white font-semibold text-sm
                      shadow-lg shadow-red-500/30
                      hover:shadow-xl hover:shadow-red-500/40
                      disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-200
                      flex items-center justify-center gap-2
                    "
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} strokeWidth={2.5} />
                        <span>Delete</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}