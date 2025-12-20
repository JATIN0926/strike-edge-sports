"use client";

import { motion } from "framer-motion";

export default function ProfileSidebar({ activeTab, setActiveTab, isAdmin }) {
  const userTabs = [
    { key: "profile", label: "Profile Info" },
    { key: "orders", label: "My Orders" },
    { key: "saved", label: "Saved Products" },
  ];

  const adminTabs = [
    { key: "profile", label: "Profile Info" },
    { key: "orders-received", label: "Orders Received" },
    { key: "products", label: "Products" },
    { key: "add-product", label: "Add Product" },
    {
      key: "categories",
      label: "Manage Categories",
    },
  ];

  const tabs = isAdmin ? adminTabs : userTabs;

  return (
    <div
      className="
        w-64 shrink-0
        rounded-2xl
        bg-white/70 backdrop-blur-xl
        border border-black/10
        shadow-[0_8px_24px_rgba(0,0,0,0.06)]
        p-4
      "
    >
      <h3 className="text-black text-lg font-semibold mb-4">
        {isAdmin ? "Admin Panel" : "My Account"}
      </h3>

      <div className="flex flex-col gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <motion.button
              key={tab.key}
              whileHover={{ x: 4 }}
              onClick={() => setActiveTab(tab.key)}
              className={`
                text-left px-4 py-2.5 rounded-xl text-sm transition
                ${
                  isActive
                    ? `
                      bg-gradient-to-r from-indigo-500 to-blue-500
                      text-white font-medium
                      shadow-[0_6px_18px_rgba(99,102,241,0.35)]
                    `
                    : `
                      text-black/70
                      hover:text-black
                      hover:bg-black/5
                    `
                }
              `}
            >
              {tab.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
