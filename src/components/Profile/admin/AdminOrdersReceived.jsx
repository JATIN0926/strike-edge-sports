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
  PLACED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-black">Orders Received</h2>
        <p className="text-sm text-black/60">
          View, manage, and update all customer orders
        </p>
      </div>

      {/* Search */}
      <input
        placeholder="Search by Order ID or phone number"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="
          w-full md:w-1/2
          rounded-xl px-4 py-2.5
          border border-black/10
          bg-white/70 backdrop-blur
          focus:outline-none focus:ring-2 focus:ring-indigo-400
          transition
        "
      />

      {/* Orders */}
      {loading ? (
        <AppLoader text="Loading orders details…" />
      ) : orders.length === 0 ? (
        <p className="text-sm text-black/60">No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="
                rounded-2xl
                bg-white/80 backdrop-blur-xl
                border border-black/10
                p-6
                shadow-sm
                hover:shadow-lg
                transition
              "
            >
              {/* Top Row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Customer Info */}
                <div className="space-y-1">
                  <p className="font-semibold text-black">
                    {order.user?.name || "Guest User"}
                  </p>
                  <p className="text-xs text-black/60">
                    Order ID: {order.orderId}
                  </p>
                  <p className="text-xs text-black/60">
                    📞 {order.shippingAddress.phone}
                  </p>
                </div>

                {/* Amount + Status */}
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-black">
                    ₹ {order.totalAmount}
                  </span>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.orderStatus]}`}
                  >
                    {order.orderStatus}
                  </span>

                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="
                      rounded-full px-3 py-1.5
                      border border-black/10
                      bg-white
                      text-sm
                      cursor-pointer
                      hover:border-black/30
                      transition
                    "
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="mt-5 rounded-xl bg-black/5 p-4 space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-black/70">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹ {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 text-xs text-black/50">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="
              px-4 py-2 rounded-lg
              bg-black/5
              hover:bg-black/10
              disabled:opacity-40
              transition
            "
          >
            ← Prev
          </button>

          <span className="text-sm">
            Page <strong>{page}</strong> of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="
              px-4 py-2 rounded-lg
              bg-black/5
              hover:bg-black/10
              disabled:opacity-40
              transition
            "
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
