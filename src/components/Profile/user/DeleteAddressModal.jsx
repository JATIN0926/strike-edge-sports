"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function DeleteAddressModal({
  open,
  onClose,
  onConfirm,
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
            className="fixed inset-0 z-[101] bg-black/50 backdrop-blur-md"
          />

          {/* Center wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[102] flex items-center justify-center px-4"
          >
            {/* Modal box */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="
                relative w-full max-w-sm
                rounded-2xl
                bg-white/80 backdrop-blur-xl
                border border-black/10
                p-6
                shadow-[0_20px_50px_rgba(0,0,0,0.15)]
              "
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-black/50 hover:text-black cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-semibold text-black">
                Delete Address?
              </h3>

              <p className="mt-2 text-sm text-black/60">
                Are you sure you want to delete this address?  
                This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="
                    px-4 py-2 rounded-full
                    border border-black/15
                    text-sm text-black
                    hover:bg-black/5 transition
                    cursor-pointer
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  className="
                    px-5 py-2 rounded-full
                    bg-red-500 text-white
                    text-sm font-medium
                    hover:bg-red-600 transition
                    cursor-pointer
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
