"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ProductCard from "@/components/Homepage/BestSellers/ProductCard";
import AppLoader from "../Loader/AppLoader";
import {
  MessageCircle,
  ShoppingCart,
  Sparkles,
  Minus,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQty, decreaseQty } from "@/redux/slices/cartSlice";
import axiosInstance from "@/utils/axiosInstance";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetail({ productId }) {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get cart item from Redux
  const cartItem = useSelector((state) => state.cart.items[productId]);

  /* ---------------- Fetch Product ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/products/${productId}`);
        setProduct(res.data);

        // fetch related (same category)
        const relatedRes = await axiosInstance.get(
          `/api/products/${res.data._id}/related`
        );

        setRelated(relatedRes.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const isOutOfStock =
    product &&
    (product.stock === 0 || (cartItem && cartItem.quantity >= product.stock));

  /* ---------------- Cart Handlers ---------------- */
  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images[0]?.url,
      })
    );
    toast.success("Added to cart!");
  };

  const handleIncrease = () => {
    if (cartItem && cartItem.quantity >= product.stock) {
      toast.error(
        `Only ${product.stock} items available in stock , Can't Add More`
      );
      return;
    }
    dispatch(increaseQty(productId));
  };

  const handleDecrease = () => {
    dispatch(decreaseQty(productId));
  };

  if (loading) {
    return <AppLoader text="Loading product details…" />;
  }

  if (!product) return null;

  /* ========================== UI ========================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fa] via-white to-blue-50/30 pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-20 pb-20">
        {/* ================= Product Section ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`
                relative w-full h-[420px] backdrop-blur-xl rounded-3xl overflow-hidden border shadow-2xl
                ${
                  isOutOfStock
                    ? "bg-gray-100/70 border-gray-300/50 shadow-gray-500/10"
                    : "bg-white/70 border-white/50 shadow-blue-500/10"
                }
              `}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.images[activeImage].url}
                    alt={product.title}
                    fill
                    className={`
                      object-contain p-8 transition-all duration-300
                      ${isOutOfStock ? "grayscale opacity-50" : ""}
                    `}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`
                  absolute top-4 left-4 px-4 py-2 rounded-full backdrop-blur-sm text-xs font-semibold flex items-center gap-2
                  ${
                    isOutOfStock
                      ? "bg-red-500/90 text-white"
                      : "bg-emerald-500/90 text-white"
                  }
                `}
              >
                {isOutOfStock ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Out of Stock
                  </>
                ) : product.stock <= 5 ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Only {product.stock} left
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Premium Quality
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Thumbnails */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 flex-wrap"
            >
              {product.images.map((img, i) => (
                <motion.button
                  key={img.publicId}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(i)}
                  className={`
                    relative w-24 h-24 rounded-2xl overflow-hidden
                    bg-white/70 backdrop-blur-xl border
                    transition-all duration-300
                    ${
                      activeImage === i
                        ? "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/30 border-emerald-500/50"
                        : "border-white/50 hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-500/20"
                    }
                  `}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-contain p-2"
                  />
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-black leading-tight"
            >
              {product.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-baseline gap-3"
            >
              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                ₹{product.price}
              </p>
              <span className="text-sm text-black/50">
                Inclusive of all taxes
              </span>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose max-w-none text-black/80 bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mt-4"
            >
              {/* Add to Cart or Quantity Control */}
              {!cartItem ? (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="
                    flex-1 px-6 py-3 rounded-xl
                    bg-gradient-to-r from-emerald-600 to-emerald-500
                    text-white font-semibold text-base
                    shadow-lg shadow-emerald-500/30
                    hover:shadow-xl hover:shadow-emerald-500/40
                    transition-all duration-300
                    flex items-center justify-center gap-2
                  "
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="
                    flex-1 flex items-center justify-center gap-6
                    px-6 py-3 rounded-xl
                    bg-white/70 backdrop-blur-xl
                    border border-emerald-500/50
                    shadow-lg shadow-emerald-500/20
                  "
                >
                  {/* Minus Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDecrease}
                    className="
                      h-8 w-8 rounded-full
                      flex items-center justify-center
                      bg-white/80 border border-black/10
                      text-black/70 hover:text-black
                      hover:bg-white hover:border-emerald-500/30
                      transition-all duration-200
                    "
                  >
                    <Minus size={16} />
                  </motion.button>

                  {/* Quantity */}
                  <span className="text-lg font-bold text-black min-w-[24px] text-center">
                    {cartItem.quantity}
                  </span>

                  {/* Plus Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleIncrease}
                    // disabled={isOutOfStock}
                    className="
                      h-8 w-8 rounded-full
                      flex items-center justify-center
                      bg-emerald-500 border border-emerald-600
                      text-white
                      hover:bg-emerald-600
                      transition-all duration-200
                      shadow-lg shadow-emerald-500/30
                    "
                  >
                    <Plus size={16} />
                  </motion.button>
                </motion.div>
              )}

              {/* WhatsApp Button */}
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/918923765865"
                target="_blank"
                className="
                  px-5 py-3 rounded-xl
                  bg-white/70 backdrop-blur-xl
                  border border-white/50
                  text-emerald-600 font-semibold text-base
                  shadow-lg shadow-blue-500/10
                  hover:shadow-xl hover:shadow-blue-500/20
                  hover:border-emerald-500/50
                  transition-all duration-300
                  flex items-center justify-center gap-2
                "
              >
                <MessageCircle size={18} />
                WhatsApp
              </motion.a>
            </motion.div>

            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-emerald-50/80 backdrop-blur-xl border border-white/50"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-black">
                    Fast & Secure Delivery
                  </p>
                  <p className="text-black/70">
                    You'll receive SMS updates for exact delivery date.
                  </p>
                  <p className="text-black/70">
                    Usually delivered within{" "}
                    <span className="font-semibold text-emerald-600">
                      5 days
                    </span>
                    .
                  </p>
                  <p className="text-black/70 mt-3 pt-3 border-t border-black/10">
                    You can WhatsApp us for any delivery or other doubts you
                    have.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ================= Attributes ================= */}
        {product.attributes?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-black">
              Product Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.attributes.map((attr, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="
                    p-5 rounded-2xl
                    bg-white/70 backdrop-blur-xl
                    border border-white/50
                    shadow-lg shadow-blue-500/5
                    hover:shadow-xl hover:shadow-blue-500/10
                    hover:border-blue-300/50
                    transition-all duration-300
                    flex gap-3
                  "
                >
                  <span className="font-semibold text-black">{attr.key}:</span>
                  <span className="text-black/70">{attr.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= Related Products ================= */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-3xl font-bold text-black">
                You May Also Like
              </h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
