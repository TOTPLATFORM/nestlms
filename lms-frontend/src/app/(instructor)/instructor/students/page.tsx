"use client";
import CustomImage from "@/components/CustomImage";
import { Button } from "@/components/ui/button";
import { useGetInstructroStudentsApi } from "@/hooks/user/course.hook";
import { DataTable } from "@/section/admin/custom-table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const page = () => {
  const { data, isLoading, limit, setLimit, setPage, setSearch } =
    useGetInstructroStudentsApi();
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "User Photo",
      header: t("User Photo"),
      cell: ({ row }) => {
        const user_photo = row.original.user.photo;
        return (
          <div className="h-[50px] w-[50px] overflow-hidden rounded-[8px]">
            <CustomImage imageUrl={user_photo || "/images/profile-pic.jpeg"} />
          </div>
        );
      },
    },
    {
      accessorKey: "user.first_name",
      header: t("Name"),
    },
    {
      accessorKey: "user.email",
      header: t("Email"),
    },

    {
      accessorKey: "user.phone",
      header: t("Phone"),
    },
  ];
  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`My Student's`)}
            </h2>
          </div>
        </div>
      </div>
      <DataTable
        data={data?.data?.list || []}
        columns={columns}
        setSearch={setSearch}
        isLoading={isLoading}
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        paginationValue={data?.data?.meta || {}}
        isSearchEnable={true}
        isPaginateEnable={true}
      />
    </div>
  );
};

export default page;
