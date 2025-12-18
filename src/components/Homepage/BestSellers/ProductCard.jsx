"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        relative group 
        rounded-2xl overflow-hidden
        bg-[#0b0b0b]
        border border-white/10
        hover:border-white/30
        shadow-[0_0_0_rgba(0,0,0,0)]
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)]
        transition
      "
    >
      {/* Glass sweep */}
      <div
        className="
          pointer-events-none absolute inset-0
          before:absolute before:inset-0
          before:-translate-x-full
          before:bg-gradient-to-r
          before:from-transparent
          before:via-white/10
          before:to-transparent
          group-hover:before:translate-x-full
          before:transition-transform
          before:duration-700
        "
      />

      {/* Image */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 relative z-10">
        <h3
          className="
            text-white text-xl font-semibold
            tracking-wide leading-snug
            font-[var(--font-sora)]
          "
        >
          {product.name}
        </h3>

        <p
          className="
            mt- text-lg font-medium
            text-emerald-400
            font-[var(--font-inter)]
          "
        >
          ₹ {product.price}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="
            cursor-pointer mt-6 w-full py-2.5 rounded-full
            bg-white text-black text-sm font-semibold
            hover:bg-gray-200 transition
          "
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
