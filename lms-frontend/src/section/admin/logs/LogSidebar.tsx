"use client";
import React, { Fragment, useState } from "react";
import InnerSidebar from "../InnerSidebar";
import Swal from "sweetalert2";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { useDeleteLogItem } from "@/hooks/admin/logs.hook";

export default function LogSidebar({
  setSidebarOpen,
  sidebarOpen,
  allLogLists,
  setFileName,
  fileName,
}: any) {
  const { handleDeleteLog } = useDeleteLogItem();

  const handleLogItem = (item: any) => {
    setFileName(item);
  };
  const logDeleteHandler = (item: any) => {
    Swal.fire({
      title: "Do you want to Delete?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteLog(item);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  return (
    <>
      <InnerSidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}>
        {allLogLists?.map((item: any, index: number) => (
          <button
            className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between border p-2 font-medium dark:hover:bg-[#181F32] ${
              fileName == item
                ? "text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]"
                : ""
            }`}
            key={index}
            onClick={() => handleLogItem(item)}
          >
            <div className="flex w-full items-center justify-between">
              <div className="ltr:ml-3 rtl:mr-3">{item}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>

                    <BsThreeDots />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => logDeleteHandler(item)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </button>
        ))}
      </InnerSidebar>
    </>
  );
}
