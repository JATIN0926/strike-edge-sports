"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ProductCard from "@/components/Homepage/BestSellers/ProductCard";
import AppLoader from "../Loader/AppLoader";
import { MessageCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Product ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/api/products/${productId}`);
        setProduct(res.data);

        // fetch related (same category)
        const relatedRes = await axios.get(
          `${API}/api/products/${res.data._id}/related`
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

  if (loading) {
    return <AppLoader text="Loading product details…" />;
  }
  
  if (!product) return null;

  /* ========================== UI ========================== */

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-20">
        {/* ================= Product Section ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-[420px] bg-white rounded-2xl overflow-hidden border">
              <Image
                src={product.images[activeImage].url}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 flex-wrap">
              {product.images.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImage(i)}
                  className={`
                    relative w-24 h-24 rounded-xl overflow-hidden border
                    ${activeImage === i ? "ring-2 ring-emerald-500" : ""}
                  `}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-contain bg-white"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl md:text-4xl font-bold text-black">
              {product.title}
            </h1>

            <p className="text-2xl font-semibold text-emerald-600">
              ₹ {product.price}
            </p>

            {/* Description */}
            <div
              className="prose max-w-none text-black/80"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Add to Cart */}
            <button
              onClick={() => toast.success("Added to cart")}
              className="
                mt-4 w-full md:w-fit
                px-10 py-3 rounded-full
                bg-black text-white font-medium
                hover:bg-emerald-600 transition
              "
            >
              Add to Cart
            </button>

            {/* Delivery Note */}
            <div className="text-sm text-black/60 space-y-1">
              <p>You’ll receive SMS updates for exact delivery date.</p>
              <p>
                Usually delivered within <strong>5 days</strong>.
              </p>

              <motion.a
                whileHover={{ scale: 1.05 }}
                href="https://wa.me/918923765865"
                target="_blank"
                className="
                  mt-2 inline-flex items-center gap-2
                  px-4 py-2 rounded-full
                  bg-emerald-600 text-white
                  text-sm font-medium
                  hover:bg-emerald-700 transition
                "
              >
                <MessageCircle size={18} />
                WhatsApp Us
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* ================= Attributes ================= */}
        {product.attributes?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.attributes.map((attr, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white border flex gap-2"
                >
                  <span className="font-semibold">{attr.key}:</span>
                  <span className="text-black/70">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= Related Products ================= */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
