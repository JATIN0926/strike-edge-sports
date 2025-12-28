"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQty, decreaseQty } from "@/redux/slices/cartSlice";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { toggleSavedProduct } from "@/redux/slices/userSlice";

export default function ProductCard({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const isSaved = currentUser?.savedProducts?.includes(product._id);

  const cartItem = useSelector((state) => state.cart.items[product._id]);

  const isOutOfStock = product.stock === 0 || (cartItem && cartItem.quantity >= product.stock);

  const handleAdd = (e) => {
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

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

    if (cartItem && cartItem.quantity >= product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    dispatch(increaseQty(product._id));
  };

  const handleDec = (e) => {
    e.stopPropagation();
    dispatch(decreaseQty(product._id));
  };

  const handleToggleSave = async (e) => {
    e.stopPropagation();

    if (!currentUser) {
      toast.error("Please login to save products");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/saved/${product._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(toggleSavedProduct(product._id));

      toast.success(isSaved ? "Removed from saved" : "Saved for later ❤️");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save product");
    }
  };

  return (
    <motion.div
      onClick={() => router.push(`/products/${product._id}`)}
      whileHover={{ y: isOutOfStock ? 0 : -6, transition: { duration: 0.3 } }}
      className={`
        relative group cursor-pointer
        rounded-2xl overflow-hidden
        border transition-all duration-300
        ${
          isOutOfStock
            ? "border-gray-300/50 opacity-75 cursor-not-allowed"
            : "border-black/10 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10"
        }
      `}
    >
      {!isOutOfStock && (
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
      )}

      {isOutOfStock ? (
        <div className="absolute top-3 right-3 z-30">
          <span
            className="
              px-3 py-1 rounded-full text-xs font-semibold
              bg-gray-100 text-gray-600 border border-gray-300
              backdrop-blur-sm
            "
          >
            Out of Stock
          </span>
        </div>
      ) : (
        product.stock <= 5 && (
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
        )
      )}

      {/* SAVE ICON */}
      <div
        onClick={handleToggleSave}
        className={`
          absolute top-3 left-3 z-30
          h-9 w-9 rounded-full
          backdrop-blur
          flex items-center justify-center
          hover:scale-110 transition
          ${isOutOfStock ? "bg-gray-400/60" : "bg-black/60"}
        `}
      >
        <Heart
          size={18}
          className={`
            transition
            ${isSaved ? "fill-pink-500 text-pink-500" : "text-white"}
          `}
        />
      </div>

      {/* Image - Background changes based on stock */}
      <div
        className={`
          relative w-full h-56 sm:h-64 flex items-center justify-center overflow-hidden
          ${isOutOfStock ? "bg-gray-100" : "bg-white"}
        `}
      >
        <Image
          src={product.images[0]?.url}
          alt={product.title}
          fill
          className={`
            object-contain p-4 transition-transform duration-500
            ${isOutOfStock ? "grayscale opacity-50" : "group-hover:scale-110"}
          `}
        />

        {/* Subtle gradient overlay on hover - only when in stock */}
        {!isOutOfStock && (
          <div
            className="
              absolute inset-0 
              bg-gradient-to-t from-white/80 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-300
            "
          />
        )}
      </div>

      {/* Content - Background changes based on stock */}
      <div
        className={`
          p-4 sm:p-5 relative z-10
          ${isOutOfStock ? "bg-gray-200" : "bg-[#0b0b0b]"}
        `}
      >
        {/* Product Info */}
        <div className="mb-4">
          <h3
            className={`
              text-base font-semibold line-clamp-2 leading-snug transition-colors
              ${
                isOutOfStock
                  ? "text-gray-600"
                  : "text-white group-hover:text-emerald-400"
              }
            `}
          >
            {product.title}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            {product.grade && (
              <span
                className={`
                  text-xs font-medium px-2 py-0.5 rounded-md border
                  ${
                    isOutOfStock
                      ? "bg-gray-300/50 text-gray-600 border-gray-400/30"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }
                `}
              >
                {product.grade}
              </span>
            )}
          </div>

          <p
            className={`
              text-lg sm:text-xl font-bold mt-2
              ${isOutOfStock ? "text-gray-500" : "text-emerald-400"}
            `}
          >
            ₹{product.price.toLocaleString()}
          </p>
        </div>

        {/* Cart Controls */}
        {!cartItem ? (
          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
            whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
            disabled={isOutOfStock}
            className={`
              cursor-pointer
              w-full py-3 rounded-xl
              text-sm font-semibold
              flex items-center justify-center gap-2
              transition-all duration-300
              ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400/30"
                  : "bg-white text-black hover:bg-emerald-400 hover:text-white shadow-lg hover:shadow-emerald-400/30"
              }
            `}
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              flex items-center justify-between
              gap-3
              rounded-xl
              border px-4 py-2.5
              backdrop-blur-sm
              ${
                isOutOfStock
                  ? "border-gray-400/30 bg-gray-300/50"
                  : "border-white/20 bg-white/5"
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* MINUS */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDec}
              className={`
                cursor-pointer
                h-8 w-8
                flex items-center justify-center
                rounded-lg
                border transition-all duration-200
                ${
                  isOutOfStock
                    ? "bg-gray-400/30 text-gray-600 border-gray-400/30"
                    : "bg-white/10 text-white/70 hover:text-red-400 hover:bg-red-400/10 border-white/10"
                }
              `}
            >
              <Minus size={16} strokeWidth={2.5} />
            </motion.button>

            {/* QTY */}
            <span
              className={`
                text-base font-bold min-w-[24px] text-center
                ${isOutOfStock ? "text-gray-600" : "text-white"}
              `}
            >
              {cartItem.quantity}
            </span>

            {/* PLUS */}
            <motion.button
              whileHover={{ scale: isOutOfStock ? 1 : 1.1 }}
              whileTap={{ scale: isOutOfStock ? 1 : 0.9 }}
              onClick={handleInc}
              disabled={isOutOfStock}
              className={`
                h-8 w-8
                flex items-center justify-center
                rounded-lg
                transition-all duration-200
                ${
                  isOutOfStock
                    ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                    : "cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/30"
                }
              `}
            >
              <Plus size={16} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}