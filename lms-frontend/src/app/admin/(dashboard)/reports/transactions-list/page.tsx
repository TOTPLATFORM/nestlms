"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { useTranslation } from "react-i18next";
import { INSTRUCTOR_COURSE_STATUS, PAYMENT_METHODS } from "@/constant/core";
import { useGetTransactinListsForReports } from "@/hooks/admin/course.hook";
import { dateFormater } from "@/lib/helper";

export default function TransactionLists() {
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user",
      header: t(`User Name`),
      cell: ({ row }) => {
        const user = row.original.user;

        return (
          <div>
            <span>
              {user?.first_name} {user?.last_name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "User",
      header: t(`User Email`),
      cell: ({ row }) => {
        const user = row.original.user;

        return (
          <div>
            <span>{user?.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "original_price",
      header: t("Original Price"),
    },
    {
      accessorKey: "payable_price",
      header: t("Payable Price"),
    },

    {
      accessorKey: "discounted_price",
      header: t("Discounted Price"),
    },
    {
      accessorKey: "payment_method",
      header: t("Payment Method"),
      cell: ({ row }) => {
        const payment_method = row.original.payment_method;

        return (
          <div>
            {PAYMENT_METHODS.STRIPE == payment_method && (
              <span>{t("Stripe")}</span>
            )}
            {PAYMENT_METHODS.BRAINTREE == payment_method && (
              <span>{t("Braintree")}</span>
            )}
            {PAYMENT_METHODS.PAYPAL == payment_method && (
              <span>{t("Paypal")}</span>
            )}
            {PAYMENT_METHODS.PAYSTACK == payment_method && (
              <span>{t("Paystack")}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("Created At"),
      cell: ({ row }) => {
        const created_at = row.original.created_at;

        return (
          <div>
            <p>{dateFormater(created_at)}</p>
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
  } = useGetTransactinListsForReports();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Transaction Lists`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Here is the Report of Transaction Lists.`)}
            </p>
          </div>
        </div>
      </div>
      <DataTable
        data={courseLists?.data?.list || []}
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
