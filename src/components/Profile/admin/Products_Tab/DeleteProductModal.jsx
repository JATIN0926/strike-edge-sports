"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function DeleteProductModal({
  open,
  onClose,
  onConfirm,
  loading,
  productTitle,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="
              fixed z-50 inset-0
              flex items-center justify-center
              px-4
            "
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div
              className="
                relative w-full max-w-md
                rounded-2xl
                bg-white/80 backdrop-blur-xl
                border border-black/10
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                p-6
              "
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-black/60 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-semibold text-black">
                Delete Product
              </h3>

              <p className="text-sm text-black/60 mt-2">
                Are you sure you want to delete{" "}
                <span className="font-medium text-black">
                  {productTitle}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={onClose}
                  className=" cursor-pointer
                    px-4 py-2 rounded-lg
                    text-sm border border-black/10
                    hover:bg-black/5
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className=" cursor-pointer
                    px-5 py-2 rounded-lg
                    text-sm font-medium
                    bg-red-500 text-white
                    hover:bg-red-600 transition
                    disabled:opacity-60
                  "
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
