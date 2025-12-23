"use client"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function SeeMoreProductsCTA() {
  const router = useRouter();

  return (
    <div className="flex justify-center mt-6 mb-10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/products")}
        className=" cursor-pointer
          relative group
          px-10 py-4
          rounded-full
          bg-black text-white
          font-semibold text-sm md:text-base
          tracking-wide
          shadow-lg shadow-black/20
          transition
          overflow-hidden
        "
      >
        {/* Glow layer */}
        <span
          className="
            absolute inset-0
            bg-gradient-to-r from-emerald-400 to-green-500
            opacity-0 group-hover:opacity-20
            transition
          "
        />

        {/* Text */}
        <span className="relative z-10">
          See All Products →
        </span>
      </motion.button>
    </div>
  );
}

export default SeeMoreProductsCTA