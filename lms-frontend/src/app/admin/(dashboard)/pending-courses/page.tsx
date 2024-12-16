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
  useGetCategoryLists,
  useUpdateCategoriesFormHandler,
} from "@/hooks/admin/category.hook";
import { itemDeleteHandler } from "@/lib/helper";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import {
  useAddEditCourseFormHandler,
  useDeleteCourseItem,
  useGetCourseListsForInstructor,
  useUpdateCourseFormHandler,
} from "@/hooks/user/course.hook";
import { DISCOUNT_TYPE, INSTRUCTOR_COURSE_STATUS } from "@/constant/core";
import {
  useAddEditCourseFormHandlerForAdmin,
  useChangePendingCourseStatusForAdminItem,
  useDeleteCourseItemForAdmin,
  useGetCourseListsForAdmin,
} from "@/hooks/admin/course.hook";
import CustomImage from "@/components/CustomImage";

const statusOption = [
  {
    value: INSTRUCTOR_COURSE_STATUS.ACTIVE,
    label: "Active",
    colorClass: "text-sky-500",
  },
  {
    value: INSTRUCTOR_COURSE_STATUS.PENDING,
    label: "Pending",
    colorClass: "text-yellow-500",
  },
  {
    value: INSTRUCTOR_COURSE_STATUS.INACTIVE,
    label: "In-Active",
    colorClass: "text-red-500",
  },
];

export default function Courses() {
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "thumbnail_link",
      header: t("Thumbnail Image"),
      cell: ({ row }) => {
        const thumbnail_link = row.original.thumbnail_link;

        return (
          <div className="h-[50px] w-[50px] overflow-hidden rounded-[8px]">
            <CustomImage
              imageUrl={thumbnail_link || "/images/course_banner.avif"}
            />
          </div>
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
            {t(`Course Name`)}
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
      cell: ({ row }) => {
        const name = row.original.name;

        return (
          <div className="min-w-[150px]">
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: t(" Price"),
    },
    {
      accessorKey: "payable_price",
      header: t("Payable Price"),
    },
    {
      accessorKey: "discount_status",
      header: t("Discount Status"),
      cell: ({ row }) => {
        const discount_status = row.original.discount_status;

        return <div>{discount_status ? "Yes" : "No"}</div>;
      },
    },
    {
      accessorKey: "discount_value",
      header: t("Discount Value"),
      cell: ({ row }) => {
        const discount_type = row.original.discount_type;
        const discount_value = row.original.discount_value;

        return (
          <div>
            {discount_value}{" "}
            {discount_type == DISCOUNT_TYPE.PERCENTAGE ? "%" : "$"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }: any) => {
        const status = row.original.status;

        return (
          <Switch
            checked={status == INSTRUCTOR_COURSE_STATUS.ACTIVE ? true : false}
            onCheckedChange={(value) => handleStatusUpdate(value, row.original)}
          />
        );
      },
    },
    {
      accessorKey: "private_status",
      header: t("Private Status"),
      cell: ({ row }) => {
        const private_status = row.original.private_status;

        return <div>{private_status ? "Yes" : "No"}</div>;
      },
    },
    {
      accessorKey: "is_free",
      header: t("Is Free"),
      cell: ({ row }) => {
        const is_free = row.original.is_free;

        return <div>{is_free ? "Yes" : "No"}</div>;
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
  } = useGetCourseListsForAdmin(2);

  const { handleUpdate, isLoading: isStatusUpdateLOading } =
    useChangePendingCourseStatusForAdminItem();

  const handleStatusUpdate = (value: any, item: any) => {
    let data: any = {
      course_id: item.id,
      status: 1,
    };

    handleUpdate(data);
  };

  const { handleDelete } = useDeleteCourseItemForAdmin();
  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Pending Courses`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Here is the list of all Pending Course.`)}
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
        isSearchEnable={true}
        isPaginateEnable={true}
      />
    </div>
  );
}
