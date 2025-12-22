"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/Homepage/BestSellers/ProductCard";
import Pagination from "@/components/Products/Pagination";
import ProductsToolbar from "@/components/Products//ProductsToolbar";
import toast from "react-hot-toast";
import ProductCardSkeleton from "@/components/Products/ProductCardSkeleton";

const API = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 6;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");

  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      console.log("till here");
      const res = await axios.get(`${API}/api/products`, {
        params: {
          page,
          limit: LIMIT,
          search,
          sort,
          type,
          category,
        },
        withCredentials: true,
      });

      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, sort, type]);

  useEffect(() => {
    window.scrollTo({ top: 200, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [search, sort, type, category]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            Shop Premium Cricket Gear 🏏
          </h1>
          <p className="text-black/60 mt-3 max-w-xl mx-auto">
            Explore bats, balls, gloves & more — crafted for every level.
          </p>
        </motion.div>

        {/* Toolbar */}
        <ProductsToolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          type={type}
          setType={setType}
          category={category}
          setCategory={setCategory}
          shown={products.length}
          total={total}
        />

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center rounded-2xl bg-white/60 backdrop-blur border"
          >
            <div className="text-4xl mb-3">😕</div>
            <h3 className="text-lg font-semibold">No products found</h3>
            <p className="text-sm text-black/60 mt-1">
              Try changing filters or search keywords
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {/* 👇 KEY IS VERY IMPORTANT */}
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.04,
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {total > LIMIT && (
          <Pagination
            page={page}
            setPage={setPage}
            total={total}
            limit={LIMIT}
          />
        )}
      </div>
    </div>
  );
}
