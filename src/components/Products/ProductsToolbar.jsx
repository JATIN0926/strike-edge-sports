"use client";

export default function ProductsToolbar({
  search,
  setSearch,
  sort,
  setSort,
  type,
  setType,
  category,
  setCategory,
  categories = [],
  shown,
  total,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Left */}

      <div className="flex flex-col gap-3 items-start justify-center">
        {/* Middle – Search */}
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

      {/* Right – Filters */}
      <div className="flex gap-3 flex-wrap md:flex-nowrap">
        {/* Sort + Type */}
        <select
          value={`${sort}|${type}`}
          onChange={(e) => {
            const [s, t] = e.target.value.split("|");
            setSort(s);
            setType(t);
          }}
          className="
            rounded-full px-4 py-2
            border border-black/10
            bg-white/70 backdrop-blur
            text-sm
          "
        >
          <option value="all">All Categories</option>
          <option value="latest|all">Newest</option>
          <option value="price-asc|all">Price: Low → High</option>
          <option value="price-desc|all">Price: High → Low</option>
          <option value="popular|all">Most Popular</option>

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
