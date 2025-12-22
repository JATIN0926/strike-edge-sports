"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UploadCloud, X, Trash2 } from "lucide-react";
import ProductDescriptionEditor from "./ProductDescriptionEditor";

const API = process.env.NEXT_PUBLIC_API_URL;
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const fileInputRef = useRef();

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

  useEffect(() => {
    axios
      .get(`${API}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
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
      console.log("till here");
      await axios.delete(`${API}/api/products/cloudinary`, {
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
    if (images.length === 0)
      return toast.error("At least one image is required");

    toast.loading("Saving product...", { id: "save-product" });

    try {
      await axios.post(
        `${API}/api/products`,
        {
          ...form,
          images,
        },
        { withCredentials: true }
      );

      toast.success("Product added successfully", { id: "save-product" });

      // reset form (optional but recommended)
      setForm({
        title: "",
        productType: "bat",
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
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-black">Add New Product</h2>
        <p className="text-sm text-black/60">
          Fill product details carefully before publishing.
        </p>
      </div>

      {/* Product Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Title</label>
        <input
          className="w-full rounded-xl border border-black/10 px-4 py-2
                     bg-white/70 backdrop-blur focus:outline-none focus:ring-2
                     focus:ring-emerald-400"
          placeholder="Eg : English Willow – Elite"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      {/* Type & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Product Type</label>
          <select
            className="w-full rounded-xl border border-black/10 px-4 py-2 bg-white/70"
            value={form.productType}
            onChange={(e) => setForm({ ...form, productType: e.target.value })}
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
        <div>
          <label className="block text-sm font-medium mb-1">Grade</label>
          <input
            className="w-full rounded-xl border border-black/10 px-4 py-2 bg-white/70"
            placeholder="Elite / Grade A+"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            className="w-full rounded-xl border border-black/10 px-4 py-2 bg-white/70"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium mb-1">Stock</label>
        <input
          type="number"
          className="w-full rounded-xl border border-black/10 px-4 py-2 bg-white/70"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>

        <ProductDescriptionEditor
          key={editorKey}
          value={form.description}
          onChange={(html) => setForm({ ...form, description: html })}
        />
      </div>

      {/* Attributes */}
      <div>
        <label className="block text-sm font-medium mb-2">Attributes</label>
        {form.attributes.map((attr, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <input
              placeholder="Key"
              className="w-1/2 rounded-lg border px-3 py-2"
              value={attr.key}
              onChange={(e) => updateAttribute(i, "key", e.target.value)}
            />
            <input
              placeholder="Value"
              className="w-1/2 rounded-lg border px-3 py-2"
              value={attr.value}
              onChange={(e) => updateAttribute(i, "value", e.target.value)}
            />
            <button
              onClick={() => removeAttribute(i)}
              className="text-red-500 hover:scale-110 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={addAttribute}
          className=" cursor-pointer text-sm font-medium text-emerald-600 hover:underline"
        >
          + Add attribute
        </button>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Images</label>

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
            ref={fileInputRef}
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
            <div key={img.publicId} className="relative">
              <img
                src={img.url}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <button
                onClick={() => removeImage(img)}
                className=" cursor-pointer
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
          onClick={handleSaveProduct}
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
          {uploading ? "Uploading..." : "Save Product"}
        </button>
      </div>
    </div>
  );
}
