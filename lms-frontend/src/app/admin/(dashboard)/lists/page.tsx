"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { dateFormater } from "@/lib/helper";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/hooks/useTranslation";

import {
  useGetAllAdminListsForAdmin,
  useUpdateAdminStatusForAdmin,
} from "@/hooks/admin/admin.hook";
import CustomImage from "@/components/CustomImage";

export default function AdminLists() {
  const { t } = useTranslation();
  const { handleStatusChange } = useUpdateAdminStatusForAdmin();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "photo",
      header: t("User Photo"),
      cell: ({ row }) => {
        const user_photo = row?.original?.photo;
        return (
          <div className="h-[50px] w-[50px] overflow-hidden rounded-[8px]">
            <CustomImage
              imageUrl={user_photo ? user_photo : "/images/avatar.svg"}
            />
          </div>
        );
      },
    },
    {
      header: t("Name"),
      cell: ({ row }) => {
        return (
          <span>
            {row?.original?.first_name} {row?.original?.last_name}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: t("Email"),
    },
    {
      accessorKey: "phone",
      header: t("Phone"),
    },

    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Switch
            checked={status == 1 ? true : false}
            onCheckedChange={(value) => handleStatusChange(row.original.id, 1)}
          />
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("Applied At"),
      cell: ({ row }) => {
        const applied_date = row.original.created_at;
        return dateFormater(applied_date);
      },
    },
  ];

  const {
    data: pendingLists,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
  } = useGetAllAdminListsForAdmin();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Admin Lists`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Here is the list of all Admin applications.`)}
            </p>
          </div>
        </div>
      </div>
      <DataTable
        data={pendingLists?.data?.list || []}
        columns={columns}
        setSearch={setSearch}
        isLoading={isLoading}
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        paginationValue={pendingLists?.data?.meta || {}}
        isSearchEnable={true}
        isPaginateEnable={true}
      />
    </div>
  );
}
