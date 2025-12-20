"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
      <div
        className="
          rounded-2xl
          bg-white/80 backdrop-blur
          border border-black/10
          shadow-[0_8px_24px_rgba(0,0,0,0.06)]
          p-4
          flex flex-col
        "
      >
        {/* Image */}
        <div className="relative w-full h-64 overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Info */}
        <h3 className="font-semibold text-black leading-snug">
          {product.title}
        </h3>

        <p className="text-sm text-black/60">
          {product.grade} · ₹{product.price}
        </p>

        <p className="text-xs text-black/50 mt-1">Stock: {product.stock}</p>

        {/* Actions */}
        <div className="mt-auto flex gap-3 pt-4">
          <button
            onClick={() => router.push(`/edit/${product._id}`)}
            className=" cursor-pointer
              flex items-center gap-1
              px-3 py-2 text-sm rounded-lg
              bg-indigo-500 text-white
              hover:bg-indigo-600 transition
            "
          >
            <Pencil size={14} /> Edit
          </button>

          <button
            onClick={() => setOpenDelete(true)}
            className=" cursor-pointer
              flex items-center gap-1
              px-3 py-2 text-sm rounded-lg
              bg-red-500 text-white
              hover:bg-red-600 transition
            "
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

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
