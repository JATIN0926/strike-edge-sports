"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setCurrentUser } from "@/redux/slices/userSlice";
import axios from "axios";

export default function AddAddressModal({
  open,
  onClose,
  onAddressAdded,
  mode = "add", // "add" | "edit"
  initialData = null, // address object when editing
}) {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [mounted, setMounted] = useState(false);
  const [useProfileName, setUseProfileName] = useState(false);
  const [useProfilePhone, setUseProfilePhone] = useState(false);

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* ---------- mount (portal safe) ---------- */
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    return () => setMounted(false);
  }, []);

  /* ---------- body scroll lock ---------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ---------- prefill for edit ---------- */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        street: initialData.street || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
      });
    }

    if (mode === "add") {
      setForm({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
      setUseProfileName(false);
      setUseProfilePhone(false);
    }
  }, [mode, initialData]);

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

  /* ---------- validation ---------- */
  const validateAddress = () => {
    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }

    if (!form.street.trim()) {
      toast.error("Street address is required");
      return false;
    }

    if (!form.city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (!form.state.trim()) {
      toast.error("State is required");
      return false;
    }

    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(form.pincode)) {
      toast.error("Enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  /* ---------- save (add / edit) ---------- */
  const handleSaveAddress = async () => {
    if (!validateAddress()) return;

    try {
      toast.loading(
        mode === "edit" ? "Updating address..." : "Saving address...",
        { id: "address-action" }
      );

      let res;

      if (mode === "edit") {
        res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/address/${initialData._id}`,
          form,
          { withCredentials: true }
        );
      } else {
        res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/address`,
          form,
          { withCredentials: true }
        );
      }

      dispatch(setCurrentUser(res.data.user));

      toast.success(
        mode === "edit"
          ? "Address updated successfully"
          : "Address added successfully",
        { id: "address-action" }
      );

      onAddressAdded?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save address", {
        id: "address-action",
      });
    }
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
            className="fixed inset-0 z-[102] flex items-center justify-center px-3 sm:px-4"
          >
            {/* Modal box */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="
                relative w-full max-w-lg
                max-h-[90vh] overflow-y-auto
                rounded-xl sm:rounded-2xl
                bg-black/80 backdrop-blur-xl
                border border-white/15
                shadow-[0_20px_60px_rgba(0,0,0,0.8)]
                p-4 sm:p-6
              "
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/60 hover:text-white cursor-pointer"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              <h3 className="text-white text-lg sm:text-xl font-semibold mb-4 sm:mb-6 pr-8">
                {mode === "edit" ? "Edit Address" : "Add New Address"}
              </h3>

              {/* FORM */}
              <div className="grid gap-3 sm:gap-4">
                {/* Full Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-white/70 text-xs sm:text-sm">Full Name</label>
                    <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useProfileName}
                        onChange={handleUseProfileName}
                        className="accent-white w-3 h-3 sm:w-auto sm:h-auto"
                      />
                      <span className="whitespace-nowrap">Same as profile</span>
                    </label>
                  </div>

                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    disabled={useProfileName}
                    className="
                      w-full rounded-lg sm:rounded-xl
                      bg-black/40 border border-white/15
                      px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white
                      outline-none focus:border-white/30
                      disabled:opacity-60
                    "
                  />
                </div>

                {/* Phone */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-white/70 text-xs sm:text-sm">
                      Phone Number
                    </label>
                    <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/60 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useProfilePhone}
                        onChange={handleUseProfilePhone}
                        className="accent-white w-3 h-3 sm:w-auto sm:h-auto"
                      />
                      <span className="whitespace-nowrap">Same as profile</span>
                    </label>
                  </div>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={useProfilePhone}
                    placeholder="+91 XXXXX XXXXX"
                    className="
                      w-full rounded-lg sm:rounded-xl
                      bg-black/40 border border-white/15
                      px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white
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
                    <label className="text-white/70 text-xs sm:text-sm block mb-1">
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="
                        w-full rounded-lg sm:rounded-xl
                        bg-black/40 border border-white/15
                        px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white
                        outline-none focus:border-white/30
                      "
                    />
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={onClose}
                  className="
                    px-4 sm:px-5 py-2 sm:py-2.5 rounded-full
                    border border-white/20
                    text-white text-xs sm:text-sm
                    hover:bg-white/10 transition
                    cursor-pointer
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveAddress}
                  className="
                    px-5 sm:px-6 py-2 sm:py-2.5 rounded-full
                    bg-white text-black
                    text-xs sm:text-sm font-medium
                    hover:bg-gray-200 transition
                    cursor-pointer
                  "
                >
                  {mode === "edit" ? "Update Address" : "Save Address"}
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