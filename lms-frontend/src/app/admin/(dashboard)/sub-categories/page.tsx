"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { RiArrowUpDownFill } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";
import BackButton from "@/components/back-button/BackButton";
import {
  useDeleteCategoryItem,
  useDeleteSubCategoryItem,
  useGetCategoryLists,
  useGetSubCategoryLists,
  useUpdateCategoriesFormHandler,
  useUpdateSubCategoriesFormHandler,
} from "@/hooks/admin/category.hook";
import { itemDeleteHandler } from "@/lib/helper";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/hooks/useTranslation";

export default function SubCategories() {
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "category.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            {t(`Category Name`)}
            {column.getIsSorted() === "desc" ? (
              <IoMdArrowDown className="ml-2" />
            ) : column.getIsSorted() === "asc" ? (
              <IoMdArrowUp className="ml-2" />
            ) : (
              <RiArrowUpDownFill className="ml-2" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            {t(`Sub Category Name`)}
            {column.getIsSorted() === "desc" ? (
              <IoMdArrowDown className="ml-2" />
            ) : column.getIsSorted() === "asc" ? (
              <IoMdArrowUp className="ml-2" />
            ) : (
              <RiArrowUpDownFill className="ml-2" />
            )}
          </Button>
        );
      },
    },

    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Switch
            checked={status == 1 ? true : false}
            onCheckedChange={(value) => handleStatusUpdate(value, row.original)}
          />
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t(`Actions`)}</div>,
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>

                  <BsThreeDots />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/admin/sub-categories/edit/${id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    {t(`Edit`)}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => handleDeleteItem(id)}>
                  {t(`Delete`)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const {
    data: categoryLists,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
    page,
  } = useGetSubCategoryLists();

  const { handleUpdateSubCategories, isLoading: isStatusUpdateLOading } =
    useUpdateSubCategoriesFormHandler();

  const handleDeleteItem = (id: any) => itemDeleteHandler(id, handleDelete);

  const handleStatusUpdate = (value: any, item: any) => {
    let data = {
      id: item.id,
      name: item.name,
      logo: item.logo,
      status: { value: value ? 1 : 0 },
      category_id: { value: item.category_id },
    };
    handleUpdateSubCategories(data);
  };

  const { handleDelete } = useDeleteSubCategoryItem();
  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Sub Categories`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Manage your Sub-Category Lists here`)}
            </p>
          </div>
          <div>
            <Link href={`/admin/sub-categories/create`}>
              <Button variant="default">{t(`Add new Sub category`)}</Button>
            </Link>
          </div>
        </div>
      </div>
      <DataTable
        data={categoryLists?.data?.list || []}
        columns={columns}
        setSearch={setSearch}
        isLoading={isLoading}
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        paginationValue={categoryLists?.data?.meta || {}}
        isSearchEnable={true}
        isPaginateEnable={true}
      />
    </div>
  );
}
