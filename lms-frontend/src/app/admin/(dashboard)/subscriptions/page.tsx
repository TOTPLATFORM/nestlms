"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { dateFormater } from "@/lib/helper";
import { useTranslation } from "react-i18next";
import { useGetSubscriptionLists } from "@/hooks/admin/admin.hook";

export default function Subscriptions() {
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "email",
      header: t("Email"),
    },

    {
      accessorKey: "created_at",
      header: t("Created at"),
      cell: ({ row }) => {
        const created_at = row.original.created_at;

        return dateFormater(created_at);
      },
    },
  ];

  const {
    data: couponLists,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
  } = useGetSubscriptionLists();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Subscription Lists`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Here is the list of subscription`)}
            </p>
          </div>
        </div>
      </div>
      <DataTable
        data={couponLists?.data?.list || []}
        columns={columns}
        setSearch={setSearch}
        isLoading={isLoading}
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        paginationValue={couponLists?.data?.meta || {}}
        isSearchEnable={true}
        isPaginateEnable={true}
      />
    </div>
  );
}
