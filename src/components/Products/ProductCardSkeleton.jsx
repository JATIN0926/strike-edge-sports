"use client";

export default function ProductCardSkeleton() {
  return (
    <div
      className="
        rounded-2xl overflow-hidden
        bg-[#0b0b0b]
        border border-white/10
        animate-pulse
      "
    >
      {/* Image */}
      <div className="h-64 bg-white/10" />

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="h-5 w-3/4 bg-white/10 rounded" />
        <div className="h-4 w-1/3 bg-white/10 rounded" />
        <div className="h-10 w-full bg-white/10 rounded-full mt-4" />
      </div>
    </div>
  );
}
