"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    image: "/images/hero1.jpg",
    title: "Gear Up Like a Pro",
    desc: "Premium cricket bats, balls & accessories trusted by players.",
  },
  {
    id: 2,
    image: "/images/hero2.jpg",
    title: "Built for Match Day",
    desc: "High-performance gear crafted for serious cricketers.",
  },
  {
    id: 3,
    image: "/images/hero3.jpg",
    title: "Play With Confidence",
    desc: "Train harder. Play smarter. Win bigger.",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter();

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <div
      className="relative w-full h-[70vh] sm:h-[75vh] md:h-[80vh] rounded-3xl overflow-hidden group bg-white shadow-2xl shadow-black/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Image */}
          <Image
            src={slides[index].image}
            alt="Cricket Banner"
            fill
            priority
            className="object-cover"
          />

          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-10 md:px-14">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="
                max-w-xl
                rounded-2xl
                bg-white/80 backdrop-blur-2xl
                border border-white/20
                p-6 sm:p-8 md:p-10
                shadow-2xl
              "
            >
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-black text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight"
              >
                {slides[index].title}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-black/70 mt-3 text-sm sm:text-base md:text-lg leading-relaxed"
              >
                {slides[index].desc}
              </motion.p>

              <motion.button
                onClick={() => router.push("/products")}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="
                  cursor-pointer
                  group/btn
                  mt-6 inline-flex items-center gap-2
                  rounded-xl
                  bg-gradient-to-r from-emerald-500 to-green-600
                  text-white
                  px-8 py-3.5 text-sm font-semibold
                  shadow-lg shadow-emerald-500/30
                  hover:shadow-xl hover:shadow-emerald-500/40
                  transition-all duration-300
                  relative overflow-hidden
                "
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />

                <span className="relative">Shop Now</span>
                <ArrowRight
                  size={18}
                  className="relative group-hover/btn:translate-x-1 transition-transform duration-300"
                  strokeWidth={2.5}
                />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <motion.button
        onClick={prevSlide}
        initial={{ opacity: 0, x: -20 }}
        whileHover={{ scale: 1.15, x: -2 }}
        whileTap={{ scale: 0.95 }}
        className="
          cursor-pointer
          absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20
          h-12 w-12 rounded-full
          bg-white/80 backdrop-blur-xl
          border border-white/20
          text-black
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          shadow-lg hover:shadow-xl
        "
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        onClick={nextSlide}
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ scale: 1.15, x: 2 }}
        whileTap={{ scale: 0.95 }}
        className="
          cursor-pointer
          absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20
          h-12 w-12 rounded-full
          bg-white/80 backdrop-blur-xl
          border border-white/20
          text-black
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          shadow-lg hover:shadow-xl
        "
      >
        <ChevronRight size={24} strokeWidth={2.5} />
      </motion.button>

      {/* Enhanced Dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setIndex(i)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`
              cursor-pointer
              h-2.5 rounded-full transition-all duration-300
              ${
                index === i
                  ? "bg-emerald-500 w-8 shadow-lg shadow-emerald-500/50"
                  : "bg-white/60 w-2.5 hover:bg-white/80"
              }
            `}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <motion.div
          key={index}
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "0%" : "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
        />
      </div>
    </div>
  );
}
