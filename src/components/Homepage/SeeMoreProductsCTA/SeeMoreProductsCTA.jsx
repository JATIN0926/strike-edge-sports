"use client"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

function SeeMoreProductsCTA() {
  const router = useRouter();

  return (
    <div className="flex justify-center mt-16 mb-10">
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/products")}
        className="
          cursor-pointer
          relative group
          px-12 py-4
          rounded-2xl
          bg-white/60 backdrop-blur-md
          border-2 border-black/10
          hover:border-emerald-500/50
          text-black
          font-semibold text-sm md:text-base
          shadow-lg shadow-black/5
          hover:shadow-xl hover:shadow-emerald-500/20
          transition-all duration-300
          overflow-hidden
        "
      >
        {/* Animated gradient background */}
        <span
          className="
            absolute inset-0
            bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          "
        />

        {/* Shimmer effect */}
        <span 
          className="
            absolute inset-0 
            bg-gradient-to-r from-transparent via-white/40 to-transparent 
            translate-x-[-200%] 
            group-hover:translate-x-[200%] 
            transition-transform duration-1000
          " 
        />

        {/* Text with icon */}
        <span className="relative z-10 flex items-center gap-2">
          <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
          <span>View All Products</span>
        </span>
      </motion.button>
    </div>
  );
}

export default SeeMoreProductsCTA