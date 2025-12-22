"use client";

import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "@/redux/slices/cartSlice";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items);
  const cartArray = Object.values(items);

  const totalPrice = cartArray.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartArray.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold"
        >
          Your cart is empty 🛒
        </motion.h2>

        <button
          onClick={() => router.push("/products")}
          className="mt-6 px-6 py-3 rounded-full bg-black text-white"
        >
          Shop Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-28">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>

        {/* ITEMS */}
        <div className="space-y-4">
          {cartArray.map((item) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                flex gap-5 items-center
                bg-white rounded-2xl p-4
                border
              "
            >
              <div className="relative w-24 h-24 bg-white rounded-xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-emerald-600 font-medium">
                  ₹ {item.price}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() =>
                      dispatch(decreaseQty(item.productId))
                    }
                    className="px-3 py-1 bg-black/5 rounded"
                  >
                    −
                  </button>

                  <span className="font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(increaseQty(item.productId))
                    }
                    className="px-3 py-1 bg-black/5 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  dispatch(removeFromCart(item.productId))
                }
                className="text-red-500"
              >
                <Trash2 />
              </button>
            </motion.div>
          ))}
        </div>

        {/* SUMMARY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            bg-white rounded-2xl p-6 border
            flex flex-col gap-4
          "
        >
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹ {totalPrice}</span>
          </div>

          <button
            onClick={()=>{router.push('/checkout')}}
            className="
              w-full py-3 rounded-full
              bg-black text-white opacity-50 cursor-pointer
            "
          >
            Checkout
          </button>

          <button
            onClick={() => dispatch(clearCart())}
            className="text-sm text-red-500 underline"
          >
            Clear cart
          </button>
        </motion.div>
      </div>
    </div>
  );
}
