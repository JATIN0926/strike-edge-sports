"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function MobileProfileSidebar({ activeTab, setActiveTab, isAdmin, mobile = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const userTabs = [
    { id: "profile", label: "Profile" },
    { id: "orders", label: "My Orders" },
    { id: "saved", label: "Saved Products" },
  ];

  const adminTabs = [
    { id: "profile", label: "Profile" },
    { id: "add-product", label: "Add Product" },
    { id: "products", label: "Products" },
    { id: "orders-received", label: "Orders Received" },
    { id: "categories", label: "Categories" },
    { id: "product-types", label: "Product Types" },
  ];

  const tabs = isAdmin ? adminTabs : userTabs;
  const activeTabLabel = tabs.find((t) => t.id === activeTab)?.label || "Select";

  // Desktop Sidebar (1280px+)
  if (!mobile) {
    return (
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-24 rounded-2xl bg-white/80 backdrop-blur-xl border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full text-left px-4 py-3 rounded-xl font-medium text-sm
                  transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30"
                      : "text-black/70 hover:bg-black/5 hover:text-black"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mobile Dropdown (<1280px)
  return (
    <div className="relative mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/80 backdrop-blur-xl border border-black/10 shadow-md text-left font-medium"
      >
        <span className="text-black/80 text-sm sm:text-base">{activeTabLabel}</span>
        <ChevronDown
          size={20}
          className={`text-black/60 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[5]"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white border border-black/10 shadow-xl z-10 overflow-hidden max-h-[60vh] overflow-y-auto"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-3 text-sm sm:text-base font-medium
                    transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-black/70 hover:bg-black/5"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}