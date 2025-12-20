"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import ProductCard from "../BestSellers/ProductCard"; 
// ⬆️ path adjust if needed

const BAT_DATA = {
  english: {
    label: "English Willow",
    products: [
      {
        id: "eng-1",
        name: "English Willow – Novice",
        price: "12,000",
        image: "/images/hero2.jpg",
      },
      {
        id: "eng-2",
        name: "English Willow – Intermediate",
        price: "18,000",
        image: "/images/hero1.jpg",
      },
      {
        id: "eng-3",
        name: "English Willow – Elite",
        price: "24,000",
        image: "/images/hero3.jpg",
      },
    ],
  },
  kashmiri: {
    label: "Kashmiri Willow",
    products: [
      {
        id: "kas-1",
        name: "Kashmiri Willow – Beginner",
        price: "2,500",
        image: "/images/hero1.jpg",
      },
      {
        id: "kas-2",
        name: "Kashmiri Willow – Grade A",
        price: "3,500",
        image: "/images/hero2.jpg",
      },
      {
        id: "kas-3",
        name: "Kashmiri Willow – Grade A+",
        price: "5,500",
        image: "/images/hero3.jpg",
      },
    ],
  },
};

export default function BatsSection() {
  const [activeType, setActiveType] = useState("english");

  return (
    <section className="w-full mt-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-black">
          Our{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Cricket Bats
          </span>
        </h2>

        <p className="text-black/60 max-w-md text-[0.85rem]">
          Choose the perfect bat for your game.
        </p>
      </motion.div>

      {/* Toggle Headings */}
      <div className="flex gap-10 mb-10  items-center justify-center">
        {Object.keys(BAT_DATA).map((key) => {
          const isActive = key === activeType;
          return (
            <motion.h3
              key={key}
              onClick={() => setActiveType(key)}
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer text-3xl md:text-4xl font-extrabold transition
                ${
                  isActive
                    ? "text-black"
                    : "text-black/30 hover:text-black/60"
                }
              `}
            >
              {BAT_DATA[key].label}
              {isActive && (
                <motion.div
                  layoutId="batUnderline"
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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {BAT_DATA[activeType].products.map((product, index) => (
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
              <div className="mt-6 flex justify-center ">
                <Link
                  href={`/products?category=bats&type=${activeType}`}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="cursor-pointer
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
