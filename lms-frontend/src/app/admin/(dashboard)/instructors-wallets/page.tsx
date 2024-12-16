"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { useTranslation } from "react-i18next";
import { INSTRUCTOR_COURSE_STATUS, PAYMENT_METHODS } from "@/constant/core";
import {
  useGetAllInstructorWalletListsForAdmin,
  useGetTransactinListsForReports,
} from "@/hooks/admin/course.hook";
import { dateFormater } from "@/lib/helper";

export default function InstructorWalletLists() {
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "first_name",
      header: t(` Name`),
      cell: ({ row }) => {
        return (
          <div>
            <span>
              {row.original?.first_name} {row.original?.last_name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "User",
      header: t(`Email`),
      cell: ({ row }) => {
        return (
          <div>
            <span>{row.original?.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "Wallet",
      header: t("Balance"),
      cell: ({ row }) => {
        return (
          <div>
            <span>{row.original?.Wallet[0]?.balance || "N/A"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "Wallet",
      header: t("Total Withdrawn Amount"),
      cell: ({ row }) => {
        return (
          <div>
            <span>
              {row.original?.Wallet[0]?.total_withdrawn_amount || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Wallet",
      header: t("Total Pending Withdraw"),
      cell: ({ row }) => {
        return (
          <div>
            <span>
              {row.original?.Wallet[0]?.total_pending_withdraw || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Wallet",
      header: t("Admin Earning"),
      cell: ({ row }) => {
        return (
          <div>
            <span>{row.original?.Wallet[0]?.admin_earning || "N/A"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "Wallet",
      header: t("Created At"),
      cell: ({ row }) => {
        return (
          <div>
            <p>
              {row.original?.Wallet[0]?.created_at
                ? dateFormater(row.original?.Wallet[0]?.created_at)
                : "N/A"}
            </p>
          </div>
        );
      },
    },
  ];

  const {
    data: courseLists,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
  } = useGetAllInstructorWalletListsForAdmin();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Instructor Wallet Lists`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Here is the list of Instructor Wallet.`)}
            </p>
          </div>
        </div>
      </div>
      <DataTable
        data={courseLists?.data?.instructor_list || []}
        columns={columns}
        setSearch={setSearch}
        isLoading={isLoading}
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        paginationValue={courseLists?.data?.meta || {}}
        isSearchEnable={false}
        isPaginateEnable={true}
      />
    </div>
  );
}
