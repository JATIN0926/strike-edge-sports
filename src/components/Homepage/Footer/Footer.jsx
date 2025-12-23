"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import GoToTop from "./GoToTop";

export default function Footer() {
  return (
    <>
      <footer
        id="contact"
        className="mt-24 bg-slate-50 border-t border-black/10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            {/* Left - Brand */}
            <div>
              <h2 className="text-black text-2xl font-bold tracking-wide">
                StrikeEdgeSports
              </h2>
              <p className="text-black/60 mt-2 text-sm max-w-xs">
                Premium cricket gear for every level of player.
              </p>
            </div>

            {/* Middle - Contact */}
            <div className="flex flex-col items-start gap-3">
              <h3 className="text-black font-semibold">Contact Us</h3>

              <div className="flex items-center gap-2 text-black/70 text-sm">
                <motion.a
                  whileHover={{ x: 2 }}
                  href="tel:+918923765865"
                  className="flex items-center gap-2 text-black/70 text-sm hover:text-black transition"
                >
                  <Phone size={16} />
                  Call Us
                </motion.a>
              </div>

              <motion.a
                whileHover={{ scale: 1.05 }}
                href="https://wa.me/918923765865"
                target="_blank"
                className="
                  mt-2 inline-flex items-center gap-2
                  px-4 py-2 rounded-full
                  bg-emerald-600 text-white
                  text-sm font-medium
                  hover:bg-emerald-700 transition
                "
              >
                <MessageCircle size={18} />
                WhatsApp Us
              </motion.a>
            </div>

            {/* Right - Address */}
            <div>
              <h3 className="text-black font-semibold">Address</h3>
              <div className="flex items-start gap-2 text-black/60 text-sm mt-2">
                <MapPin size={16} className="mt-1" />
                <p className="max-w-xs">
                  Gali no 1, sector 1 , hari nagar, shardhapuri, kankarkhera,
                  Meerut,Uttar Pradesh , India
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px bg-black/10" />

          {/* Bottom */}
          <div className="text-center text-black/50 text-sm">
            © {new Date().getFullYear()} StrikeEdgeSports. All rights reserved.
          </div>
        </div>
      </footer>

      <GoToTop />
    </>
  );
}
