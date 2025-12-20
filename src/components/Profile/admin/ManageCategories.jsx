"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2, Check, X } from "lucide-react";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

export default function ManageCategories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    const res = await axios.get(API, { withCredentials: true });
    setCategories(res.data);
  };

  const handleAdd = async () => {
    if (!name.trim()) return toast.error("Enter category name");

    try {
      await axios.post(
        API,
        { name },
        { withCredentials: true }
      );
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

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await axios.delete(`${API}/${id}`, {
        withCredentials: true,
      });
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Manage Categories</h2>

      {/* Add Category */}
      <div className="flex gap-4 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="border rounded-lg px-4 py-2 w-full"
        />
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-black text-white rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between border p-3 rounded-lg"
          >
            {editingId === cat._id ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border px-3 py-1 rounded w-full mr-4"
              />
            ) : (
              <span className="font-medium">{cat.name}</span>
            )}

            <div className="flex gap-3">
              {editingId === cat._id ? (
                <>
                  <button onClick={() => handleUpdate(cat._id)}>
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingId(null)}>
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(cat._id);
                      setEditName(cat.name);
                    }}
                  >
                    <Pencil size={18} />
                  </button>

                  <button onClick={() => handleDelete(cat._id)}>
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
