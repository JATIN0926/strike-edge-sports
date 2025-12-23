"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ProductCard from "../BestSellers/ProductCard";
import ProductCardSkeleton from "@/components/Products/ProductCardSkeleton";

const API = process.env.NEXT_PUBLIC_API_URL;

const BAT_CATEGORIES = {
  english: {
    label: "English Willow",
    slug: "english-willow",
  },
  kashmiri: {
    label: "Kashmiri Willow",
    slug: "kashmiri-willow",
  },
};

export default function BatsSection() {
  const [activeType, setActiveType] = useState("english");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch by Category Slug ---------------- */
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);

        const { slug } = BAT_CATEGORIES[activeType];

        const res = await axios.get(`${API}/api/products/category/${slug}`, {
          params: {
            type: "bat",
            limit: 3,
          },
        });

        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [activeType]);

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

      {/* Toggle */}
      <div className="flex gap-10 mb-10 items-center justify-center">
        {Object.keys(BAT_CATEGORIES).map((key) => {
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
              {BAT_CATEGORIES[key].label}
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
            : products.slice(0, 3).map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </motion.div>
      </AnimatePresence>

      {/* Explore */}
      {!loading && products.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Link
            href={`/products?category=${products[0].category.slug}&type=bat`}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-sm font-medium text-black border-b border-black/30 hover:border-black transition"
            >
              Explore →
            </motion.button>
          </Link>
        </div>
      )}
    </section>
  );
}
