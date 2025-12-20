"use client";

import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfo from "./ProfileInfo";
import ComingSoon from "./ComingSoon";
import { useSelector } from "react-redux";
import ManageCategories from "./admin/ManageCategories";
import AddProduct from "./admin/AddProduct";
import ProductsList from "./admin/Products_Tab/ProductsList";

export default function ProfileLayout() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const isAdmin = currentUser?.isAdmin;

  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    if (activeTab === "profile") return <ProfileInfo />;

    // user tabs
    if (!isAdmin && (activeTab === "orders" || activeTab === "saved")) {
      return <ComingSoon />;
    }

    // admin tabs
    if (isAdmin) {
      if (activeTab === "categories") return <ManageCategories />;
      if (activeTab === "add-product") return <AddProduct />;
      if (activeTab === "products") return <ProductsList />;
      return <ComingSoon />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-22">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex gap-6">
        {/* Sidebar */}
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={isAdmin}
        />

        {/* Right Content */}
        <div
          className="
            flex-1
            rounded-2xl
            bg-white/80 backdrop-blur-xl
            border border-black/10
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            p-6
          "
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
