"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { UploadCloud, X, Trash2, Plus, Package } from "lucide-react";
import ProductDescriptionEditor from "./ProductDescriptionEditor";
import axiosInstance from "@/utils/axiosInstance";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    title: "",
    productType: "",
    category: "",
    grade: "",
    price: "",
    stock: "",
    description: "",
    attributes: [],
  });

  useEffect(() => {
    axiosInstance
      .get(`/api/categories`)
      .then((res) => setCategories(res.data.categories))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`/api/product-types`)
      .then((res) => setProductTypes(res.data.productTypes))
      .catch(() => toast.error("Failed to load product types"));
  }, []);

  const handleImageUpload = async (files) => {
    if (!files.length) return;

    setUploading(true);
    toast.loading("Uploading images...", { id: "upload" });

    try {
      const uploaded = [];

      for (let file of files) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
          { method: "POST", body: data }
        );

        const json = await res.json();
        uploaded.push({
          url: json.secure_url,
          publicId: json.public_id,
        });
      }

      setImages((prev) => [...prev, ...uploaded]);
      toast.success("Images uploaded", { id: "upload" });
    } catch {
      toast.error("Image upload failed", { id: "upload" });
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addAttribute = () => {
    setForm({
      ...form,
      attributes: [...form.attributes, { key: "", value: "" }],
    });
  };

  const updateAttribute = (i, field, value) => {
    const updated = [...form.attributes];
    updated[i][field] = value;
    setForm({ ...form, attributes: updated });
  };

  const removeAttribute = (i) => {
    const updated = [...form.attributes];
    updated.splice(i, 1);
    setForm({ ...form, attributes: updated });
    toast.success("Attribute removed");
  };

  const removeImage = async (img) => {
    // optimistic UI update
    setImages((prev) => prev.filter((i) => i.publicId !== img.publicId));

    try {
      await axiosInstance.delete(`/api/products/cloudinary`, {
        params: { publicId: img.publicId },
        withCredentials: true,
      });

      toast.success("Image removed");
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove image from Cloudinary");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveProduct = async () => {
    // basic validations
    if (!form.title.trim()) return toast.error("Product title is required");
    if (!form.category) return toast.error("Please select a category");
    if (!form.grade.trim()) return toast.error("Grade is required");
    if (!form.price) return toast.error("Price is required");
    if (!form.productType) return toast.error("Please select a product type");
    if (images.length === 0)
      return toast.error("At least one image is required");

    toast.loading("Saving product...", { id: "save-product" });

    try {
      await axiosInstance.post(
        `/api/products`,
        {
          ...form,
          images,
        },
        { withCredentials: true }
      );

      toast.success("Product added successfully", { id: "save-product" });

      // reset form
      setForm({
        title: "",
        productType: "",
        category: "",
        grade: "",
        price: "",
        stock: "",
        description: "",
        attributes: [],
      });
      setImages([]);
      setEditorKey((prev) => prev + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product", {
        id: "save-product",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-100">
            <Package className="text-emerald-600" size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black/90">
            Add New Product
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-black/50">
          Fill product details carefully before publishing.
        </p>
      </motion.div>

      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Product Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-xl border border-black/10"
        >
          <label className="block text-xs sm:text-sm font-semibold mb-2 text-black/80">
            Product Title *
          </label>
          <input
            className="
              w-full rounded-lg sm:rounded-xl border border-black/10 px-3 sm:px-4 py-2 sm:py-2.5
              bg-white/70 backdrop-blur-sm
              text-xs sm:text-sm
              placeholder:text-black/40
              focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent
              transition-all duration-200
            "
            placeholder="e.g., English Willow – Elite"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </motion.div>

        {/* Type & Category */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
        >
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-xl border border-black/10">
            <label className="block text-xs sm:text-sm font-semibold mb-2 text-black/80">
              Product Type *
            </label>
            <select
              className="
                w-full rounded-lg sm:rounded-xl border border-black/10 px-3 sm:px-4 py-2 sm:py-2.5
                bg-white/70 backdrop-blur-sm text-xs sm:text-sm
                cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-emerald-400/50
                transition-all duration-200
              "
              value={form.productType}
              onChange={(e) =>
                setForm({ ...form, productType: e.target.value })
              }
            >
              <option value="">Select product type</option>
              {productTypes.map((type) => (
                <option key={type._id} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-xl border border-black/10">
            <label className="block text-xs sm:text-sm font-semibold mb-2 text-black/80">
              Category *
            </label>
            <select
              className="
                w-full rounded-lg sm:rounded-xl border border-black/10 px-3 sm:px-4 py-2 sm:py-2.5
                bg-white/70 backdrop-blur-sm text-xs sm:text-sm
                cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-emerald-400/50
                transition-all duration-200
              "
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Grade & Price */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
        >
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-xl border border-black/10">
            <label className="block text-xs sm:text-sm font-semibold mb-2 text-black/80">
              Grade *
            </label>
            <input
              className="
                w-full rounded-lg sm:rounded-xl border border-black/10 px-3 sm:px-4 py-2 sm:py-2.5
                bg-white/70 backdrop-blur-sm text-xs sm:text-sm
                placeholder:text-black/40
                focus:outline-none focus:ring-2 focus:ring-emerald-400/50
                transition-all duration-200
              "
              placeholder="e.g., Elite / Grade A+"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            />
          </div>

          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-xl border border-black/10">
            <label className="block text-xs sm:text-sm font-semibold mb-2 text-black/80">
              Price (₹) *
            </label>
            <input
              type="number"
              className="
                w-full rounded-lg sm:rounded-xl border border-black/10 px-3 sm:px-4 py-2 sm:py-2.5
                bg-white/70 backdrop-blur-sm text-xs sm:text-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-400/50
                transition-all duration-200
              "
              placeholder="Enter price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
        </motion.div>

        {/* Stock */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-xl border border-black/10"
        >
          <label className="block text-xs sm:text-sm font-semibold mb-2 text-black/80">
            Stock Quantity
          </label>
          <input
            type="number"
            className="
              w-full rounded-lg sm:rounded-xl border border-black/10 px-3 sm:px-4 py-2 sm:py-2.5
              bg-white/70 backdrop-blur-sm text-xs sm:text-sm
              focus:outline-none focus:ring-2 focus:ring-emerald-400/50
              transition-all duration-200
            "
            placeholder="Enter available stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-xl border border-black/10"
        >
          <label className="block text-xs sm:text-sm font-semibold mb-2 text-black/80">
            Description
          </label>
          <ProductDescriptionEditor
            key={editorKey}
            value={form.description}
            onChange={(html) => setForm({ ...form, description: html })}
          />
        </motion.div>

        {/* Attributes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-xl border border-black/10"
        >
          <label className="block text-xs sm:text-sm font-semibold mb-3 text-black/80">
            Product Attributes
          </label>

          <AnimatePresence>
            {form.attributes.map((attr, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col sm:flex-row gap-2 mb-3"
              >
                <input
                  placeholder="Key (e.g., Weight)"
                  className="
                    flex-1 rounded-lg border border-black/10 px-3 py-2
                    bg-white/70 text-xs sm:text-sm
                    focus:outline-none focus:ring-2 focus:ring-emerald-400/50
                    transition-all duration-200
                  "
                  value={attr.key}
                  onChange={(e) => updateAttribute(i, "key", e.target.value)}
                />
                <div className="flex gap-2">
                  <input
                    placeholder="Value (e.g., 1.2 kg)"
                    className="
                      flex-1 rounded-lg border border-black/10 px-3 py-2
                      bg-white/70 text-xs sm:text-sm
                      focus:outline-none focus:ring-2 focus:ring-emerald-400/50
                      transition-all duration-200
                    "
                    value={attr.value}
                    onChange={(e) =>
                      updateAttribute(i, "value", e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeAttribute(i)}
                    className="
                      cursor-pointer
                      p-2 rounded-lg flex-shrink-0
                      bg-red-500 text-white
                      hover:bg-red-600
                      transition-all duration-200
                    "
                  >
                    <Trash2
                      size={16}
                      className="sm:w-[18px] sm:h-[18px]"
                      strokeWidth={2.5}
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={addAttribute}
            className="
              cursor-pointer
              flex items-center gap-1.5
              text-xs sm:text-sm font-medium
              text-emerald-600
              hover:text-emerald-700
              transition-colors
            "
          >
            <Plus size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
            Add attribute
          </button>
        </motion.div>

        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-xl border border-black/10"
        >
          <label className="block text-xs sm:text-sm font-semibold mb-3 text-black/80">
            Product Images *
          </label>

          <label
            className="
              flex flex-col items-center justify-center
              border-2 border-dashed border-black/20
              rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer
              bg-white/60 backdrop-blur-sm
              hover:border-emerald-500 hover:bg-emerald-50/30
              transition-all duration-300
              group
            "
          >
            <UploadCloud
              className="w-8 h-8 sm:w-10 sm:h-10 text-black/40 group-hover:text-emerald-600 mb-2 sm:mb-3 transition-colors"
              strokeWidth={2}
            />
            <span className="text-xs sm:text-sm font-medium text-black/70 group-hover:text-emerald-600 transition-colors text-center">
              Click to upload multiple images
            </span>
            <span className="text-[10px] sm:text-xs text-black/40 mt-1">
              PNG, JPG up to 10MB
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </label>

          {uploading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs sm:text-sm text-emerald-600 mt-3 font-medium"
            >
              Uploading images…
            </motion.p>
          )}

          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 sm:gap-3 flex-wrap mt-3 sm:mt-4"
              >
                {images.map((img, idx) => (
                  <motion.div
                    key={img.publicId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative group"
                  >
                    <img
                      src={img.url}
                      alt="Product"
                      className="
                        w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl object-cover
                        border border-black/10
                        group-hover:scale-105 transition-transform duration-200
                      "
                    />
                    <button
                      onClick={() => removeImage(img)}
                      className="
                        cursor-pointer
                        absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2
                        bg-red-500 text-white rounded-full p-1 sm:p-1.5
                        opacity-0 group-hover:opacity-100
                        hover:bg-red-600 hover:scale-110
                        transition-all duration-200
                        shadow-lg
                      "
                    >
                      <X
                        size={12}
                        className="sm:w-[14px] sm:h-[14px]"
                        strokeWidth={3}
                      />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="pt-2 sm:pt-4"
        >
          <button
            onClick={handleSaveProduct}
            disabled={uploading}
            className={`
              cursor-pointer
              w-full sm:w-auto
              px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl
              font-semibold text-xs sm:text-sm
              transition-all duration-300
              ${
                uploading
                  ? "bg-black/50 text-white cursor-not-allowed"
                  : "bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
              }
            `}
          >
            {uploading ? "Uploading Images..." : "Save Product"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
