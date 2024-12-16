"use client";

import CartSection from "@/section/cart/CartSection";
import NavbarUi from "@/section/user/NavbarUi";
import InstructorHeader from "@/section/user/instructor/InstructorHeader";
import UserSidebar from "@/section/user/user-sidebar/UserSidebar";
import { WrapText } from "lucide-react";
import React, { useState } from "react";

export default function PanelLayout({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState<any>(false);
  const [openCart, setOpenCart] = useState<any>(false);

  return (
    <div>
      <InstructorHeader
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />

      <UserSidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

      <div className="lg:pl-72">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
