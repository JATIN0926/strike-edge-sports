"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { Pencil, Trash2, Check, X, AlertTriangle } from "lucide-react";

const API = `/api/categories`;

export default function ManageCategories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* ---------- mount for portal (SSR safe) ---------- */
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    return () => setMounted(false);
  }, []);

  /* ---------- lock body scroll ---------- */
  useEffect(() => {
    if (deleteModal.open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [deleteModal.open]);

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

  // Delete Modal Component
  const DeleteCategoryModal = () => {
    if (!mounted) return null;

    const modalContent = (
      <AnimatePresence>
        {deleteModal.open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="
                  w-full max-w-md pointer-events-auto
                  bg-white/90 backdrop-blur-xl
                  rounded-3xl
                  shadow-2xl shadow-red-500/10
                  border border-white/50
                  overflow-hidden
                "
              >
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-br from-red-50 to-orange-50 p-6 pb-8">
                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeDeleteModal}
                    disabled={deleting}
                    className="
                      cursor-pointer
                      absolute top-4 right-4
                      w-8 h-8 rounded-full
                      bg-white/80 backdrop-blur
                      border border-black/5
                      flex items-center justify-center
                      text-black/60 hover:text-black
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors
                    "
                  >
                    <X size={18} strokeWidth={2.5} />
                  </motion.button>

                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="
                      w-16 h-16 mx-auto mb-4
                      rounded-2xl
                      bg-gradient-to-br from-red-500 to-orange-500
                      flex items-center justify-center
                      shadow-lg shadow-red-500/30
                    "
                  >
                    <Trash2
                      className="text-white"
                      size={32}
                      strokeWidth={2.5}
                    />
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-center text-black"
                  >
                    Delete Category
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-sm text-center text-black/60 mt-2"
                  >
                    This action cannot be undone
                  </motion.p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Category Info Box */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="
                      p-4 rounded-xl
                      bg-white/70 backdrop-blur
                      border border-black/10
                    "
                  >
                    <p className="text-xs font-medium text-black/50 mb-1">
                      Category Name
                    </p>
                    <p className="text-sm font-semibold text-black">
                      {deleteModal.name}
                    </p>
                  </motion.div>

                  {/* Warning message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="
                      flex items-start gap-3 p-4 rounded-xl
                      bg-amber-50/80 backdrop-blur
                      border border-amber-200/50
                    "
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle
                        className="text-amber-600"
                        size={16}
                        strokeWidth={2.5}
                      />
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Deleting this category will affect all products associated
                      with it. Make sure you want to proceed.
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-3 pt-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeDeleteModal}
                      disabled={deleting}
                      className="
                        cursor-pointer
                        flex-1 px-5 py-3 rounded-xl
                        bg-white/70 backdrop-blur
                        border border-black/10
                        text-black font-semibold text-sm
                        hover:bg-white hover:border-black/20
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200
                      "
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: deleting ? 1 : 1.02 }}
                      whileTap={{ scale: deleting ? 1 : 0.98 }}
                      onClick={handleDelete}
                      disabled={deleting}
                      className="
                        cursor-pointer
                        flex-1 px-5 py-3 rounded-xl
                        bg-gradient-to-r from-red-600 to-orange-600
                        text-white font-semibold text-sm
                        shadow-lg shadow-red-500/30
                        hover:shadow-xl hover:shadow-red-500/40
                        disabled:opacity-60 disabled:cursor-not-allowed
                        transition-all duration-200
                        flex items-center justify-center gap-2
                      "
                    >
                      {deleting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} strokeWidth={2.5} />
                          <span>Delete</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
  };

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
      <DeleteCategoryModal />
    </div>
  );
}
