"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, setPage, total, limit }) {
  const totalPages = Math.ceil(total / limit);

  // Don't show pagination if only 1 page
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show selected pages with ellipsis
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 pt-8">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePrev}
        disabled={page === 1}
        className="
          cursor-pointer
          flex items-center gap-1
          px-4 py-2.5 rounded-xl
          bg-white/50 backdrop-blur-md
          border border-black/10
          text-sm font-medium
          hover:bg-white/70 hover:border-black/20
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
        <span className="hidden sm:inline">Prev</span>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {getPageNumbers().map((p, i) => {
          if (p === "...") {
            return (
              <span key={`ellipsis-${i}`} className="px-2 py-2 text-black/40">
                •••
              </span>
            );
          }

          return (
            <motion.button
              key={p}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p)}
              className={`
                cursor-pointer
                w-10 h-10 rounded-xl
                text-sm font-semibold
                transition-all duration-200
                ${
                  p === page
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/50 backdrop-blur-md border border-black/10 text-black/70 hover:bg-white/70 hover:border-black/20"
                }
              `}
            >
              {p}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNext}
        disabled={page === totalPages}
        className="
          cursor-pointer
          flex items-center gap-1
          px-4 py-2.5 rounded-xl
          bg-white/50 backdrop-blur-md
          border border-black/10
          text-sm font-medium
          hover:bg-white/70 hover:border-black/20
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}