"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductAdminCard from "./ProductAdminCard";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Products ---------------- */
  const fetchProducts = async (searchTerm = "") => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/products`, {
        params: searchTerm ? { search: searchTerm } : {},
        withCredentials: true,
      });

      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Initial Load ---------------- */
  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- Debounced Search ---------------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(search.trim());
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [search]);

  /* ========================== UI ========================== */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-black">Products</h2>
        <p className="text-sm text-black/60">Manage all listed products</p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title, grade, category or type"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full md:w-1/2
          rounded-xl border border-black/10
          px-4 py-2
          bg-white/70 backdrop-blur
          focus:outline-none
          focus:ring-2 focus:ring-indigo-400
        "
      />

      {/* Content */}
      {loading ? (
        <p className="text-sm text-black/60">Searching products…</p>
      ) : products.length === 0 ? (
        <div
          className="
      flex flex-col items-center justify-center
      py-20 text-center
      rounded-2xl
      border border-black/10
      bg-white/60 backdrop-blur
    "
        >
          <div className="text-4xl mb-3">🔍</div>

          <h3 className="text-lg font-semibold text-black">
            No products found
          </h3>

          <p className="text-sm text-black/60 mt-1 max-w-xs">
            Try searching with a different name, grade, category or product
            type.
          </p>

          {search && (
            <button
              onClick={() => setSearch("")}
              className=" cursor-pointer
          mt-5 px-5 py-2
          rounded-full
          text-sm font-medium
          bg-black text-white
          hover:bg-emerald-600 transition
        "
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductAdminCard
              key={product._id}
              product={product}
              onRefresh={() => fetchProducts(search)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
