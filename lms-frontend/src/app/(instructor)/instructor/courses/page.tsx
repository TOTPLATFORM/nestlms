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
      accessorKey: "private_status",
      header: t("Private Status"),
      cell: ({ row }) => {
        const private_status = row.original.private_status;

        return (
          <Switch
            checked={private_status}
            onCheckedChange={(value) => handleStatusUpdate(value, row.original)}
          />
        );
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
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }: any) => {
        const status = row.original.status;

        return (
          <div
            className={`${
              statusOption.find((item: any) => item.value == status)?.colorClass
            }`}
          >
            {statusOption.find((item: any) => item.value == status)?.label}
          </div>
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
                <Link href={`/instructor/courses/edit/${id}`}>
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
    data: courseLists,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
  } = useGetCourseListsForInstructor();

  const {
    handleCourseSettings,
    isLoading: isStatusUpdateLOading,
    setIsUpdate,
  } = useAddEditCourseFormHandler();

  const handleDeleteItem = (item: any) => itemDeleteHandler(item, handleDelete);

  const handleStatusUpdate = (value: any, item: any) => {
    let data: any = {
      id: item.id,
      private_status: value,
      price: parseFloat(item.price),
    };
    setIsUpdate(true);
    handleCourseSettings(data);
  };

  const { handleDelete } = useDeleteCourseItem();
  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Courses`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Manage your Course Lists here.`)}
            </p>
          </div>
          <div>
            <Link href={`/instructor/courses/create`}>
              <Button variant="default">{t(`Add new Courses`)}</Button>
            </Link>
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
