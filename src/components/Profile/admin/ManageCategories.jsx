"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Pencil, Trash2, Check, X, AlertTriangle } from "lucide-react";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

export default function ManageCategories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    const res = await axios.get(API, { withCredentials: true });
    setCategories(res.data.categories);
  };

  const handleAdd = async () => {
    if (!name.trim()) return toast.error("Enter category name");

    try {
      await axios.post(API, { name }, { withCredentials: true });
      toast.success("Category added");
      setName("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return toast.error("Name required");

    try {
      await axios.put(
        `${API}/${id}`,
        { name: editName },
        { withCredentials: true }
      );
      toast.success("Category updated");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null, name: "" });
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`${API}/${deleteModal.id}`, {
        withCredentials: true,
      });
      toast.success("Category deleted");
      closeDeleteModal();
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-black/90">
          Manage Categories
        </h2>
        <p className="text-sm text-black/50 mt-1">
          Add, edit, or remove product categories
        </p>
      </motion.div>

      {/* Add Category */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Enter category name"
          className="
            flex-1
            rounded-xl px-4 py-2.5
            border border-black/10
            bg-white/60 backdrop-blur-md
            text-sm
            placeholder:text-black/40
            focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-transparent
            transition-all duration-200
          "
        />
        <button
          onClick={handleAdd}
          className="
            cursor-pointer
            px-6 py-2.5
            bg-black/90 text-white
            rounded-xl
            text-sm font-medium
            hover:bg-indigo-600
            transition-all duration-200
            shadow-sm hover:shadow-md
            whitespace-nowrap
          "
        >
          Add Category
        </button>
      </motion.div>

      {/* Category List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-3"
      >
        <AnimatePresence>
          {categories.map((cat, idx) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="
                flex items-center justify-between gap-3
                border border-black/10
                bg-white/50 backdrop-blur-xl
                p-4
                rounded-xl
                shadow-sm
                hover:shadow-md hover:bg-white/60
                transition-all duration-200
              "
            >
              {editingId === cat._id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat._id)}
                  className="
                    flex-1
                    border border-indigo-300
                    bg-white/80
                    px-3 py-2
                    rounded-lg
                    text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-400/50
                    transition-all duration-200
                  "
                  autoFocus
                />
              ) : (
                <span className="font-medium text-base text-black/90 flex-1">
                  {cat.name}
                </span>
              )}

              <div className="flex gap-2">
                {editingId === cat._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(cat._id)}
                      className="
                        cursor-pointer
                        p-2 rounded-lg
                        bg-green-500 text-white
                        hover:bg-green-600
                        transition-all duration-200
                        shadow-sm hover:shadow
                      "
                      title="Save"
                    >
                      <Check size={18} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="
                        cursor-pointer
                        p-2 rounded-lg
                        bg-gray-400 text-white
                        hover:bg-gray-500
                        transition-all duration-200
                        shadow-sm hover:shadow
                      "
                      title="Cancel"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(cat._id);
                        setEditName(cat.name);
                      }}
                      className="
                        cursor-pointer
                        p-2 rounded-lg
                        bg-indigo-500 text-white
                        hover:bg-indigo-600
                        transition-all duration-200
                        shadow-sm hover:shadow
                      "
                      title="Edit"
                    >
                      <Pencil size={18} strokeWidth={2.5} />
                    </button>

                    <button
                      onClick={() => openDeleteModal(cat._id, cat.name)}
                      className="
                        cursor-pointer
                        p-2 rounded-lg
                        bg-red-500 text-white
                        hover:bg-red-600
                        transition-all duration-200
                        shadow-sm hover:shadow
                      "
                      title="Delete"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              text-center py-12 px-4
              rounded-2xl
              bg-white/40 backdrop-blur-md
              border border-black/10
            "
          >
            <p className="text-sm text-black/50">
              No categories yet. Add your first category above!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="
                fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[90%] max-w-md
                bg-white/90 backdrop-blur-xl
                border border-black/10
                rounded-2xl
                shadow-2xl
                p-6
                z-50
              "
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={28} className="text-red-600" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-black/90 text-center mb-2">
                Delete Category?
              </h3>

              {/* Description */}
              <p className="text-sm text-black/60 text-center mb-6">
                Are you sure you want to delete <strong>"{deleteModal.name}"</strong>? This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="
                    cursor-pointer
                    flex-1 py-2.5 px-4
                    rounded-xl
                    text-sm font-medium
                    bg-gray-200 text-black/70
                    hover:bg-gray-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="
                    cursor-pointer
                    flex-1 py-2.5 px-4
                    rounded-xl
                    text-sm font-medium
                    bg-red-500 text-white
                    hover:bg-red-600
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    shadow-sm hover:shadow
                  "
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}