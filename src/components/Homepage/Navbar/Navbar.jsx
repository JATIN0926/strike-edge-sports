"use client";

import AuthModal from "@/components/Auth/AuthModal";
import { auth, googleProvider } from "@/utils/firebase";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { initAuthListener } from "@/utils/authListener";

const navItems = [
  { label: "Home", type: "route", href: "/" },
  { label: "Shop", type: "route", href: "/products" },
  { label: "Category", type: "route", href: "/categories" }, // later
  { label: "Contact Us", type: "scroll", target: "contact" },
];

export default function Navbar() {
  const router = useRouter();

  const [openAuth, setOpenAuth] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    initAuthListener(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = () => setOpenProfileMenu(false);
    if (openProfileMenu) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
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
      setOpenAuth(false);
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed", { id: "google-auth" });
    }
  };
  const handleLogout = async () => {
    try {
      // 1️⃣ Logout from Firebase (CRITICAL)
      await auth.signOut();

      // 2️⃣ Clear backend session (JWT cookie)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      toast.success("Logged out successfully");
      setOpenProfileMenu(false);
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  const handleNavClick = (item) => {
    if (item.type === "route") {
      router.push(item.href);
    }

    if (item.type === "scroll") {
      const el = document.getElementById(item.target);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[5.5rem] flex items-center justify-between">
          {/* Left - Logo */}
          <Link href="/" className="text-white text-xl font-bold tracking-wide">
            StrikeEdgeSports
          </Link>

          {/* Middle - Glassmorphic Nav */}
          <div className="hidden md:flex">
            <div
              className="
                flex items-center gap-10 px-6 py-2.5 rounded-full
                bg-white/5 backdrop-blur-xl
                border border-white/15
                shadow-[0_0_30px_rgba(255,255,255,0.05)]
              "
            >
              {navItems.map((item) => (
                <motion.span
                  key={item.label}
                  whileHover={{ y: -2 }}
                  onClick={() => handleNavClick(item)}
                  className="
                    relative text-sm font-medium
                    text-white/80 hover:text-white
                    cursor-pointer transition
                    after:absolute after:left-0 after:-bottom-1
                    after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-green-400 after:to-emerald-500
                    hover:after:w-full after:transition-all after:duration-300
                  "
                >
                  {item.label}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right - Cart + Auth */}
          <div className="flex items-center gap-5">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <ShoppingCart size={20} />
            </motion.div>

            {currentUser ? (
              <div className="relative">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenProfileMenu((prev) => !prev);
                  }}
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="
      h-9 w-9 rounded-full
      object-cover cursor-pointer
      border border-white/20
    "
                />

                {/* Dropdown */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={
                    openProfileMenu
                      ? { opacity: 1, scale: 1, y: 0 }
                      : { opacity: 0, scale: 0.95, y: 10 }
                  }
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`
      absolute right-0 mt-3 w-40
      rounded-xl overflow-hidden
      bg-black/80 backdrop-blur-xl
      border border-white/15
      shadow-[0_20px_60px_rgba(0,0,0,0.8)]
      ${openProfileMenu ? "pointer-events-auto" : "pointer-events-none"}
    `}
                >
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setOpenProfileMenu(false);
                    }}
                    className=" cursor-pointer
        w-full px-4 py-2.5 text-left
        text-sm text-white/80 hover:text-white
        hover:bg-white/5 transition
      "
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className=" cursor-pointer
        w-full px-4 py-2.5 text-left
        text-sm text-red-400 hover:text-red-300
        hover:bg-white/5 transition
      "
                  >
                    Logout
                  </button>
                </motion.div>
              </div>
            ) : (
              <button
                onClick={() => setOpenAuth(true)}
                className="px-4 py-2 text-sm rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition cursor-pointer"
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>
      </motion.nav>
      <AuthModal
        open={openAuth}
        onClose={() => setOpenAuth(false)}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </>
  );
}
