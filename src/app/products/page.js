"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  // ✅ Modified to accept both sort and type together
  const handleSortChange = (nextSort, nextType) => {
    // ✅ If type is being set to something other than "all", clear category
    if (nextType !== "all") {
      updateQuery({ sort: nextSort, type: nextType, category: "all" });
    } else {
      updateQuery({ sort: nextSort, type: nextType });
    }
  };

  // ✅ Handler to clear all filters and show all categories
  const handleShowAllCategories = () => {
    updateQuery({ sort: "latest", type: "all", category: "all" });
  };

  /* ========================== UI ========================== */
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
            setPage={(p) => updateQuery({ page: p })}
            total={total}
            limit={LIMIT}
          />
        )}
      </div>
    </div>
  );
}