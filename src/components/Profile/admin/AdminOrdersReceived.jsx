"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AppLoader from "@/components/Loader/AppLoader";

const API = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 6;

const STATUS_OPTIONS = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_COLORS = {
  PLACED: "bg-blue-50 text-blue-600 border-blue-200",
  CONFIRMED: "bg-indigo-50 text-indigo-600 border-indigo-200",
  SHIPPED: "bg-amber-50 text-amber-600 border-amber-200",
  DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

const PAYMENT_STATUS_COLORS = {
  PENDING: "bg-yellow-50 text-yellow-600 border-yellow-200",
  PAID: "bg-green-50 text-green-600 border-green-200",
  FAILED: "bg-red-50 text-red-600 border-red-200",
};

export default function AdminOrdersReceived() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Orders ---------------- */
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/orders`, {
        params: {
          page,
          limit: LIMIT,
          search: search.trim() || undefined,
        },
        withCredentials: true,
      });

      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  /* ---------------- Update Status ---------------- */
  const updateStatus = async (orderId, status) => {
    try {
      toast.loading("Updating status...", { id: "status" });

      await axios.put(
        `${API}/api/orders/${orderId}/status`,
        { status },
        { withCredentials: true }
      );

      toast.success("Order status updated", { id: "status" });
      fetchOrders();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update status";

      toast.error(message, { id: "status" });
    }
  };

  /* ========================== UI ========================== */

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 sm:mb-6"
      >
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black/90">
          Orders Received
        </h2>
        <p className="text-xs sm:text-sm text-black/50 mt-1">
          View, manage, and update all customer orders
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-4 sm:mb-6"
      >
        <input
          placeholder="Search by Order ID or phone"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="
            w-full sm:w-96
            rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5
            border border-black/10
            bg-white/60 backdrop-blur-md
            text-xs sm:text-sm
            placeholder:text-black/40
            focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent
            transition-all duration-200
          "
        />
      </motion.div>

      {/* Orders */}
      {loading ? (
        <AppLoader text="Loading orders details…" />
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="
            text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6
            rounded-xl sm:rounded-2xl
            bg-white/50 backdrop-blur-xl
            border border-black/10
            shadow-sm
          "
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4"
          >
            📦
          </motion.div>

          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-black/90 mb-2">
            No Orders Received
          </h3>

          <p className="text-xs sm:text-sm text-black/50 max-w-sm mx-auto leading-relaxed">
            You haven't received any customer orders yet. Orders will appear
            here once customers start placing them.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="
                rounded-xl sm:rounded-2xl
                bg-white/50 backdrop-blur-xl
                border border-black/10
                p-3 sm:p-4 lg:p-5
                shadow-sm
                hover:shadow-md hover:bg-white/60
                transition-all duration-200
              "
            >
              {/* Top Row */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
                {/* Customer Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-black/90">
                    {order.user?.name || "Guest User"}
                  </p>
                  <p className="text-xs sm:text-sm text-black/50">
                    Order ID: <span className="font-mono break-all">{order.orderId}</span>
                  </p>

                  {/* Shipping Address */}
                  <div className="text-xs sm:text-sm text-black/60 space-y-0.5">
                    <p className="font-medium text-black/70">
                      📦 {order.shippingAddress.fullName}
                    </p>
                    <p>📞 {order.shippingAddress.phone}</p>
                    <p className="line-clamp-2">
                      📍 {order.shippingAddress.street},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>
                </div>

                {/* Status & Actions Column */}
                <div className="flex flex-col gap-2 sm:gap-3 lg:items-end">
                  {/* Payment & Order Status */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs lg:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/5 text-black/60">
                      {order.paymentMethod}
                    </span>

                    {order.paymentInfo?.status && (
                      <span
                        className={`
                          text-[10px] sm:text-xs lg:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border
                          ${PAYMENT_STATUS_COLORS[order.paymentInfo.status]}
                        `}
                      >
                        {order.paymentInfo.status}
                      </span>
                    )}

                    <span
                      className={`
                        text-[10px] sm:text-xs lg:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border
                        ${STATUS_COLORS[order.orderStatus]}
                      `}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Update Status Dropdown */}
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="
                      w-full lg:w-auto
                      rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2
                      border border-black/10
                      bg-white/70 backdrop-blur-sm
                      text-xs sm:text-sm font-medium
                      cursor-pointer
                      hover:border-black/20 hover:bg-white/90
                      focus:outline-none focus:ring-2 focus:ring-indigo-400/50
                      transition-all duration-200
                    "
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        Update to {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items Grid */}
              <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl bg-black/5 backdrop-blur-sm p-2.5 sm:p-3">
                <p className="text-xs sm:text-sm font-medium text-black/60 mb-2">
                  Order Items:
                </p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-cover rounded-lg border border-black/10 flex-shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm lg:text-base font-medium text-black/90 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs sm:text-sm text-black/50">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>

                      {/* Item Total */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm sm:text-base font-semibold text-black/90">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-black/10 space-y-1">
                <div className="flex justify-between text-xs sm:text-sm text-black/60">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-black/60">
                  <span>Delivery Charge:</span>
                  <span className="font-medium">₹{order.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-black/90 pt-1">
                  <span>Total Amount:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Cancellation Info */}
              {order.orderStatus === "CANCELLED" &&
                order.cancellationReason && (
                  <div className="mt-3 p-2.5 sm:p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-xs sm:text-sm font-medium text-red-700">
                      Cancelled by {order.cancelledBy}
                    </p>
                    <p className="text-xs sm:text-sm text-red-600 mt-1">
                      Reason: {order.cancellationReason}
                    </p>
                  </div>
                )}

              {/* Footer */}
              <div className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-black/40">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center gap-2 sm:gap-3 pt-4 sm:pt-6"
        >
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="
              px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg
              bg-white/50 backdrop-blur-md
              border border-black/10
              text-xs sm:text-sm font-medium
              hover:bg-white/70 hover:border-black/20
              disabled:opacity-40 disabled:cursor-not-allowed
              cursor-pointer
              transition-all duration-200
            "
          >
            ← Prev
          </button>

          <span className="text-xs sm:text-sm text-black/70 px-1 sm:px-2">
            Page <strong className="text-black/90">{page}</strong> of{" "}
            {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="
              px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg
              bg-white/50 backdrop-blur-md
              border border-black/10
              text-xs sm:text-sm font-medium
              hover:bg-white/70 hover:border-black/20
              disabled:opacity-40 disabled:cursor-not-allowed
              cursor-pointer
              transition-all duration-200
            "
          >
            Next →
          </button>
        </motion.div>
      )}
    </div>
  );
}