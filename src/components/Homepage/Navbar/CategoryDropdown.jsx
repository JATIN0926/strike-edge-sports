"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CategoryDropdown({ open, categories, onClose }) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="
            absolute top-full left-1/2 -translate-x-1/2 mt-4
            min-w-[15rem]
            rounded-2xl
            bg-white/100 backdrop-blur-xl
            border border-black/10
            shadow-xl shadow-black/10
            overflow-hidden
            z-50
          "
          onMouseLeave={onClose}
        >
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                router.push(`/products?category=${cat.slug}`);
                onClose();
              }}
              className="
                w-full text-left px-5 py-3
                text-sm font-medium text-black/70
                hover:bg-emerald-50
                hover:text-black
                transition
              "
            >
              {cat.name}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
