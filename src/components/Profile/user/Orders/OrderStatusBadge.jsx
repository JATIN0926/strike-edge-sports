"use client";

const STATUS_STYLES = {
  PLACED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`
        text-xs font-semibold px-3 py-1 rounded-full
        ${STATUS_STYLES[status] || "bg-black/10 text-black/60"}
      `}
    >
      {status}
    </span>
  );
}