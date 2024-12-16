"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { RiArrowUpDownFill } from "react-icons/ri";

import LogSidebar from "@/section/admin/logs/LogSidebar";
import { useGetLogLists, useGetLogs } from "@/hooks/admin/logs.hook";
import TextAccordion from "@/components/text-accordion/TextAccordion";
import NoItem from "@/components/NoItem";
import { Skeleton } from "@/components/ui/skeleton";

const columns: ColumnDef<any>[] = [
  {
    header: "Level",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.original.level}</div>
    ),
  },
  {
    accessorKey: "context",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-x-1"
        >
          Context
          {column.getIsSorted() === "desc" ? (
            <IoMdArrowDown className="ml-2" />
          ) : column.getIsSorted() === "asc" ? (
            <IoMdArrowUp className="ml-2" />
          ) : (
            <RiArrowUpDownFill className="ml-2" />
          )}
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.original.context}</div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <TextAccordion text={row.original.message} />,
  },
  {
    header: "Created At",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.original.timestamp}</div>
    ),
  },
];

export default function Logs() {
  const [sidebarOpen, setSidebarOpen] = useState<any>(false);
  const { data: allLogLists, isLoading: logListsLoading } = useGetLogLists();

  const {
    data: allLogs,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    fileName,
    limit,
    page,
    setFileName,
  } = useGetLogs();

  useEffect(() => {
    if (!allLogLists?.data || allLogLists?.data?.length === 0) {
      return;
    }

    setFileName(allLogLists?.data[0]);
  }, [allLogLists?.data]);

  if (logListsLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="hidden rounded-sm border md:block">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((number: any) => (
            <Skeleton className="mb-4 h-[30px] w-full last:mb-0" key={number} />
          ))}
        </div>
        <div className="col-span-2 rounded-sm border">
          {[1, 2, 3, 4, 5, 6].map((number: any) => (
            <Skeleton className="mb-4 h-[60px] w-full last:mb-0" key={number} />
          ))}
        </div>
      </div>
    );
  }
  if (!allLogLists?.data || allLogLists?.data?.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh_-_150px)] gap-x-4">
        <NoItem notFoundtext={`No Log Found`} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh_-_150px)] gap-x-4">
      <LogSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        allLogLists={allLogLists?.data}
        setFileName={setFileName}
        fileName={fileName}
      />
      <div className="flex-1 overflow-auto custom-shadow">
        <div className="panel h-full  flex-1 ">
          <div className="flex h-full flex-col">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center xl:!hidden">
              <div className="flex items-center ltr:mr-3 rtl:ml-3">
                <button
                  type="button"
                  className="hover:text-primary block ltr:mr-3 rtl:ml-3 xl:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 7L4 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      opacity="0.5"
                      d="M20 12L4 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 17L4 17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <DataTable
              data={allLogs?.data?.list || []}
              columns={columns}
              setSearch={setSearch}
              isLoading={isLoading}
              setLimit={setLimit}
              limit={limit}
              setPage={setPage}
              paginationValue={allLogs?.data?.meta || {}}
              isSearchEnable={true}
              isPaginateEnable={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
