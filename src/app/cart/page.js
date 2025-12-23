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
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
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
      <div className="min-h-screen bg-[#f7f8fa] pt-32 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur border rounded-2xl p-10 max-w-md"
        >
          <ShoppingBag className="mx-auto mb-4 text-black/40" size={40} />

          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-sm text-black/60 mt-2">
            Looks like you haven’t added anything yet.
          </p>

          <button
            onClick={() => router.push("/products")}
            className="
              mt-6 px-6 py-3 rounded-full
              bg-black text-white
              hover:bg-emerald-600 transition
            "
          >
            Shop Products
          </button>
        </motion.div>
      </div>
    );
  }

  /* ========================== UI ========================== */

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-28">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        {/* -------- HEADER -------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-sm text-black/60 mt-1">
            Review items before proceeding to checkout
          </p>
        </motion.div>

        {/* -------- ITEMS -------- */}
        <div className="space-y-5">
          <AnimatePresence>
            {cartArray.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25 }}
                className="
                  flex gap-5 items-center
                  bg-white/70 backdrop-blur
                  rounded-2xl p-5
                  border border-black/10
                  shadow-sm hover:shadow-md transition
                "
              >
                {/* IMAGE */}
                <div className="relative w-24 h-24 rounded-xl bg-white border overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                  <h3 className="font-semibold text-black">{item.title}</h3>

                  <p className="text-emerald-600 font-medium mt-1">
                    ₹ {item.price}
                  </p>

                  {/* QTY CONTROLS */}
                  <div
                    className="
                      mt-3 inline-flex items-center gap-4
                      rounded-full px-4 py-1.5
                      border border-black/10
                      bg-white/60
                    "
                  >
                    <button
                      onClick={() => dispatch(decreaseQty(item.productId))}
                      className="
                        h-7 w-7 flex items-center justify-center
                        rounded-full
                        text-black/60 hover:text-black
                        hover:bg-black/5 transition
                      "
                    >
                      <Minus size={14} />
                    </button>

                    <span className="font-semibold text-sm min-w-[14px] text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => dispatch(increaseQty(item.productId))}
                      className="
                        h-7 w-7 flex items-center justify-center
                        rounded-full
                        text-emerald-600 hover:text-emerald-700
                        hover:bg-emerald-500/10 transition
                      "
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => {
                    dispatch(removeFromCart(item.productId));
                    toast.success("Item removed from cart");
                  }}
                  className="
                    text-red-500 hover:text-red-600
                    hover:bg-red-500/10
                    p-2 rounded-full transition
                  "
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* -------- SUMMARY -------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-white/70 backdrop-blur
            rounded-2xl p-6 border
            space-y-5
          "
        >
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount</span>
            <span>₹ {totalPrice}</span>
          </div>

          {/* CTA ROW */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/checkout")}
              className=" cursor-pointer
                flex-1 py-3 rounded-full
                bg-black text-white font-medium
                hover:bg-emerald-600 transition
              "
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => {
                dispatch(clearCart());
                toast.success("Cart cleared");
              }}
              className=" cursor-pointer
                flex-1 py-3 rounded-full
                border border-red-500/30
                text-red-500 font-medium
                hover:bg-red-500/10 transition
              "
            >
              Clear Cart
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
