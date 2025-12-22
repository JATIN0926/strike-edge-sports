"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UploadCloud, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductDescriptionEditor from "../Profile/admin/ProductDescriptionEditor";

const API = process.env.NEXT_PUBLIC_API_URL;
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function EditProduct({ productId }) {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [form, setForm] = useState({
    title: "",
    productType: "bat",
    category: "",
    grade: "",
    price: "",
    stock: "",
    description: "",
    attributes: [],
  });

  /* ---------------- Fetch Categories ---------------- */
  useEffect(() => {
    axios
      .get(`${API}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  /* ---------------- Fetch Product ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/api/products/edit/${productId}`, {
          withCredentials: true,
        });

        const p = res.data;

        setForm({
          title: p.title || "",
          productType: p.productType || "bat",
          category: p.category?._id || p.category,
          grade: p.grade || "",
          price: p.price || "",
          stock: p.stock || "",
          description: p.description || "",
          attributes: p.attributes || [],
        });

        setImages(p.images || []);
      } catch {
        toast.error("Failed to load product");
        router.push("/profile");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  /* ---------------- Image Upload ---------------- */
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
    }
  };

  /* ---------------- Attributes ---------------- */
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
  };

  /* ---------------- Remove Image ---------------- */
  const removeImage = async (img) => {
    setImages((prev) => prev.filter((i) => i.publicId !== img.publicId));

    try {
      await axios.delete(`${API}/api/products/cloudinary`, {
        params: { publicId: img.publicId },
        withCredentials: true,
      });

      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image from Cloudinary");
    }
  };

  /* ---------------- Update Product ---------------- */
  const handleUpdateProduct = async () => {
    if (!form.title.trim()) return toast.error("Product title is required");
    if (!form.category) return toast.error("Please select a category");
    if (!form.grade.trim()) return toast.error("Grade is required");
    if (!form.price) return toast.error("Price is required");
    if (images.length === 0)
      return toast.error("At least one image is required");

    toast.loading("Updating product...", { id: "update-product" });

    try {
      await axios.put(
        `${API}/api/products/${productId}`,
        {
          ...form,
          images,
        },
        { withCredentials: true }
      );

      toast.success("Product updated successfully", {
        id: "update-product",
      });

      router.push("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed", {
        id: "update-product",
      });
    }
  };

  if (loadingProduct) {
    return <p className="text-sm text-black/60">Loading product…</p>;
  }

  /* ========================== UI ========================== */

  return (
    <div className="w-full flex items-center justify-center mt-24">
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            Edit Product
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              Admin
            </span>
          </h2>

          <p className="text-sm text-black/60">
            Modify product details, images and attributes.
          </p>
        </div>

        {/* Product Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Title
          </label>
          <input
            className="w-full rounded-xl border border-black/10 px-4 py-2
          bg-white/70 backdrop-blur focus:outline-none focus:ring-2
          focus:ring-emerald-400"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Type & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Type
            </label>
            <select
              className="w-full rounded-xl border border-black/10 px-4 py-2 bg-white/70"
              value={form.productType}
              onChange={(e) =>
                setForm({ ...form, productType: e.target.value })
              }
            >
              <option value="bat">Bat</option>
              <option value="ball">Ball</option>
              <option value="gloves">Gloves</option>
              <option value="pads">Pads</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full rounded-xl border border-black/10 px-4 py-2 bg-white/70"
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
        </div>

        {/* Grade & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            placeholder="Grade"
            className="rounded-xl border px-4 py-2"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="rounded-xl border px-4 py-2"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        {/* Stock */}
        <input
          type="number"
          placeholder="Stock"
          className="rounded-xl border px-4 py-2"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        {/* Description */}
        <ProductDescriptionEditor
          value={form.description}
          onChange={(html) => setForm({ ...form, description: html })}
        />

        {/* Attributes */}
        {form.attributes.map((attr, i) => (
          <div key={i} className="flex gap-3">
            <input
              className="w-1/2 border rounded px-3 py-2"
              value={attr.key}
              onChange={(e) => updateAttribute(i, "key", e.target.value)}
            />
            <input
              className="w-1/2 border rounded px-3 py-2"
              value={attr.value}
              onChange={(e) => updateAttribute(i, "value", e.target.value)}
            />
            <button onClick={() => removeAttribute(i)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button onClick={addAttribute} className="text-emerald-600">
          + Add attribute
        </button>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Images
          </label>

          <label
            className="
      flex flex-col items-center justify-center
      border-2 border-dashed border-black/20
      rounded-2xl p-6 cursor-pointer
      bg-white/60 backdrop-blur
      hover:border-emerald-500 transition
    "
          >
            <UploadCloud className="w-8 h-8 text-black/50 mb-2" />
            <span className="text-sm text-black/70">
              Click to upload multiple images
            </span>

            <input
              type="file"
              multiple
              hidden
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </label>

          {uploading && (
            <p className="text-sm text-black/60 mt-2">Uploading images…</p>
          )}

          <div className="flex gap-3 flex-wrap mt-4">
            {images.map((img) => (
              <div key={img.publicId} className="relative group">
                <img
                  src={img.url}
                  className="
            w-24 h-24 rounded-xl object-cover
            transition-transform group-hover:scale-105
          "
                />
                <button
                  onClick={() => removeImage(img)}
                  className="
            cursor-pointer
            absolute -top-2 -right-2
            bg-black text-white rounded-full p-1
            hover:scale-110 transition
          "
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="pt-6">
          <button
            onClick={handleUpdateProduct}
            disabled={uploading}
            className={`
      cursor-pointer
      w-full md:w-auto
      px-10 py-3 rounded-full
      font-medium transition
      ${
        uploading
          ? "bg-black/50 text-white cursor-not-allowed"
          : "bg-black text-white hover:bg-emerald-600"
      }
    `}
          >
            {uploading ? "Uploading…" : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
