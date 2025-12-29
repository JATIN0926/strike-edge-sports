"use client";

import AuthModal from "@/components/Auth/AuthModal";
import { auth, googleProvider } from "@/utils/firebase";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { initAuthListener } from "@/utils/authListener";
import { setCurrentUser, setShowAuthModal } from "@/redux/slices/userSlice";
import CategoryDropdown from "./CategoryDropdown";

const navItems = [
  { label: "Home", type: "route", href: "/" },
  { label: "Shop", type: "route", href: "/products" },
  { label: "Contact Us", type: "scroll", target: "contact" },
];

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const profileMenuRef = useRef(null);

  const currentUser = useSelector((state) => state.user.currentUser);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = Object.keys(cartItems).length;
  const showAuthModal = useSelector((state) => state.user.showAuthModal);

  const openAuth = showAuthModal;

  const handleOpenAuth = () => dispatch(setShowAuthModal(true));
  const handleCloseAuth = () => dispatch(setShowAuthModal(false));

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileCategories, setMobileCategories] = useState(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    initAuthListener(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );
        setCategories(res.data.categories || []);
      } catch {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setOpenProfileMenu(false);
      }
    };

    if (openProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfileMenu]);

  const handleGoogleSignIn = async () => {
    try {
      toast.loading("Signing you in...", { id: "google-auth" });

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          token,
        },
        { withCredentials: true }
      );

      toast.success("Logged in successfully 🎉", { id: "google-auth" });

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        { withCredentials: true }
      );

      dispatch(setCurrentUser(res.data.user));

      handleCloseAuth();
    } catch {
      toast.error("Google sign-in failed", { id: "google-auth" });
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully");
      setOpenProfileMenu(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleNavClick = (item) => {
    if (item.type === "route") router.push(item.href);
    if (item.type === "scroll")
      document.getElementById(item.target)?.scrollIntoView({
        behavior: "smooth",
      });
    setMobileMenu(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-black/10"
      >
        <div
          className="
            max-w-7xl mx-auto px-4 md:px-8 h-20
            flex items-center justify-between
          "
        >
          {/* LOGO */}
          <Link
            href="/"
            className="
              text-black font-bold tracking-wide
              text-lg md:text-xl lg:text-xl
            "
          >
            StrikeEdgeSports
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex">
            <div
              className="
                flex items-center gap-6 lg:gap-10
                px-5 lg:px-6 py-2.5 rounded-full
                bg-white/60 border border-black/10
                shadow-lg shadow-black/5
                text-sm lg:text-sm
              "
            >
              {navItems.map((item) => (
                <motion.span
                  key={item.label}
                  whileHover={{ y: -2 }}
                  onClick={() => handleNavClick(item)}
                  className="
                    cursor-pointer text-black/70 hover:text-black font-medium
                    relative after:absolute after:left-0 after:-bottom-1
                    after:h-[2px] after:w-0 after:bg-gradient-to-r
                    after:from-emerald-500 after:to-green-400
                    hover:after:w-full after:transition-all
                  "
                >
                  {item.label}
                </motion.span>
              ))}

              {/* CATEGORY */}
              <div
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <motion.span
                  whileHover={{ y: -2 }}
                  className="
                    cursor-pointer text-black/70 hover:text-black font-medium
                    relative after:absolute after:left-0 after:-bottom-1
                    after:h-[2px] after:w-0 after:bg-gradient-to-r
                    after:from-emerald-500 after:to-green-400
                    hover:after:w-full
                  "
                >
                  Category
                </motion.span>

                <CategoryDropdown
                  open={showCategories}
                  categories={categories}
                  onClose={() => setShowCategories(false)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">
            {/* CART */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => router.push("/cart")}
              className="relative cursor-pointer"
            >
              <ShoppingCart size={22} />

              {cartCount > 0 && (
                <span
                  className="
                    absolute -top-2 -right-2 bg-emerald-500 text-white
                    rounded-full text-xs px-1 min-w-[20px] h-5
                    flex items-center justify-center
                  "
                >
                  {cartCount}
                </span>
              )}
            </motion.div>

            {/* PROFILE */}
            {currentUser ? (
              <div className="relative hidden sm:block" ref={profileMenuRef}>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setOpenProfileMenu((p) => !p)}
                  src={currentUser.photoURL}
                  className="h-9 w-9 rounded-full border border-black/20 cursor-pointer"
                />

                <AnimatePresence>
                  {openProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="
                        absolute right-0 mt-3 w-40 rounded-xl
                        bg-white/90 backdrop-blur-xl
                        border border-black/10 shadow-xl
                      "
                    >
                      <button
                        onClick={() => router.push("/profile")}
                        className="cursor-pointer w-full px-4 py-2.5 text-left text-sm hover:bg-black/5"
                      >
                        Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="cursor-pointer w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-black/5"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleOpenAuth}
                className="
                  cursor-pointer
                  hidden sm:block px-4 py-2 text-sm rounded-full
                  bg-emerald-600 text-white hover:bg-emerald-700
                "
              >
                Login / Signup
              </button>
            )}

            {/* HAMBURGER ( <800px ) */}
            <button
              className="md:hidden cursor-pointer"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ---------------- MOBILE MENU ---------------- */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className="
                fixed top-0 left-0 right-0 z-[70]
                bg-white/95 backdrop-blur-xl
                border-b border-black/10
                shadow-2xl shadow-black/10
                max-h-[85vh] overflow-y-auto
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
                <h2 className="text-xl font-bold text-black">Menu</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenu(false)}
                  className="
                    cursor-pointer
                    h-10 w-10 rounded-full
                    bg-black/5 hover:bg-black/10
                    flex items-center justify-center
                    transition-colors
                  "
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Menu Content */}
              <div className="px-6 py-6 space-y-2">
                {/* Nav Items */}
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavClick(item)}
                    className="
                      cursor-pointer
                      w-full text-left px-4 py-3 rounded-xl
                      text-base font-semibold text-black/80
                      hover:bg-emerald-50 hover:text-emerald-600
                      transition-all duration-200
                      border border-transparent hover:border-emerald-200
                    "
                  >
                    {item.label}
                  </motion.button>
                ))}

                {/* Category Accordion */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="border border-black/10 rounded-xl overflow-hidden bg-white/50"
                >
                  <button
                    onClick={() => setMobileCategories((p) => !p)}
                    className="
                      cursor-pointer
                      w-full flex items-center justify-between
                      px-4 py-3 text-base font-semibold text-black/80
                      hover:bg-black/5 transition-colors
                    "
                  >
                    <span>Category</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        mobileCategories ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileCategories && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-black/10"
                      >
                        <div className="px-4 py-3 space-y-2">
                          {categories.map((c, idx) => (
                            <motion.button
                              key={c._id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              onClick={() => {
                                router.push(`/products?category=${c.slug}`);
                                setMobileMenu(false);
                              }}
                              className="
                                cursor-pointer
                                w-full text-left px-3 py-2 rounded-lg
                                text-sm text-black/70 hover:text-emerald-600
                                hover:bg-emerald-50
                                transition-all duration-200
                              "
                            >
                              {c.name}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* User Actions - Mobile Only */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.05 }}
                  className="pt-4 space-y-3 border-t border-black/10 mt-4"
                >
                  {currentUser ? (
                    <>
                      <button
                        onClick={() => {
                          router.push("/profile");
                          setMobileMenu(false);
                        }}
                        className="
                          cursor-pointer
                          w-full flex items-center gap-3
                          px-4 py-3 rounded-xl
                          bg-emerald-50 border border-emerald-200
                          text-base font-semibold text-emerald-600
                          hover:bg-emerald-100
                          transition-all duration-200
                        "
                      >
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="h-8 w-8 rounded-full border border-emerald-300"
                        />
                        <span>View Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenu(false);
                        }}
                        className="
                          cursor-pointer
                          w-full px-4 py-3 rounded-xl
                          text-base font-semibold text-red-600
                          hover:bg-red-50 border border-red-200
                          transition-all duration-200
                        "
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        handleOpenAuth();
                        setMobileMenu(false);
                      }}
                      className="
                        cursor-pointer
                        w-full px-4 py-3 rounded-xl
                        bg-gradient-to-r from-emerald-600 to-emerald-500
                        text-white font-semibold text-base
                        shadow-lg shadow-emerald-500/30
                        hover:shadow-xl hover:shadow-emerald-500/40
                        transition-all duration-300
                      "
                    >
                      Login / Signup
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal
        open={openAuth}
        onClose={handleCloseAuth}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </>
  );
}
