import React, { Fragment, useState } from "react";

import PerfectScrollbar from "react-perfect-scrollbar";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function InnerSidebar({
  setSidebarOpen,
  sidebarOpen,
  children,
}: any) {
  return (
    <>
      <div
        className={`panel absolute z-10 hidden h-screen w-[280px] max-w-full flex-none space-y-4 overflow-y-auto p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md ${
          sidebarOpen && "!block"
        }`}
      >
        <div className="flex h-full flex-col pb-16 text-sm">
          <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
            <div className="rounded-sm border">{children}</div>
          </PerfectScrollbar>
        </div>
      </div>
      <div
        className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${
          sidebarOpen && "!block xl:!hidden"
        }`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      ></div>
    </>
  );
}
