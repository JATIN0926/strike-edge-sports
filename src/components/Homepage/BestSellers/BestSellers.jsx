"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "./ProductCard";

const dummyProducts = [
  {
    id: 1,
    name: "SS English Willow Bat",
    price: "6,499",
    image: "/images/hero2.jpg",
  },
  {
    id: 2,
    name: "SG Club Cricket Ball",
    price: "399",
    image: "/images/hero1.jpg",
  },
  {
    id: 3,
    name: "MRF Batting Pads",
    price: "2,199",
    image: "/images/hero3.jpg",
  },
];

export default function BestSellers() {
  return (
    <section className="w-full mt-10 md:mt-16">
      
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Best{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Sellers
          </span>
        </h2>

        <p className="text-white/60 mt-2 max-w-md">
          Most loved cricket gear chosen by our customers.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* See All Products Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-12 flex justify-center"
      >
        <Link href="/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="
              cursor-pointer px-8 py-3 rounded-full
              border-2 border-white/20
              text-white text-sm font-medium
              hover:bg-white hover:text-black
              transition
            "
          >
            See All Products
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
