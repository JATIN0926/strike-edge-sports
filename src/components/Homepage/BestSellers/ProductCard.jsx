"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQty,
  decreaseQty,
} from "@/redux/slices/cartSlice";

export default function ProductCard({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItem = useSelector(
    (state) => state.cart.items[product._id]
  );

  const handleAdd = (e) => {
    e.stopPropagation();

    dispatch(
      addToCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images[0]?.url,
      })
    );
  };

  const handleInc = (e) => {
    e.stopPropagation();
    dispatch(increaseQty(product._id));
  };

  const handleDec = (e) => {
    e.stopPropagation();
    dispatch(decreaseQty(product._id));
  };

  return (
    <motion.div
      onClick={() => router.push(`/products/${product._id}`)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        relative group 
        rounded-2xl overflow-hidden
        bg-[#0b0b0b]
        border border-white/10
        hover:border-white/30
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)]
        transition
      "
    >
      {/* Glass sweep */}
      <div
        className="
          pointer-events-none absolute inset-0 z-20
          before:absolute before:inset-0
          before:-translate-x-full
          before:bg-gradient-to-r
          before:from-transparent
          before:via-white/10
          before:to-transparent
          group-hover:before:translate-x-full
          before:transition-transform
          before:duration-700
        "
      />

      {/* Image */}
      <div className="relative w-full h-64 bg-white flex items-center justify-center">
        <Image
          src={product.images[0]?.url}
          alt={product.title}
          fill
          className="object-contain p-4 transition group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 bg-[#0b0b0b] relative z-10">
        <h3 className="text-white text-lg font-semibold">
          {product.title}
        </h3>

        <p className="text-emerald-400 text-lg font-medium mt-1">
          ₹ {product.price}
        </p>

        {/* Cart Controls */}
        {!cartItem ? (
          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              mt-6 w-full py-2.5 rounded-full
              bg-white text-black text-sm font-semibold
              hover:bg-gray-200 transition
            "
          >
            Add to Cart
          </motion.button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              mt-6 flex items-center justify-between
              bg-white rounded-full px-4 py-2
            "
          >
            <button
              onClick={handleDec}
              className="text-lg font-bold px-2"
            >
              −
            </button>

            <span className="font-semibold">
              {cartItem.quantity}
            </span>

            <button
              onClick={handleInc}
              className="text-lg font-bold px-2"
            >
              +
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
