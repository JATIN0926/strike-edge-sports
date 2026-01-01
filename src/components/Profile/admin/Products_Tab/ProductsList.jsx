"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ProductAdminCard from "./ProductAdminCard";
import AppLoader from "@/components/Loader/AppLoader";
import axiosInstance from "@/utils/axiosInstance";

const API = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 6;

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(total / LIMIT);

  /* ---------------- Fetch Products ---------------- */
  const fetchProducts = async ({
    pageNumber = page,
    searchTerm = search.trim(),
  } = {}) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/api/products`, {
        params: {
          page: pageNumber,
          limit: LIMIT,
          search: searchTerm || undefined,
        },
        withCredentials: true,
      });

      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Initial Load ---------------- */
  useEffect(() => {
    fetchProducts({ pageNumber: 1 });
  }, []);

  /* ---------------- Fetch on Page Change ---------------- */
  useEffect(() => {
    fetchProducts({ pageNumber: page });
  }, [page]);

  /* ---------------- Debounced Search ---------------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1); // 🔥 reset to first page on new search
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  /* ---------------- Pagination ---------------- */
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  /* ========================== UI ========================== */

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-black/90">
          Products
        </h2>
        <p className="text-sm text-black/50 mt-1">Manage all listed products</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        <input
          type="text"
          placeholder="Search by title, grade or product type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full sm:w-96
            rounded-xl px-4 py-2.5
            border border-black/10
            bg-white/60 backdrop-blur-md
            text-sm
            placeholder:text-black/40
            focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent
            transition-all duration-200
          "
        />
      </motion.div>

      {/* Content */}
      {loading ? (
        <AppLoader text="Loading Products…" />
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="
            flex flex-col items-center justify-center
            py-16 sm:py-20 text-center
            rounded-2xl
            border border-black/10
            bg-white/50 backdrop-blur-md
          "
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-5xl sm:text-6xl mb-4"
          >
            🔍
          </motion.div>

          <h3 className="text-lg sm:text-xl font-semibold text-black/90">
            No products found
          </h3>

          <p className="text-sm text-black/50 mt-2 max-w-sm px-4">
            Try searching with a different name, grade or product type.
          </p>

          {search && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setSearch("")}
              className="
                cursor-pointer
                mt-6 px-6 py-2.5
                rounded-xl
                text-sm font-medium
                bg-black/90 text-white
                hover:bg-indigo-600
                transition-all duration-200
                shadow-sm hover:shadow-md
              "
            >
              Clear search
            </motion.button>
          )}
        </motion.div>
      ) : (
        <>
          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <ProductAdminCard
                  product={product}
                  onRefresh={() =>
                    fetchProducts({
                      pageNumber: page,
                      searchTerm: search.trim(),
                    })
                  }
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center items-center gap-3 pt-8"
            >
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="
                  px-4 py-2 rounded-lg
                  bg-white/50 backdrop-blur-md
                  border border-black/10
                  text-sm font-medium
                  hover:bg-white/70 hover:border-black/20
                  disabled:opacity-40 disabled:cursor-not-allowed
                  cursor-pointer
                  transition-all duration-200
                "
              >
                ← Prev
              </button>

              <span className="text-sm text-black/70 px-2">
                Page <strong className="text-black/90">{page}</strong> of{" "}
                {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="
                  px-4 py-2 rounded-lg
                  bg-white/50 backdrop-blur-md
                  border border-black/10
                  text-sm font-medium
                  hover:bg-white/70 hover:border-black/20
                  disabled:opacity-40 disabled:cursor-not-allowed
                  cursor-pointer
                  transition-all duration-200
                "
              >
                Next →
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
