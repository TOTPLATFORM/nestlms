"use client";

import Header from "@/section/admin/Header";
import Sidebar from "@/section/admin/Sidebar";
import React, { useState } from "react";

export default function Layout({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState<any>(false);

  return (
    <div>
      <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

      <div className="lg:pl-72">
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
