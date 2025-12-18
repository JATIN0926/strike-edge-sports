"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const nextSlide = () =>
    setIndex((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[70vh] rounded-3xl overflow-hidden group bg-white shadow-xl shadow-black/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
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

          {/* Soft overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center px-6 md:px-14">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="
                max-w-lg
                rounded-3xl
                bg-white/70 backdrop-blur-xl
                border border-black/10
                p-6 md:p-8
                shadow-xl shadow-black/10
              "
            >
              <h1 className="text-black text-3xl md:text-4xl font-bold tracking-tight">
                {slides[index].title}
              </h1>

              <p className="text-black/70 mt-2 text-sm md:text-base">
                {slides[index].desc}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="
                  mt-5 inline-flex items-center
                  rounded-full
                  bg-emerald-600 text-white
                  px-6 py-2.5 text-sm font-medium
                  hover:bg-emerald-700 transition
                "
              >
                Shop Now
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <motion.button
        onClick={prevSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="
          absolute left-4 top-1/2 -translate-y-1/2 z-20
          h-10 w-10 rounded-full
          bg-white/70 backdrop-blur-xl
          border border-black/10
          text-black
          flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition
        "
      >
        <ChevronLeft size={20} />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        onClick={nextSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="
          absolute right-4 top-1/2 -translate-y-1/2 z-20
          h-10 w-10 rounded-full
          bg-white/70 backdrop-blur-xl
          border border-black/10
          text-black
          flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition
        "
      >
        <ChevronRight size={20} />
      </motion.button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              index === i
                ? "bg-emerald-600 w-6"
                : "bg-black/30 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
