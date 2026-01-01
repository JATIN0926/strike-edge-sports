"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Info, Plus } from "lucide-react";
import AddAddressModal from "./user/AddAddressModal";
import toast from "react-hot-toast";
import { setCurrentUser } from "@/redux/slices/userSlice";
import DeleteAddressModal from "./user/DeleteAddressModal";
import AppLoader from "../Loader/AppLoader";
import axiosInstance from "@/utils/axiosInstance";

export default function ProfileInfo() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addressToEdit, setAddressToEdit] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser) return;
    setName(currentUser.name || "");
    setPhone(currentUser.phone || "");
  }, [currentUser]);

  const validateProfile = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return false;
    }

    if (name.trim().length < 2) {
      toast.error("Name is too short");
      return false;
    }

    if (phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return false;
      }
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    try {
      toast.loading("Saving changes...", { id: "profile-save" });

      const res = await axiosInstance.put(
        `/api/user/profile`,
        { name: name.trim(), phone },
        { withCredentials: true }
      );

      dispatch(setCurrentUser(res.data.user));

      toast.success("Profile updated successfully", {
        id: "profile-save",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile", {
        id: "profile-save",
      });
    }
  };

  const fetchLatestUser = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/me`, {
        withCredentials: true,
      });

      dispatch(setCurrentUser(res.data.user));
    } catch (err) {
      toast.error("Failed to refresh user data");
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete?._id) return;

    try {
      toast.loading("Deleting address...", { id: "delete-address" });

      await axiosInstance.delete(`/api/user/address/${addressToDelete._id}`, {
        withCredentials: true,
      });

      toast.success("Address deleted", { id: "delete-address" });

      setOpenDeleteModal(false);
      setAddressToDelete(null);

      fetchLatestUser();
    } catch (err) {
      toast.error("Failed to delete address", {
        id: "delete-address",
      });
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      toast.loading("Updating default address...", { id: "default-address" });

      const res = await axiosInstance.patch(
        `/api/user/address/${addressId}/default`,
        {},
        { withCredentials: true }
      );

      dispatch(setCurrentUser(res.data.user));

      toast.success("Default address updated", { id: "default-address" });
    } catch (err) {
      toast.error("Failed to update default address", {
        id: "default-address",
      });
    }
  };

  const handleCloseAddressModal = () => {
    setOpenAddressModal(false);
    setAddressToEdit(null);
  };

  if (!currentUser) {
    return <AppLoader text="Loading profile details…" />;
  }

  return (
    <>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Header */}
        <h2 className="text-black text-xl sm:text-2xl font-semibold">
          Profile Information
        </h2>

        {/* User Summary */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
            <Image
              src={currentUser.photoURL}
              alt="Profile"
              fill
              className="rounded-full object-cover border border-black/10"
            />
          </div>

          <div className="text-center sm:text-left">
            <p className="text-black font-medium text-sm sm:text-base break-all">
              {currentUser.email}
            </p>
            <p className="text-black/50 text-xs sm:text-sm">
              Logged in via Google
            </p>
          </div>
        </div>

        {/* Basic Info */}
        <div
          className="
            max-w-full lg:max-w-lg space-y-4
            rounded-2xl
            bg-white/70 backdrop-blur-xl
            border border-black/10
            p-4 sm:p-6
          "
        >
          <div>
            <label className="text-black/70 text-xs sm:text-sm">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                mt-1 w-full rounded-xl
                bg-white border border-black/15
                px-3 sm:px-4 py-2 text-sm sm:text-base text-black
                outline-none
                focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-500/20
              "
            />
          </div>

          <div>
            <label className="text-black/70 text-xs sm:text-sm">
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="
                mt-1 w-full rounded-xl
                bg-white border border-black/15
                px-3 sm:px-4 py-2 text-sm sm:text-base text-black
                outline-none
                focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-500/20
              "
            />
          </div>

          <p className="text-black/50 text-xs flex items-start gap-1.5">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <span>
              You can edit your information anytime. Don't forget to save your
              changes.
            </span>
          </p>

          <button
            onClick={handleSaveProfile}
            className="
              cursor-pointer
              mt-2 w-full sm:w-auto inline-flex items-center justify-center
              rounded-full
              bg-gradient-to-r from-indigo-500 to-blue-500
              text-white
              px-6 py-2.5
              text-sm font-medium
              hover:opacity-90 transition
              shadow-[0_8px_20px_rgba(99,102,241,0.35)]
            "
          >
            Save Changes
          </button>
        </div>

        {/* Addresses */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-black text-lg sm:text-xl font-semibold">
              Saved Addresses
            </h3>

            <button
              onClick={() => setOpenAddressModal(true)}
              className="
                cursor-pointer
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                rounded-full
                border border-black/15
                px-4 py-2.5
                text-sm text-black
                hover:bg-black/5 transition
              "
            >
              <Plus size={16} />
              Add Address
            </button>
          </div>

          {currentUser.addresses?.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {currentUser.addresses.map((address, index) => (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    bg-white/70 backdrop-blur-xl
                    border border-black/10
                    p-4
                    flex flex-col gap-2
                  "
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-black font-medium text-sm sm:text-base break-words">
                      {address.fullName}
                    </p>

                    {address.isDefault ? (
                      <span className="text-xs text-green-600 font-semibold whitespace-nowrap">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="
                          text-xs font-medium
                          text-indigo-600
                          hover:underline
                          cursor-pointer
                          whitespace-nowrap
                        "
                      >
                        Mark default
                      </button>
                    )}
                  </div>

                  <p className="text-black/70 text-xs sm:text-sm break-words">
                    {address.street}, {address.city}, {address.state} –{" "}
                    {address.pincode}
                  </p>

                  <p className="text-black/60 text-xs sm:text-sm">
                    Phone: {address.phone}
                  </p>

                  <div className="flex gap-4 mt-2 text-xs sm:text-sm">
                    <button
                      onClick={() => {
                        setAddressToEdit(address);
                        setOpenAddressModal(true);
                      }}
                      className="text-indigo-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setAddressToDelete(address);
                        setOpenDeleteModal(true);
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black/60 text-sm">No addresses added yet.</p>
          )}
        </div>
      </div>

      <AddAddressModal
        open={openAddressModal}
        onClose={handleCloseAddressModal}
        onAddressAdded={() => {
          fetchLatestUser();
          setAddressToEdit(null);
        }}
        mode={addressToEdit ? "edit" : "add"}
        initialData={addressToEdit}
      />
      <DeleteAddressModal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleDeleteAddress}
      />
    </>
  );
}
