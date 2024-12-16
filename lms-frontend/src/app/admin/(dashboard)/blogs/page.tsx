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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import Link from "next/link";

import { dateFormater, itemDeleteHandler } from "@/lib/helper";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import {
  useDeleteBlogItemForAdmin,
  useGetBlogListsForAdmin,
  useUpdateBlogFormHandler,
} from "@/hooks/admin/blogs.hook";
import CustomImage from "@/components/CustomImage";

export default function BlogTags() {
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "thumbnail_link",
      header: t("Thumbnail Image"),
      cell: ({ row }) => {
        const thumbnail_link = row.original.thumbnail_link;

        return (
          <div className="h-[50px] w-[50px] overflow-hidden rounded-[8px]">
            <CustomImage imageUrl={thumbnail_link || "/images/course_banner.avif"} />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            {t(`Blog Title`)}
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
      accessorKey: "BlogCategory",
      header: t("Blog Category"),
      cell: ({ row }) => {
        const category = row.original.BlogCategory || {};

        return <span>{category?.name || "N/A"}</span>;
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
      accessorKey: "publish_at",
      header: t("Publish At"),
      cell: ({ row }) => {
        const publish_at = row.original.publish_at;

        return dateFormater(publish_at);
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
                <Link href={`/admin/blogs/edit/${id}`}>
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
    data: blogLists,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
    page,
  } = useGetBlogListsForAdmin();

  const { handleSettings, isLoading: isStatusUpdateLOading } =
    useUpdateBlogFormHandler();

  const handleDeleteItem = (item: any) => itemDeleteHandler(item, handleDelete);

  const handleStatusUpdate = (value: any, item: any) => {
    let data = {
      title: item.title,
      status: { value: value ? 1 : 0 },
      blog_category_id: { value: item?.blogCategoryId },
      tag: item?.tag.split(",").map((value: any) => ({ value })),
      description: item?.description,
      meta_title: item?.meta_title,
      meta_keyword: item?.meta_keyword,
      meta_description: item?.meta_description,
    };
    handleSettings(data, item.id);
  };

  const { handleDelete } = useDeleteBlogItemForAdmin();
  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t(`Blogs`)}</h2>
            <p className="text-muted-foreground">
              {t(`Manage your Blog Lists here`)}
            </p>
          </div>
          <div>
            <Link href={`/admin/blogs/create`}>
              <Button variant="default">{t(`Add new Blogs`)}</Button>
            </Link>
          </div>
        </div>
      </div>
      <DataTable
        data={blogLists?.data?.list || []}
        columns={columns}
        setSearch={setSearch}
        isLoading={isLoading}
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        paginationValue={blogLists?.data?.meta || {}}
        isSearchEnable={true}
        isPaginateEnable={true}
      />
    </div>
  );
}
