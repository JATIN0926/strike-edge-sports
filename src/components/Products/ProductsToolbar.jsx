"use client";

import { useEffect, useState } from "react";

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
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* LEFT */}
      <div className="flex flex-col gap-3 items-start justify-center">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full md:w-72
            rounded-full px-4 py-2
            border border-black/10
            bg-white/70 backdrop-blur
            focus:outline-none focus:ring-2 focus:ring-emerald-400
          "
        />

        <p className="text-[0.8rem] text-black/60 ml-2">
          Showing <span className="font-medium">{shown}</span> of{" "}
          <span className="font-medium">{total}</span> products
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex gap-3 flex-wrap md:flex-nowrap">
        <select
          value={selectValue}
          onChange={(e) => {
            const value = e.target.value;

            // ✅ Handle "All Categories" selection
            if (value === "all") {
              setSelectValue("latest|all");
              onShowAllCategories(); // Clear all filters including category
              return;
            }

            setSelectValue(value);
            const [nextSort, nextType] = value.split("|");
            setSort(nextSort, nextType);
          }}
          className="
            rounded-full px-4 py-2
            border border-black/10
            bg-white/70 backdrop-blur
            text-sm
          "
        >
          {/* ✅ CATEGORY RESET OPTION */}
          <option value="all">All Categories</option>

          {/* SORT OPTIONS */}
          <option value="latest|all">Newest</option>
          <option value="price-asc|all">Price: Low → High</option>
          <option value="price-desc|all">Price: High → Low</option>
          <option value="popular|all">Most Popular</option>

          {/* TYPE FILTERS */}
          <optgroup label="Filter by Type">
            <option value="latest|bat">Bats</option>
            <option value="latest|ball">Balls</option>
            <option value="latest|gloves">Gloves</option>
            <option value="latest|pads">Pads</option>
          </optgroup>
        </select>
      </div>
    </div>
  );
}