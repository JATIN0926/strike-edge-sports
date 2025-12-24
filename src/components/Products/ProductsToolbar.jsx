"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

export default function ProductsToolbar({
  search,
  setSearch,
  sort,
  setSort,
  type,
  setType,
  category,
  onShowAllCategories,
  shown,
  total,
}) {
  const [selectValue, setSelectValue] = useState(`${sort}|${type}`);

  useEffect(() => {
    setSelectValue(`${sort}|${type}`);
  }, [sort, type]);

  return (
    <div className="
      flex flex-col gap-5 md:flex-row md:items-center md:justify-between
      p-5 sm:p-6
      rounded-2xl
      bg-white/50 backdrop-blur-xl
      border border-black/10
      shadow-sm
    ">
      {/* LEFT - Search & Count */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" 
            size={18} 
            strokeWidth={2.5}
          />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full md:w-80
              rounded-xl pl-11 pr-4 py-2.5
              border border-black/10
              bg-white/70 backdrop-blur-sm
              text-sm
              placeholder:text-black/40
              focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent
              transition-all duration-200
            "
          />
        </div>

        <p className="text-xs sm:text-sm text-black/50 ml-1">
          Showing <span className="font-semibold text-black/70">{shown}</span> of{" "}
          <span className="font-semibold text-black/70">{total}</span> products
        </p>
      </div>

      {/* RIGHT - Filters */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 text-sm text-black/60">
          <Filter size={16} strokeWidth={2.5} />
          <span className="font-medium">Sort & Filter:</span>
        </div>
        
        <select
          value={selectValue}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "all") {
              setSelectValue("latest|all");
              onShowAllCategories();
              return;
            }

            setSelectValue(value);
            const [nextSort, nextType] = value.split("|");
            setSort(nextSort, nextType);
          }}
          className="
            cursor-pointer
            rounded-xl px-4 py-2.5
            border border-black/10
            bg-white/70 backdrop-blur-sm
            text-sm font-medium
            hover:border-black/20 hover:bg-white/90
            focus:outline-none focus:ring-2 focus:ring-emerald-400/50
            transition-all duration-200
            min-w-[180px]
          "
        >
          {/* CATEGORY RESET */}
          <option value="all">✨ All Categories</option>

          {/* SORT OPTIONS */}
          <option value="latest|all">🆕 Newest</option>
          <option value="price-asc|all">💰 Price: Low → High</option>
          <option value="price-desc|all">💎 Price: High → Low</option>
          <option value="popular|all">🔥 Most Popular</option>

          {/* TYPE FILTERS */}
          <optgroup label="──── Filter by Type ────">
            <option value="latest|bat">🏏 Bats</option>
            <option value="latest|ball">⚾ Balls</option>
            <option value="latest|gloves">🧤 Gloves</option>
            <option value="latest|pads">🛡️ Pads</option>
          </optgroup>
        </select>
      </div>
    </div>
  );
}