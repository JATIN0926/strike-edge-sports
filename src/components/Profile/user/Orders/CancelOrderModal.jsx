"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const REASONS = [
  "Ordered by mistake",
  "Found better price elsewhere",
  "Delivery time too long",
  "Changed my mind",
  "Other",
];

export default function CancelOrderModal({
  open,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const finalReason =
    reason === "Other" ? customReason : reason;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="
              w-full max-w-md
              bg-white rounded-2xl
              p-6 shadow-xl
            "
          >
            <h3 className="text-lg font-bold">
              Cancel Order
            </h3>

            <p className="text-sm text-black/60 mt-1">
              This action cannot be undone.
            </p>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-4 p-3 rounded-xl border"
            >
              <option value="">Select reason</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {reason === "Other" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Write reason..."
                className="w-full mt-3 p-3 rounded-xl border resize-none"
              />
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-black/5"
              >
                Close
              </button>

              <button
                onClick={() => onConfirm(finalReason)}
                disabled={!finalReason}
                className="
                  px-4 py-2 rounded-lg
                  bg-red-600 text-white
                  disabled:opacity-50
                "
              >
                Cancel Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
