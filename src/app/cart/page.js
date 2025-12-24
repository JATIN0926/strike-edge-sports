"use client";

import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "@/redux/slices/cartSlice";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items);
  const cartArray = Object.values(items);

  const totalPrice = cartArray.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ---------------- EMPTY CART ---------------- */
  if (cartArray.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white pt-32 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/50 backdrop-blur-xl border border-black/10 rounded-2xl p-10 sm:p-12 max-w-md text-center shadow-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-black/5 flex items-center justify-center">
            <ShoppingBag className="text-black/40" size={36} strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl font-bold text-black/90">Your cart is empty</h2>
          <p className="text-sm text-black/50 mt-2 leading-relaxed">
            Looks like you haven't added anything yet. Start shopping to fill your cart!
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/products")}
            className="
              cursor-pointer
              mt-8 px-8 py-3 rounded-xl
              bg-gradient-to-r from-emerald-500 to-green-600
              text-white font-semibold text-sm
              shadow-lg shadow-emerald-500/30
              hover:shadow-xl hover:shadow-emerald-500/40
              transition-all duration-300
              inline-flex items-center gap-2
            "
          >
            <span>Shop Products</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ========================== UI ========================== */

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white pt-24 sm:pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* -------- HEADER -------- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-black/90">Your Cart</h1>
          <p className="text-sm text-black/50 mt-1">
            {cartArray.length} {cartArray.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* -------- ITEMS LIST -------- */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartArray.map((item, idx) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="
                    flex gap-4 sm:gap-5 items-center
                    bg-white/50 backdrop-blur-xl
                    rounded-2xl p-4 sm:p-5
                    border border-black/10
                    hover:border-black/20
                    shadow-sm hover:shadow-md
                    transition-all duration-200
                  "
                >
                  {/* IMAGE */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-black/5 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-black/90 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-emerald-600 font-bold text-base sm:text-lg mt-1">
                      ₹{item.price.toLocaleString()}
                    </p>

                    {/* QTY CONTROLS */}
                    <div
                      className="
                        mt-3 inline-flex items-center gap-3
                        rounded-xl px-3 py-1.5
                        border border-black/10
                        bg-white/60
                      "
                    >
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(decreaseQty(item.productId))}
                        className="
                          cursor-pointer
                          h-7 w-7 flex items-center justify-center
                          rounded-lg
                          text-black/60 hover:text-red-600
                          hover:bg-red-50
                          transition-all duration-200
                        "
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </motion.button>

                      <span className="font-semibold text-sm min-w-[20px] text-center text-black/90">
                        {item.quantity}
                      </span>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(increaseQty(item.productId))}
                        className="
                          cursor-pointer
                          h-7 w-7 flex items-center justify-center
                          rounded-lg
                          text-emerald-600 hover:text-emerald-700
                          hover:bg-emerald-50
                          transition-all duration-200
                        "
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </motion.button>
                    </div>

                    {/* Item Subtotal - Mobile */}
                    <p className="text-xs text-black/50 mt-2 lg:hidden">
                      Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* SUBTOTAL & REMOVE - Desktop */}
                  <div className="hidden lg:flex flex-col items-end gap-3">
                    <p className="font-semibold text-base text-black/90">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        dispatch(removeFromCart(item.productId));
                        toast.success("Removed from cart");
                      }}
                      className="
                        cursor-pointer
                        text-red-500 hover:text-red-600
                        hover:bg-red-50
                        p-2 rounded-lg transition-all duration-200
                      "
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </motion.button>
                  </div>

                  {/* REMOVE - Mobile */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      dispatch(removeFromCart(item.productId));
                      toast.success("Removed from cart");
                    }}
                    className="
                      cursor-pointer
                      lg:hidden
                      text-red-500 hover:text-red-600
                      hover:bg-red-50
                      p-2 rounded-lg transition-all duration-200
                      flex-shrink-0
                    "
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* -------- SUMMARY SIDEBAR -------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-black/10 shadow-sm sticky top-28">
              <h2 className="text-lg font-bold text-black/90 mb-4">Order Summary</h2>

              <div className="space-y-3 pb-4 border-b border-black/10">
                <div className="flex justify-between text-sm text-black/60">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-black/60">
                  <span>Delivery</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-black/90 mt-4 mb-6">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>

              {/* CTA BUTTONS */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/checkout")}
                  className="
                    cursor-pointer
                    w-full py-3 rounded-xl
                    bg-gradient-to-r from-emerald-500 to-green-600
                    text-white font-semibold text-sm
                    shadow-lg shadow-emerald-500/30
                    hover:shadow-xl hover:shadow-emerald-500/40
                    transition-all duration-300
                    flex items-center justify-center gap-2
                  "
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    dispatch(clearCart());
                    toast.success("Cart cleared");
                  }}
                  className="
                    cursor-pointer
                    w-full py-3 rounded-xl
                    border border-red-500/30
                    text-red-500 font-medium text-sm
                    hover:bg-red-50
                    transition-all duration-200
                  "
                >
                  Clear Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}