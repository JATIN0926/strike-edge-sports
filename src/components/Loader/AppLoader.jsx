"use client";

import { motion } from "framer-motion";

const dotVariants = {
  initial: { y: 0, opacity: 0.6 },
  animate: {
    y: [-6, 6, -6],
    opacity: [0.6, 1, 0.6],
  },
};

export default function AppLoader({ text = "Loading" }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f8fa]">
      {/* Glow */}
      <div className="absolute w-40 h-40 rounded-full bg-emerald-400/20 blur-3xl" />

      {/* Dots */}
      <div className="relative z-10 flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            className="
              w-4 h-4 rounded-full
              bg-emerald-600
              shadow-[0_0_15px_rgba(16,185,129,0.6)]
            "
          />
        ))}
      </div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-sm text-black/60 tracking-wide"
      >
        {text}
      </motion.p>
    </div>
  );
}
    