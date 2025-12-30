"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";
import AddAddressModal from "@/components/Profile/user/AddAddressModal";
import { Phone } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const currentUser = useSelector((state) => state.user.currentUser);
  const cartItems = useSelector((state) => state.cart.items);
  const cartArray = Object.values(cartItems);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const dispatch = useDispatch();

  useEffect(() => {
    // Only redirect to cart if cart is empty on initial load
    if (cartArray.length === 0 && !isPlacingOrder) {
      router.replace("/cart");
    }
  }, []);

  /* ---------------- Auto-select default address ---------------- */
  useEffect(() => {
    if (!currentUser?.addresses?.length) return;

    const defaultAddr =
      currentUser.addresses.find((a) => a.isDefault) ||
      currentUser.addresses[0];

    setSelectedAddressId(defaultAddr._id);
  }, [currentUser]);

  /* ---------------- Totals ---------------- */
  const subtotal = cartArray.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryCharge = 0;
  const total = subtotal + deliveryCharge;

  const addresses = currentUser?.addresses || [];

  const handlePlaceOrder = async () => {
    if (!addresses.length) {
      setOpenAddressModal(true);

      toast("Add a delivery address to place your order 🙂", {
        icon: "📦",
      });

      return;
    }

    if (!selectedAddressId) {
      toast("Please select a delivery address", {
        icon: "📍",
      });
      return;
    }

    setIsPlacingOrder(true);

    if (paymentMethod !== "cod") {
      setIsPlacingOrder(false);
      toast("Online payment coming soon 🚀");
      return;
    }

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

    const payload = {
      items: cartArray.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),

      shippingAddress: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        country: selectedAddress.country || "India",
      },

      paymentMethod: "COD",
      subtotal,
      deliveryCharge,
      totalAmount: total,
    };

    try {
      toast.loading("Placing your order...", { id: "place-order" });

      const res = await axios.post(`/api/orders`, payload, {
        withCredentials: true,
      });

      toast.success("Order placed successfully 🎉", { id: "place-order" });

      router.replace("/order-success");
      setTimeout(() => {
        dispatch(clearCart());
      }, 500);
    } catch (err) {
      setIsPlacingOrder(false);
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to place order", {
        id: "place-order",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-24 sm:pt-28 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-8 sm:space-y-10 lg:space-y-12">
          {/* ---------- Address Section ---------- */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-bold">
                Delivery Address
              </h2>

              <button
                onClick={() => {
                  setEditAddress(null);
                  setOpenAddressModal(true);
                }}
                className="
                  w-full sm:w-auto
                  px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium
                  bg-black text-white
                  hover:bg-emerald-600 transition
                "
              >
                + Add New Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur border text-center">
                <p className="text-sm sm:text-base text-black/60">
                  No address found. Please add one to continue.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-5">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr._id;

                  return (
                    <motion.div
                      key={addr._id}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`
                        relative cursor-pointer p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all
                        bg-white/70 backdrop-blur
                        ${
                          isSelected
                            ? "border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg bg-emerald-50/40"
                            : "border-black/10 hover:shadow-md"
                        }
                      `}
                    >
                      {isSelected && (
                        <span
                          className="
                            absolute top-2.5 right-2.5 sm:top-3 sm:right-3
                            text-[10px] sm:text-xs font-semibold
                            px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full
                            bg-emerald-600 text-white
                            shadow-md
                          "
                        >
                          Selected
                        </span>
                      )}

                      <div className="flex justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base text-black truncate pr-16 sm:pr-0">
                            {addr.fullName}
                          </p>

                          <p className="text-xs sm:text-sm text-black/60 mt-1 leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} –{" "}
                            {addr.pincode}
                          </p>

                          <p className="mt-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-black/70">
                            <Phone
                              size={12}
                              className="sm:w-[14px] sm:h-[14px] text-emerald-500"
                            />
                            {addr.phone}
                          </p>

                          {addr.isDefault && (
                            <span
                              className="
                                inline-block mt-2
                                text-[10px] sm:text-xs font-medium
                                px-2 sm:px-2.5 py-0.5 rounded-full
                                bg-black/5 text-black/60
                                border border-black/10
                              "
                            >
                              Default Address
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditAddress(addr);
                            setOpenAddressModal(true);
                          }}
                          className="
                            hidden sm:block
                            text-xs sm:text-sm font-medium
                            text-emerald-600
                            hover:underline
                            flex-shrink-0
                          "
                        >
                          Edit
                        </button>
                      </div>

                      {/* Mobile Edit Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditAddress(addr);
                          setOpenAddressModal(true);
                        }}
                        className="
                          sm:hidden
                          mt-3 w-full
                          text-xs font-medium
                          text-emerald-600
                          py-2 rounded-lg
                          bg-emerald-50 hover:bg-emerald-100
                          transition-colors
                        "
                      >
                        Edit Address
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ---------- Order Summary ---------- */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {cartArray.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur border"
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg sm:rounded-xl overflow-hidden border flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-xs sm:text-sm text-black/60 mt-0.5 sm:mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium text-sm sm:text-base whitespace-nowrap">
                    ₹{item.price * item.quantity}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            lg:sticky lg:top-28 h-fit
            p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl
            bg-white/70 backdrop-blur
            border space-y-3 sm:space-y-4
          "
        >
          <h3 className="text-lg sm:text-xl font-bold">Price Details</h3>

          <div className="flex justify-between text-xs sm:text-sm">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-xs sm:text-sm">
            <span>Delivery</span>
            <span>₹{deliveryCharge}</span>
          </div>

          <hr />

          <div className="flex justify-between text-base sm:text-lg font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {/* ---------- PAYMENT METHOD ---------- */}
          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold">Payment Method</h4>

            {/* COD */}
            <label
              className={`
                flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer border transition
                ${
                  paymentMethod === "cod"
                    ? "border-emerald-500 bg-emerald-50/60"
                    : "border-black/10 bg-white/50 hover:border-black/20"
                }
              `}
            >
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="accent-emerald-600 mt-0.5 sm:mt-0 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium">
                  Cash on Delivery
                </p>
                <p className="text-[10px] sm:text-xs text-black/60 mt-0.5">
                  Pay when the product is delivered
                </p>
              </div>
              <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap flex-shrink-0">
                Recommended
              </span>
            </label>

            {/* ONLINE */}
            <label
              className={`
                flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer border transition
                ${
                  paymentMethod === "online"
                    ? "border-emerald-500 bg-emerald-50/60"
                    : "border-black/10 bg-white/50 hover:border-black/20"
                }
              `}
            >
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
                className="accent-emerald-600 mt-0.5 sm:mt-0 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium">Online Payment</p>
                <p className="text-[10px] sm:text-xs text-black/60 mt-0.5">
                  UPI, Cards, Netbanking
                </p>
              </div>
              <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-black/5 text-black/60 whitespace-nowrap flex-shrink-0">
                Coming Soon
              </span>
            </label>
          </div>

          {/* ---------- CTA ---------- */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePlaceOrder}
            className={`
              cursor-pointer
              w-full mt-4 sm:mt-6 py-2.5 sm:py-3 rounded-full font-medium text-xs sm:text-sm transition
              ${
                addresses.length === 0
                  ? "bg-black/60 text-white"
                  : !selectedAddressId
                  ? "bg-black/70 text-white"
                  : "bg-black text-white hover:bg-emerald-600"
              }
            `}
          >
            {paymentMethod === "cod"
              ? "Place Order (COD)"
              : "Proceed to Payment"}
          </motion.button>

          <p className="text-[10px] sm:text-xs text-black/60 text-center">
            You'll receive SMS updates for delivery.
          </p>
        </motion.div>
      </div>

      {/* ---------- Address Modal ---------- */}
      <AddAddressModal
        open={openAddressModal}
        onClose={() => setOpenAddressModal(false)}
        mode={editAddress ? "edit" : "add"}
        initialData={editAddress}
        onAddressAdded={() => setEditAddress(null)}
      />
    </div>
  );
}
