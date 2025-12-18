"use client";

import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfo from "./ProfileInfo";
import ComingSoon from "./ComingSoon";
import { useSelector } from "react-redux";

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
      return <ComingSoon />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-black pt-22">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex gap-6">
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={isAdmin}
        />

        <div className="flex-1 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
