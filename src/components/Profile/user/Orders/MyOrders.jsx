"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import OrderStatusBadge from "./OrderStatusBadge";
import CancelOrderModal from "./CancelOrderModal";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/orders/my`, {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (reason) => {
    try {
      toast.loading("Cancelling order...", { id: "cancel" });

      await axios.put(
        `${API}/api/orders/${cancelOrderId}/cancel`,
        { reason },
        { withCredentials: true }
      );

      toast.success("Order cancelled", { id: "cancel" });
      setCancelOrderId(null);
      fetchOrders();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to cancel", {
        id: "cancel",
      });
    }
  };

  if (loading) {
    return <p className="text-black/60">Loading orders…</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-10 text-center text-black/60">No orders yet 🛒</div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => {
        const canCancel = ["PLACED", "CONFIRMED"].includes(order.orderStatus);

        return (
          <motion.div
            key={order._id}
            whileHover={{ y: -3 }}
            className="
              p-5 rounded-2xl
              bg-white/70 backdrop-blur
              border shadow-sm
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Order #{order.orderId}</p>
                <p className="text-xs text-black/50">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <OrderStatusBadge status={order.orderStatus} />
            </div>

            {/* Items */}
            <div className="mt-4 space-y-2">
              {order.items.slice(0, 3).map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>₹ {item.price * item.quantity}</span>
                </div>
              ))}

              {order.items.length > 3 && (
                <p className="text-xs text-black/50">
                  + {order.items.length - 3} more items
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center">
              <p className="font-medium">Total: ₹ {order.totalAmount}</p>

              {canCancel && (
                <button
                  onClick={() => setCancelOrderId(order._id)}
                  className="
                    text-sm text-red-600
                    hover:underline
                  "
                >
                  Cancel Order
                </button>
              )}
            </div>
          </motion.div>
        );
      })}

      <CancelOrderModal
        open={!!cancelOrderId}
        onClose={() => setCancelOrderId(null)}
        onConfirm={handleCancel}
      />
    </div>
  );
}
