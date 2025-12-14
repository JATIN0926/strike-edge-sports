"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function GoToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="
        cursor-pointer fixed bottom-6 right-6 z-50
        h-11 w-11 rounded-full
        bg-white text-black
        flex items-center justify-center
        shadow-lg
      "
    >
      <ArrowUp size={18} />
    </motion.button>
  );
}
