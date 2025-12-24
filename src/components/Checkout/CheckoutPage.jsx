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
    if (cartArray.length === 0) {
      router.replace("/cart");
    }
  }, [cartArray, router]);

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
    if (!selectedAddressId) {
      toast.error("Please select delivery address");
      return;
    }

    if (paymentMethod !== "cod") {
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

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        payload,
        { withCredentials: true }
      );

      toast.success("Order placed successfully 🎉", {
        id: "place-order",
      });

      dispatch(clearCart());
      router.push("/order-success");
    } catch (err) {
      setIsPlacingOrder(false);
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to place order", {
        id: "place-order",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-12">
          {/* ---------- Address Section ---------- */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">Delivery Address</h2>

              <button
                onClick={() => {
                  setEditAddress(null);
                  setOpenAddressModal(true);
                }}
                className="
                  px-5 py-2 rounded-full text-sm font-medium
                  bg-black text-white
                  hover:bg-emerald-600 transition
                "
              >
                + Add New Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/70 backdrop-blur border text-center">
                <p className="text-black/60">
                  No address found. Please add one to continue.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr._id;

                  return (
                    <motion.div
                      key={addr._id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`
                        relative cursor-pointer p-5 rounded-2xl border transition-all
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
                            absolute top-3 right-3
                            text-xs font-semibold
                            px-2.5 py-1 rounded-full
                            bg-emerald-600 text-white
                            shadow-md
                          "
                        >
                          Selected
                        </span>
                      )}

                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-semibold text-black">
                            {addr.fullName}
                          </p>

                          <p className="text-sm text-black/60 mt-1 leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} –{" "}
                            {addr.pincode}
                          </p>

                          <p className="mt-2 flex items-center gap-2 text-sm text-black/70">
                            <Phone size={14} className="text-emerald-500" />
                            {addr.phone}
                          </p>

                          {addr.isDefault && (
                            <span
                              className="
                                inline-block mt-2
                                text-xs font-medium
                                px-2.5 py-0.5 rounded-full
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
                            text-sm font-medium
                            text-emerald-600
                            hover:underline
                          "
                        >
                          Edit
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ---------- Order Summary ---------- */}
          <div>
            <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

            <div className="space-y-4">
              {cartArray.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur border"
                >
                  <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden border">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-black/60">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium">₹ {item.price * item.quantity}</p>
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
            sticky top-28 h-fit
            p-6 rounded-2xl
            bg-white/70 backdrop-blur
            border space-y-4
          "
        >
          <h3 className="text-xl font-bold">Price Details</h3>

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>₹ {deliveryCharge}</span>
          </div>

          <hr />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>

          {/* ---------- PAYMENT METHOD ---------- */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-semibold">Payment Method</h4>

            {/* COD */}
            <label
              className={`
                flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition
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
                className="accent-emerald-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Cash on Delivery</p>
                <p className="text-xs text-black/60">
                  Pay when the product is delivered
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Recommended
              </span>
            </label>

            {/* ONLINE */}
            <label
              className={`
                flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition
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
                className="accent-emerald-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Online Payment</p>
                <p className="text-xs text-black/60">UPI, Cards, Netbanking</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 text-black/60">
                Coming Soon
              </span>
            </label>
          </div>

          {/* ---------- CTA ---------- */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePlaceOrder}
            className={`cursor-pointer
    w-full mt-6 py-3 rounded-full font-medium transition
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
              ? "Place Order (Cash on Delivery)"
              : "Proceed to Online Payment"}
          </motion.button>

          <p className="text-xs text-black/60 text-center">
            You’ll receive SMS updates for delivery.
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
