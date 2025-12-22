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
import { useDispatch, useSelector } from "react-redux";
import { initAuthListener } from "@/utils/authListener";

const navItems = [
  { label: "Home", type: "route", href: "/" },
  { label: "Shop", type: "route", href: "/products" },
  { label: "Category", type: "route", href: "/categories" },
  { label: "Contact Us", type: "scroll", target: "contact" },
];

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const cartItems = useSelector((state) => state.cart.items);

  const cartCount = Object.keys(cartItems).length;

  const [openAuth, setOpenAuth] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  useEffect(() => {
    initAuthListener(dispatch);
  }, [dispatch]);

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



  return (
    // <>
    //   <motion.nav
    //     initial={{ y: -20, opacity: 0 }}
    //     animate={{ y: 0, opacity: 1 }}
    //     className="
    //       fixed top-0 left-0 w-full z-50
    //       bg-white/70 backdrop-blur-xl
    //       border-b border-black/10
    //     "
    //   >
    //     <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
    //       {/* Logo */}
    //       <Link href="/" className="text-xl font-bold">
    //         StrikeEdgeSports
    //       </Link>

    //       {/* Right */}
    //       <div className="flex items-center gap-5">
    //         {/* CART */}
    //         <motion.div
    //           whileHover={{ scale: 1.1 }}
    //           onClick={() => router.push("/cart")}
    //           className="relative cursor-pointer"
    //         >
    //           <ShoppingCart size={22} />

    //           {cartCount > 0 && (
    //             <span
    //               className="
    //                 absolute -top-2 -right-2
    //                 h-5 min-w-[20px]
    //                 rounded-full
    //                 bg-emerald-500
    //                 text-white text-xs
    //                 flex items-center justify-center
    //                 px-1
    //               "
    //             >
    //               {cartCount}
    //             </span>
    //           )}
    //         </motion.div>

    //         {currentUser ? (
    //           <div className="relative">
    //             <motion.img
    //               whileHover={{ scale: 1.05 }}
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 setOpenProfileMenu((prev) => !prev);
    //               }}
    //               src={currentUser.photoURL}
    //               alt="Profile"
    //               className="
    //                 h-9 w-9 rounded-full object-cover cursor-pointer
    //                 border border-black/20
    //               "
    //             />

    //             {/* Dropdown */}
    //             <motion.div
    //               initial={{ opacity: 0, scale: 0.95, y: 10 }}
    //               animate={
    //                 openProfileMenu
    //                   ? { opacity: 1, scale: 1, y: 0 }
    //                   : { opacity: 0, scale: 0.95, y: 10 }
    //               }
    //               transition={{ duration: 0.15 }}
    //               className={`
    //                 absolute right-0 mt-3 w-40 rounded-xl overflow-hidden
    //                 bg-white/80 backdrop-blur-xl
    //                 border border-black/10
    //                 shadow-xl shadow-black/10
    //                 ${
    //                   openProfileMenu
    //                     ? "pointer-events-auto"
    //                     : "pointer-events-none"
    //                 }
    //               `}
    //             >
    //               <button
    //                 onClick={() => {
    //                   router.push("/profile");
    //                   setOpenProfileMenu(false);
    //                 }}
    //                 className="w-full px-4 py-2.5 text-left text-sm text-black/70 hover:bg-black/5"
    //               >
    //                 Profile
    //               </button>

    //               <button
    //                 onClick={handleLogout}
    //                 className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-black/5"
    //               >
    //                 Logout
    //               </button>
    //             </motion.div>
    //           </div>
    //         ) : (
    //           <button
    //             onClick={() => setOpenAuth(true)}
    //             className=" cursor-pointer
    //               px-4 py-2 text-sm rounded-full
    //               bg-emerald-600 text-white
    //               hover:bg-emerald-700 transition
    //             "
    //           >
    //             Login / Signup
    //           </button>
    //         )}
    //       </div>
    //     </div>
    //   </motion.nav>

    //   <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    // </>



    <>
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        fixed top-0 left-0 w-full z-50
        bg-white/70 backdrop-blur-xl
        border-b border-black/10
      "
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-black text-xl font-bold tracking-wide">
          StrikeEdgeSports
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex">
          <div
            className="
              flex items-center gap-10 px-6 py-2.5 rounded-full
              bg-white/60 backdrop-blur-xl
              border border-black/10
              shadow-lg shadow-black/5
            "
          >
            {navItems.map((item) => (
              <motion.span
                key={item.label}
                whileHover={{ y: -2 }}
                onClick={() => handleNavClick(item)}
                className="
                  relative text-sm font-medium
                  text-black/70 hover:text-black
                  cursor-pointer transition
                  after:absolute after:left-0 after:-bottom-1
                  after:h-[2px] after:w-0
                  after:bg-gradient-to-r after:from-emerald-500 after:to-green-400
                  hover:after:w-full after:transition-all after:duration-300
                "
              >
                {item.label}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right */}
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
                    absolute -top-2 -right-2
                    h-5 min-w-[20px]
                    rounded-full
                    bg-emerald-500
                    text-white text-xs
                    flex items-center justify-center
                    px-1
                  "
                >
                  {cartCount}
                </span>
              )}
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
                  h-9 w-9 rounded-full object-cover cursor-pointer
                  border border-black/20
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
                transition={{ duration: 0.15 }}
                className={`
                  absolute right-0 mt-3 w-40 rounded-xl overflow-hidden
                  bg-white/80 backdrop-blur-xl
                  border border-black/10
                  shadow-xl shadow-black/10
                  ${openProfileMenu ? "pointer-events-auto" : "pointer-events-none"}
                `}
              >
                <button
                  onClick={() => {
                    router.push("/profile");
                    setOpenProfileMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-black/70 hover:bg-black/5"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-black/5"
                >
                  Logout
                </button>
              </motion.div>
            </div>
          ) : (
            <button
              onClick={() => setOpenAuth(true)}
              className=" cursor-pointer
                px-4 py-2 text-sm rounded-full
                bg-emerald-600 text-white
                hover:bg-emerald-700 transition
              "
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
