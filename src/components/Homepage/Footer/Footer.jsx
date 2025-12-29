"use client";

import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  MessageCircle,
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";
import Link from "next/link";
import GoToTop from "./GoToTop";

export default function Footer() {
  return (
    <>
      <footer
        id="contact"
        className="mt-24 bg-gradient-to-b from-white to-slate-50/50 border-t border-black/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Top section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {/* Left - Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center sm:text-left sm:col-span-2 md:col-span-1"
            >
              <h2 className="text-black text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                StrikeEdgeSports
              </h2>
              <p className="text-black/70 mt-3 text-sm sm:text-base leading-relaxed max-w-xs mx-auto sm:mx-0">
                Premium cricket gear for every level of player. Quality
                equipment that elevates your game.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-6 justify-center sm:justify-start">
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.instagram.com/strikedgesports?igsh=MTE3aW5iZjd3cWU3Yw=="
                  target="_blank"
                  className="cursor-pointer p-2 rounded-full bg-black/5 hover:bg-emerald-100 text-black/60 hover:text-emerald-600 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram size={18} strokeWidth={2} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.facebook.com/share/14RWgPADDEk/"
                  target="_blank"
                  className="cursor-pointer p-2 rounded-full bg-black/5 hover:bg-emerald-100 text-black/60 hover:text-emerald-600 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <Facebook size={18} strokeWidth={2} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:strikedgesports10@gmail.com"
                  className="cursor-pointer p-2 rounded-full bg-black/5 hover:bg-emerald-100 text-black/60 hover:text-emerald-600 transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail size={18} strokeWidth={2} />
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center sm:items-start gap-4"
            >
              <h3 className="text-black font-bold text-base sm:text-lg">Quick Links</h3>
              
              <div className="flex flex-col gap-3">
                <Link href="/about">
                  <motion.span
                    whileHover={{ x: 3 }}
                    className="cursor-pointer text-sm sm:text-base text-black/70 hover:text-emerald-600 transition-colors inline-block font-medium"
                  >
                    About Us
                  </motion.span>
                </Link>
                
                <Link href="/policies">
                  <motion.span
                    whileHover={{ x: 3 }}
                    className="cursor-pointer text-sm sm:text-base text-black/70 hover:text-emerald-600 transition-colors inline-block font-medium"
                  >
                    Policies
                  </motion.span>
                </Link>
                
                <Link href="/products">
                  <motion.span
                    whileHover={{ x: 3 }}
                    className="cursor-pointer text-sm sm:text-base text-black/70 hover:text-emerald-600 transition-colors inline-block font-medium"
                  >
                    Shop Now
                  </motion.span>
                </Link>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center sm:items-start gap-4"
            >
              <h3 className="text-black font-bold text-base sm:text-lg">Get In Touch</h3>

              <motion.a
                whileHover={{ x: 3 }}
                href="tel:+918923765865"
                className="cursor-pointer flex items-center gap-2.5 text-black/70 text-sm sm:text-base hover:text-emerald-600 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                  <Phone size={16} strokeWidth={2.5} />
                </div>
                <span className="font-semibold">Call Us</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/918923765865"
                target="_blank"
                className="
                  cursor-pointer
                  inline-flex items-center gap-2.5
                  px-5 py-2.5 rounded-xl
                  bg-gradient-to-r from-emerald-500 to-green-600
                  text-white
                  text-sm font-semibold
                  shadow-lg shadow-emerald-500/25
                  hover:shadow-xl hover:shadow-emerald-500/35
                  transition-all duration-300
                "
              >
                <MessageCircle size={18} strokeWidth={2.5} />
                WhatsApp Us
              </motion.a>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center sm:items-start w-full"
            >
              <h3 className="text-black font-bold text-base sm:text-lg mb-4">Visit Us</h3>
              <div className="flex items-start gap-3 text-black/70 text-sm sm:text-base leading-relaxed text-center sm:text-left">
                <div className="p-2 rounded-lg bg-emerald-50 mt-0.5 flex-shrink-0">
                  <MapPin
                    size={16}
                    strokeWidth={2.5}
                    className="text-emerald-600"
                  />
                </div>
                <p className="max-w-xs">
                  Gali no 1, Sector 1, Hari Nagar, Shardhapuri, Kankarkhera,
                  Meerut, Uttar Pradesh, India
                </p>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

          {/* Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center text-black/50 text-sm"
          >
            <p>
              © {new Date().getFullYear()} StrikeEdgeSports. All rights
              reserved.
            </p>
            <p className="mt-1 text-xs">Made with ❤️ for cricket lovers</p>
          </motion.div>
        </div>
      </footer>

      <GoToTop />
    </>
  );
}