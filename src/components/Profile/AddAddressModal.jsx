"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function AddAddressModal({ open, onClose }) {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [mounted, setMounted] = useState(false);
  const [useProfileName, setUseProfileName] = useState(false);
  const [useProfilePhone, setUseProfilePhone] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* ---------- mount for portal (SSR safe) ---------- */
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => setMounted(false);
  }, []);

  /* ---------- lock body scroll ---------- */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  /* ---------- handlers ---------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUseProfileName = () => {
    if (!currentUser?.name) {
      toast.error("Profile name not available");
      return;
    }

    setUseProfileName((prev) => !prev);
    setForm((prev) => ({
      ...prev,
      fullName: !useProfileName ? currentUser.name : "",
    }));
  };

  const handleUseProfilePhone = () => {
    if (!currentUser?.phone) {
      toast.error("Please add phone number in profile first");
      return;
    }

    setUseProfilePhone((prev) => !prev);
    setForm((prev) => ({
      ...prev,
      phone: !useProfilePhone ? currentUser.phone : "",
    }));
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[101] bg-black/60 backdrop-blur-md"
          />

          {/* Center wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[102] flex items-center justify-center px-4"
          >
            {/* Modal box */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="
                relative w-full max-w-lg
                max-h-[85vh] overflow-y-auto
                rounded-2xl
                bg-black/80 backdrop-blur-xl
                border border-white/15
                shadow-[0_20px_60px_rgba(0,0,0,0.8)]
                p-6
              "
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="text-white text-xl font-semibold mb-6">
                Add New Address
              </h3>

              {/* FORM */}
              <div className="grid gap-4">
                {/* Full Name */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-white/70 text-sm">Full Name</label>
                    <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useProfileName}
                        onChange={handleUseProfileName}
                        className="accent-white"
                      />
                      Same as profile
                    </label>
                  </div>

                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    disabled={useProfileName}
                    className="
                      mt-1 w-full rounded-xl
                      bg-black/40 border border-white/15
                      px-4 py-2 text-white
                      outline-none focus:border-white/30
                      disabled:opacity-60
                    "
                  />
                </div>

                {/* Phone */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-white/70 text-sm">
                      Phone Number
                    </label>
                    <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useProfilePhone}
                        onChange={handleUseProfilePhone}
                        className="accent-white"
                      />
                      Same as profile
                    </label>
                  </div>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={useProfilePhone}
                    placeholder="+91 XXXXX XXXXX"
                    className="
                      mt-1 w-full rounded-xl
                      bg-black/40 border border-white/15
                      px-4 py-2 text-white
                      outline-none focus:border-white/30
                      disabled:opacity-60
                    "
                  />
                </div>

                {/* Address fields */}
                {[
                  { name: "street", label: "Street Address" },
                  { name: "city", label: "City" },
                  { name: "state", label: "State" },
                  { name: "pincode", label: "Pincode" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-white/70 text-sm">
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="
                        mt-1 w-full rounded-xl
                        bg-black/40 border border-white/15
                        px-4 py-2 text-white
                        outline-none focus:border-white/30
                      "
                    />
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="
                    px-5 py-2 rounded-full
                    border border-white/20
                    text-white text-sm
                    hover:bg-white/10 transition
                    cursor-pointer
                  "
                >
                  Cancel
                </button>

                <button
                  className="
                    px-6 py-2 rounded-full
                    bg-white text-black
                    text-sm font-medium
                    hover:bg-gray-200 transition
                    cursor-pointer
                  "
                >
                  Save Address
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
