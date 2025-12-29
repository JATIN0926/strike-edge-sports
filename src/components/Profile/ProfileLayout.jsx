"use client";

import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfo from "./ProfileInfo";
import { useSelector } from "react-redux";
import ManageCategories from "./admin/ManageCategories";
import AddProduct from "./admin/AddProduct";
import ProductsList from "./admin/Products_Tab/ProductsList";
import AdminOrdersReceived from "./admin/AdminOrdersReceived";
import MyOrders from "./user/Orders/MyOrders";
import SavedProducts from "./user/SavedProducts";
import ManageProductTypes from "./admin/ManageProductTypes";
import MobileProfileSidebar from "./MobileProfileSidebar";

export default function ProfileLayout() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const isAdmin = currentUser?.isAdmin;

  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    if (activeTab === "profile") return <ProfileInfo />;

    // user tabs
    if (!isAdmin) {
      if (activeTab === "orders") {
        return <MyOrders />;
      }
      if(activeTab === "saved"){
        return <SavedProducts />
      }
    }

    // admin tabs
    if (isAdmin) {
      if (activeTab === "add-product") return <AddProduct />;
      if (activeTab === "products") return <ProductsList />;
      if (activeTab === "orders-received") return <AdminOrdersReceived />;
      if (activeTab === "categories") return <ManageCategories />;
      if (activeTab === "product-types") return <ManageProductTypes />;
    }

    return null;
  };

  return (
    <div className="bg-[#f7f8fa] pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block">
          <ProfileSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAdmin={isAdmin}
          />
        </div>

        {/* Mobile Sidebar - Only on screens < 1280px */}
        <div className="lg:hidden">
          <MobileProfileSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isAdmin={isAdmin}
            mobile={true}
          />
        </div>

        {/* Right Content */}
        <div
          className="
            flex-1
            rounded-2xl
            bg-white/80 backdrop-blur-xl
            border border-black/10
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            p-4 sm:p-6
          "
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}