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
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[70vh] rounded-2xl overflow-hidden relative group">
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

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

          {/* Text */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
            <motion.h1
              key={slides[index].title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-3xl md:text-5xl font-bold max-w-xl tracking-[-2%]"
            >
              {slides[index].title}
            </motion.h1>

            <motion.p
              key={slides[index].desc}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-white/80 mt-2 max-w-md"
            >
              {slides[index].desc}
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-6 w-fit px-6 py-3 bg-white text-black rounded-full text-sm font-medium cursor-pointer"
            >
              Shop Now
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <motion.button
        onClick={prevSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20
        h-10 w-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20
        text-white flex items-center justify-center
        opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={20} />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        onClick={nextSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20
        h-10 w-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20
        text-white flex items-center justify-center
        opacity-0 group-hover:opacity-100 transition"
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
              index === i ? "bg-white w-6" : "bg-white/40 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
