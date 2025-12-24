"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Package } from "lucide-react";

import ProductCard from "@/components/Homepage/BestSellers/ProductCard";
import Pagination from "@/components/Products/Pagination";
import ProductsToolbar from "@/components/Products/ProductsToolbar";
import ProductCardSkeleton from "@/components/Products/ProductCardSkeleton";

const API = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 6;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "latest";
  const type = searchParams.get("type") || "all";
  const category = searchParams.get("category") || "all";

  /* ================= LOCAL STATE ================= */
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/products`, {
        params: {
          page,
          limit: LIMIT,
          search,
          sort,
          type,
          category,
        },
      });

      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, sort, type, category]);

  /* ================= URL UPDATE HELPER ================= */
  const updateQuery = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else if ((key === "type" || key === "category") && value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // reset page on filter change
    if (!("page" in updates)) {
      params.set("page", "1");
    }

    router.push(`/products?${params.toString()}`);
  };

  /* ================= HANDLERS ================= */
  const handleSortChange = (nextSort, nextType) => {
    if (nextType !== "all") {
      updateQuery({ sort: nextSort, type: nextType, category: "all" });
    } else {
      updateQuery({ sort: nextSort, type: nextType });
    }
  };

  const handleShowAllCategories = () => {
    updateQuery({ sort: "latest", type: "all", category: "all" });
  };

  /* ========================== UI ========================== */
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30">
              <Package className="text-white" size={28} strokeWidth={2.5} />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black/90 mb-3">
            Shop Premium Cricket Gear
          </h1>
          
          <p className="text-sm sm:text-base text-black/60 max-w-2xl mx-auto leading-relaxed">
            Explore bats, balls, gloves & more — crafted for every level of play
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProductsToolbar
            search={search}
            setSearch={(val) => updateQuery({ search: val })}
            sort={sort}
            setSort={handleSortChange}
            type={type}
            setType={(val) => updateQuery({ type: val })}
            category={category}
            setCategory={(val) => updateQuery({ category: val })}
            onShowAllCategories={handleShowAllCategories}
            shown={products.length}
            total={total}
          />
        </motion.div>

        {/* Products */}
        <div className="mt-8 sm:mt-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <ProductCardSkeleton />
                </motion.div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="
                py-20 sm:py-24 text-center 
                rounded-2xl 
                bg-white/50 backdrop-blur-md 
                border border-black/10
                shadow-sm
              "
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-5xl sm:text-6xl mb-4"
              >
                😕
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold text-black/90">
                No products found
              </h3>
              <p className="text-sm text-black/50 mt-2 max-w-sm mx-auto px-4">
                Try changing filters or search keywords
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.06,
                      ease: "easeOut",
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {total > LIMIT && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12"
          >
            <Pagination
              page={page}
              setPage={(p) => updateQuery({ page: p })}
              total={total}
              limit={LIMIT}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}