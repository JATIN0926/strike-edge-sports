"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import ProductCard from "../BestSellers/ProductCard";

const BALL_DATA = {
  red: {
    label: "Red Leather",
    products: [
      {
        id: "red-30",
        name: "Red Leather Ball – 30 Overs (Pack of 6)",
        price: "1,650",
        image: "/images/hero1.jpg",
      },
      {
        id: "red-50",
        name: "Red Leather Ball – 50 Overs (Pack of 6)",
        price: "2,100",
        image: "/images/hero2.jpg",
      },
    ],
  },

  white: {
    label: "White Leather",
    products: [
      {
        id: "white-30",
        name: "White Leather Ball – 30 Overs (Pack of 6)",
        price: "1,710",
        image: "/images/hero2.jpg",
      },
      {
        id: "white-50",
        name: "White Leather Ball – 50 Overs (Pack of 6)",
        price: "2,160",
        image: "/images/hero1.jpg",
      },
    ],
  },
};

export default function BallsSection() {
  const [activeType, setActiveType] = useState("red");

  return (
    <section className="w-full mt-20">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-black">
          Match{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Cricket Balls
          </span>
        </h2>

        <p className="text-black/60 max-w-md text-[0.85rem]">
          Designed for consistent swing, seam, and durability.
        </p>
      </motion.div>

      {/* Toggle Headings */}
      <div className="flex gap-10 mb-10 items-center justify-center">
        {Object.keys(BALL_DATA).map((key) => {
          const isActive = key === activeType;
          return (
            <motion.h3
              key={key}
              onClick={() => setActiveType(key)}
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer text-3xl md:text-4xl font-extrabold transition
                ${isActive ? "text-black" : "text-black/30 hover:text-black/60"}
              `}
            >
              {BALL_DATA[key].label}
              {isActive && (
                <motion.div
                  layoutId="ballUnderline"
                  className="h-1 bg-emerald-500 rounded-full mt-2"
                />
              )}
            </motion.h3>
          );
        })}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeType}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="
    grid grid-cols-1 sm:grid-cols-2
    gap-6
    max-w-3xl
    mx-auto
  "
        >
          {BALL_DATA[activeType].products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Same Product Card */}
              <ProductCard product={product} />

              {/* Explore Button */}
              <div className="mt-4 flex justify-center">
                <Link href={`/products?category=balls&type=${activeType}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="
                      text-sm font-medium
                      text-black border-b border-black/30
                      hover:border-black
                      transition
                    "
                  >
                    Explore →
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
