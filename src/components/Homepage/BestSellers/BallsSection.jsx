"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../BestSellers/ProductCard";
import ProductCardSkeleton from "@/components/Products/ProductCardSkeleton";

const API = process.env.NEXT_PUBLIC_API_URL;

/* Category slug mapping */
const BALL_TYPES = {
  red: {
    label: "Red Leather",
    slug: "red-leather-ball",
  },
  white: {
    label: "White Leather",
    slug: "white-leather-ball",
  },
};

export default function BallsSection() {
  const [activeType, setActiveType] = useState("red");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Balls ---------------- */
  const fetchBalls = async (typeKey) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/api/products/category/${BALL_TYPES[typeKey].slug}`,
        {
          params: {
            type: "ball",
            limit: 3, // 🔥 homepage rule
          },
        }
      );

      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load balls");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Initial + Toggle ---------------- */
  useEffect(() => {
    fetchBalls(activeType);
  }, [activeType]);

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
        {Object.keys(BALL_TYPES).map((key) => {
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
              {BALL_TYPES[key].label}
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
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCardSkeleton />
              </motion.div>
            ))
            : products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <ProductCard product={product} />

                  {/* Explore Button */}
                  <div className="mt-4 flex justify-center">
                    <Link
                      href={`/products?category=${BALL_TYPES[activeType].slug}&type=ball`}
                    >
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
