"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQty, decreaseQty } from "@/redux/slices/cartSlice";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItem = useSelector((state) => state.cart.items[product._id]);

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
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="
        relative group cursor-pointer
        rounded-2xl overflow-hidden
        border border-black/10
        hover:border-emerald-500/30
        hover:shadow-xl hover:shadow-emerald-500/10
        transition-all duration-300
      "
    >
      {/* Shimmer Effect */}
      <div
        className="
    pointer-events-none absolute inset-0 z-20
    before:absolute before:inset-0
    before:-translate-x-full
    before:bg-gradient-to-r
    before:from-transparent
    before:via-white/15
    before:to-transparent
    before:w-1/3
    group-hover:before:translate-x-[300%]
    before:transition-transform
    before:duration-1000
    before:ease-out
  "
      />

      {/* Stock Badge */}
      {product.stock <= 5 && product.stock > 0 && (
        <div className="absolute top-3 right-3 z-30">
          <span
            className="
            px-3 py-1 rounded-full text-xs font-semibold
            bg-orange-100 text-orange-700 border border-orange-200
            backdrop-blur-sm
          "
          >
            Only {product.stock} left
          </span>
        </div>
      )}

      {product.stock === 0 && (
        <div className="absolute top-3 right-3 z-30">
          <span
            className="
            px-3 py-1 rounded-full text-xs font-semibold
            bg-red-100 text-red-700 border border-red-200
            backdrop-blur-sm
          "
          >
            Out of Stock
          </span>
        </div>
      )}

      {/* Image - White Background */}
      <div className="relative w-full h-56 sm:h-64 bg-white flex items-center justify-center overflow-hidden">
        <Image
          src={product.images[0]?.url}
          alt={product.title}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />

        {/* Subtle gradient overlay on hover */}
        <div
          className="
          absolute inset-0 
          bg-gradient-to-t from-white/80 via-transparent to-transparent 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300
        "
        />
      </div>

      {/* Content - Black Background */}
      <div className="p-4 sm:p-5 bg-[#0b0b0b] relative z-10">
        {/* Product Info */}
        <div className="mb-4">
          <h3 className="text-white text-base font-semibold line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            {product.grade && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {product.grade}
              </span>
            )}
          </div>

          <p className="text-emerald-400 text-lg sm:text-xl font-bold mt-2">
            ₹{product.price.toLocaleString()}
          </p>
        </div>

        {/* Cart Controls */}
        {!cartItem ? (
          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={product.stock === 0}
            className={`
              cursor-pointer
              w-full py-3 rounded-xl
              text-sm font-semibold
              flex items-center justify-center gap-2
              transition-all duration-300
              ${
                product.stock === 0
                  ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
                  : "bg-white text-black hover:bg-emerald-400 hover:text-white shadow-lg hover:shadow-emerald-400/30"
              }
            `}
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
            <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              flex items-center justify-between
              gap-3
              rounded-xl
              border border-white/20
              px-4 py-2.5
              bg-white/5
              backdrop-blur-sm
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* MINUS */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDec}
              className="
                cursor-pointer
                h-8 w-8
                flex items-center justify-center
                rounded-lg
                bg-white/10
                text-white/70
                hover:text-red-400
                hover:bg-red-400/10
                border border-white/10
                transition-all duration-200
              "
            >
              <Minus size={16} strokeWidth={2.5} />
            </motion.button>

            {/* QTY */}
            <span className="text-white text-base font-bold min-w-[24px] text-center">
              {cartItem.quantity}
            </span>

            {/* PLUS */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleInc}
              className="
                cursor-pointer
                h-8 w-8
                flex items-center justify-center
                rounded-lg
                bg-emerald-500
                text-white
                hover:bg-emerald-600
                transition-all duration-200
                shadow-sm shadow-emerald-500/30
              "
            >
              <Plus size={16} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
