"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ProductCard from "@/components/Homepage/BestSellers/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function SavedProducts() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Fetch Saved Products ================= */
  useEffect(() => {
    const fetchSaved = async () => {
      if (!currentUser?._id) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await axios.get(`${API}/api/products/saved`, {
          withCredentials: true,
        });

        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load saved products");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [currentUser?._id]);

  /* ================== UI ================== */

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black">
        Saved Products ❤️
      </h2>

      {loading ? (
        <p className="text-black/60">Loading your saved items…</p>
      ) : !currentUser ? (
        <div className="p-10 rounded-2xl bg-white/70 border text-center">
          <p className="text-lg font-semibold">Please login to view saved products</p>
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="
            p-10 rounded-2xl
            bg-white/70 backdrop-blur-xl
            border border-black/10
            text-center
          "
        >
          <div className="text-5xl mb-2">😕</div>
          <p className="text-lg font-semibold">No saved products yet</p>
          <p className="text-black/60 mt-1">
            Save products to view them here ❤️
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
