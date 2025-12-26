"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Package, Calendar, CreditCard, MapPin, X, ArrowRight } from "lucide-react";
import Link from "next/link"
import OrderStatusBadge from "./OrderStatusBadge";
import CancelOrderModal from "./CancelOrderModal";
import AppLoader from "@/components/Loader/AppLoader";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

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
    return <AppLoader text="Loading Order details…" />;
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="
          p-16 text-center rounded-3xl
          bg-gradient-to-br from-blue-50/80 to-emerald-50/80
          backdrop-blur-xl border border-white/50 flex flex-col w-full items-center justify-center gap-4
        "
      >
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-bold text-black">No orders yet</h3>
        <p className="text-black/60">Start shopping to see your orders here!</p>
        <Link
            href={`/products`}
          >
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="
                group
                cursor-pointer
                flex items-center gap-2
                px-8 py-3.5
                rounded-xl
                bg-gradient-to-r from-emerald-500 to-green-600
                text-white text-sm font-semibold
                shadow-lg shadow-emerald-500/30
                hover:shadow-xl hover:shadow-emerald-500/40
                transition-all duration-300
                relative
                overflow-hidden
              "
            >
              {/* Background shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              
              <span className="relative">Start Shopping</span>
              <ArrowRight 
                size={18} 
                className="relative group-hover:translate-x-1 transition-transform duration-300" 
                strokeWidth={2.5}
              />
            </motion.button>
          </Link>
      </motion.div>
    );
  }

  console.log(orders);

  return (
    <div className="space-y-6">
      {orders.map((order, index) => {
        const canCancel = ["PLACED", "CONFIRMED"].includes(order.orderStatus);
        const isExpanded = expandedOrder === order._id;

        return (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="
              relative overflow-hidden
              rounded-3xl
              bg-white/70 backdrop-blur-xl
              border border-white/50
              shadow-lg shadow-blue-500/5
              hover:shadow-xl hover:shadow-blue-500/10
              hover:border-blue-300/50
              transition-all duration-300
            "
          >
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />

            {/* Main Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="
                      w-12 h-12 rounded-2xl
                      bg-gradient-to-br from-emerald-500/20 to-blue-500/20
                      flex items-center justify-center
                    "
                  >
                    <Package className="text-emerald-600" size={24} />
                  </motion.div>

                  <div>
                    <p className="text-lg font-bold text-black">
                      Order #{order.orderId}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-black/60 mt-1">
                      <Calendar size={14} />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <OrderStatusBadge status={order.orderStatus} />
              </div>

              {/* Items Preview */}
              <div className="space-y-3 mb-5">
                {order.items
                  .slice(0, isExpanded ? undefined : 3)
                  .map((item) => (
                    <motion.div
                      key={item.productId}
                      whileHover={{ x: 4 }}
                      className="
                      flex items-center justify-between
                      p-3 rounded-xl
                      bg-white/50 backdrop-blur
                      border border-white/50
                      hover:border-blue-300/50
                      transition-all duration-200
                    "
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-black/5">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-black line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-black/60 mt-0.5">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-emerald-600">
                        ₹{item.price * item.quantity}
                      </p>
                    </motion.div>
                  ))}

                {!isExpanded && order.items.length > 3 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setExpandedOrder(order._id)}
                    className="
                      w-full py-2 text-sm text-blue-600 font-medium
                      hover:text-blue-700 transition
                    "
                  >
                    + {order.items.length - 3} more items
                  </motion.button>
                )}

                {isExpanded && order.items.length > 3 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setExpandedOrder(null)}
                    className="
                      w-full py-2 text-sm text-black/60 font-medium
                      hover:text-black transition
                    "
                  >
                    Show less
                  </motion.button>
                )}
              </div>

              {/* Payment & Shipping Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {/* Payment Method */}
                <div
                  className="
                    flex items-center gap-3 p-3 rounded-xl
                    bg-gradient-to-br from-emerald-50/80 to-blue-50/80
                    backdrop-blur border border-white/50
                  "
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CreditCard className="text-emerald-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-black/60">Payment</p>
                    <p className="text-sm font-semibold text-black">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div
                  className="
                    flex items-center gap-3 p-3 rounded-xl
                    bg-gradient-to-br from-blue-50/80 to-emerald-50/80
                    backdrop-blur border border-white/50
                  "
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <MapPin className="text-blue-600" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-black/60">Deliver to</p>
                    <p className="text-sm font-semibold text-black truncate">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-black/5">
                <div>
                  <p className="text-sm text-black/60">Total Amount</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                    ₹{order.totalAmount}
                  </p>
                </div>

                {canCancel && (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCancelOrderId(order._id)}
                    className=" cursor-pointer
                      px-6 py-2.5 rounded-xl
                      bg-red-50 border border-red-200
                      text-red-600 font-semibold text-sm
                      hover:bg-red-100 hover:border-red-300
                      transition-all duration-200
                      flex items-center gap-2
                    "
                  >
                    <X size={16} />
                    Cancel Order
                  </motion.button>
                )}
              </div>

              {/* Cancellation Info (if cancelled) */}
              {order.orderStatus === "CANCELLED" &&
                order.cancellationReason && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="
                    mt-4 p-4 rounded-xl
                    bg-red-50/80 backdrop-blur
                    border border-red-200/50
                  "
                  >
                    <p className="text-sm font-semibold text-red-600 mb-1">
                      Cancellation Reason
                    </p>
                    <p className="text-sm text-red-600/80">
                      {order.cancellationReason}
                    </p>
                    {order.cancelledBy && (
                      <p className="text-xs text-red-600/60 mt-2">
                        Cancelled by: {order.cancelledBy}
                      </p>
                    )}
                  </motion.div>
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
