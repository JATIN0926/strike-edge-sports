"use client";

export default function Pagination({ page, setPage, total, limit }) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex justify-center gap-3 pt-10">
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`
              w-10 h-10 rounded-full
              text-sm font-medium transition
              ${
                p === page
                  ? "bg-black text-white"
                  : "bg-white border hover:bg-black/5"
              }
            `}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
