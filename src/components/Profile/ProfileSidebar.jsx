"use client";

import { motion } from "framer-motion";
import { CloudHail } from "lucide-react";

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
  ];

  const tabs = isAdmin ? adminTabs : userTabs;


  return (
    <div className="w-64 shrink-0 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4">
      <h3 className="text-white text-lg font-semibold mb-4">
        {isAdmin ? "Admin Panel" : "My Account"}
      </h3>

      <div className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ x: 4 }}
            onClick={() => setActiveTab(tab.key)}
            className={`
              text-left px-4 py-2.5 rounded-xl text-sm transition
              ${
                activeTab === tab.key
                  ? "bg-white text-black font-medium"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }
            `}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
