"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "../BestSellers/ProductCard";
import ProductCardSkeleton from "@/components/Products/ProductCardSkeleton";
import axiosInstance from "@/utils/axiosInstance";

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

        const res = await axiosInstance.get(`/api/products/category/${slug}`, {
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
    <section className="w-full mt-12 sm:mt-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="mb-6 sm:mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          Our{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Cricket Bats
          </span>
        </h2>

        <p className="text-black/60 max-w-md text-xs sm:text-[0.85rem] mt-1">
          Choose the perfect bat for your game.
        </p>
      </motion.div>

      {/* Toggle - Responsive */}
      <div className="flex flex-col md:flex-row gap-4 xs:gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-10 items-center justify-center">
        {Object.keys(BAT_CATEGORIES).map((key) => {
          const isActive = key === activeType;
          return (
            <motion.h3
              key={key}
              onClick={() => setActiveType(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                cursor-pointer font-extrabold transition text-center
                text-xl xs:text-2xl sm:text-3xl md:text-4xl
                ${isActive ? "text-black" : "text-black/30 hover:text-black/60"}
              `}
            >
              {BAT_CATEGORIES[key].label}
              {isActive && (
                <motion.div
                  layoutId="batUnderline"
                  className="h-0.5 sm:h-1 bg-emerald-500 rounded-full mt-1 sm:mt-2"
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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
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

      {/* Explore Button */}
      {!loading && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-12 flex justify-center"
        >
          <Link
            href={`/products?category=${products[0].category.slug}&type=bat`}
          >
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="
                group
                cursor-pointer
                flex items-center gap-2
                px-6 py-3 sm:px-8 sm:py-3.5
                rounded-xl
                bg-gradient-to-r from-emerald-500 to-green-600
                text-white text-xs sm:text-sm font-semibold
                shadow-lg shadow-emerald-500/30
                hover:shadow-xl hover:shadow-emerald-500/40
                transition-all duration-300
                relative
                overflow-hidden
              "
            >
              {/* Background shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

              <span className="relative">Explore</span>
              <ArrowRight
                size={16}
                className="relative group-hover:translate-x-1 transition-transform duration-300 sm:w-[18px] sm:h-[18px]"
                strokeWidth={2.5}
              />
            </motion.button>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
