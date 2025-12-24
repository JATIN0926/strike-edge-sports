"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteProductModal from "./DeleteProductModal";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductAdminCard({ product, onRefresh }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const image = product.images?.[0]?.url || product.images?.[0];

  const handleDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`${API}/api/products/${product._id}`, {
        withCredentials: true,
      });

      toast.success("Product deleted successfully");
      setOpenDelete(false);
      onRefresh();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="
          rounded-2xl
          bg-white/50 backdrop-blur-xl
          border border-black/10
          shadow-sm
          hover:shadow-md hover:bg-white/60
          p-4
          flex flex-col
          transition-all duration-200
          group
        "
      >
        {/* Image */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-xl mb-3">
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            <span className={`
              px-2.5 py-1 rounded-full text-xs font-medium
              backdrop-blur-md border
              ${product.stock > 0 
                ? 'bg-green-50/90 text-green-700 border-green-200' 
                : 'bg-red-50/90 text-red-700 border-red-200'}
            `}>
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1.5">
          <h3 className="font-semibold text-base text-black/90 line-clamp-2 leading-snug">
            {product.title}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {product.grade}
            </span>
            <span className="text-base font-bold text-black/90">
              ₹{product.price}
            </span>
          </div>

          {product.productType && (
            <p className="text-xs text-black/50">
              Type: {product.productType}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2 pt-3 border-t border-black/5">
          <button
            onClick={() => router.push(`/edit/${product._id}`)}
            className="
              cursor-pointer
              flex-1 flex items-center justify-center gap-1.5
              px-3 py-2.5 text-sm font-medium rounded-lg
              bg-indigo-500 text-white
              hover:bg-indigo-600
              transition-all duration-200
              shadow-sm hover:shadow
            "
          >
            <Pencil size={16} strokeWidth={2.5} /> 
            <span>Edit</span>
          </button>

          <button
            onClick={() => setOpenDelete(true)}
            className="
              cursor-pointer
              flex-1 flex items-center justify-center gap-1.5
              px-3 py-2.5 text-sm font-medium rounded-lg
              bg-red-500 text-white
              hover:bg-red-600
              transition-all duration-200
              shadow-sm hover:shadow
            "
          >
            <Trash2 size={16} strokeWidth={2.5} /> 
            <span>Delete</span>
          </button>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
        productTitle={product.title}
      />
    </>
  );
}