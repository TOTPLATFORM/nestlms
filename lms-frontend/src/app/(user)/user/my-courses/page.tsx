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
  useGetEnrolledCourses,
  useUpdateCourseFormHandler,
} from "@/hooks/user/course.hook";
import { DISCOUNT_TYPE, INSTRUCTOR_COURSE_STATUS } from "@/constant/core";
import PositiveYAxisAnimation from "@/components/animation/PositiveYAxisAnimation";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
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

const page = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "thumbnail_link",
      header: t("Image"),
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
      accessorKey: "description",
      header: t("Description"),
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          <div>
            <p>
              {description?.length > 100
                ? description?.substring(0, 100) + "..."
                : description}
            </p>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t(`Actions`)}</div>,
      cell: ({ row }) => {
        const slug = row.original.slug;

        return (
          <div className="text-right">
            <Link
              href={`/user/course/${slug}/learn/lecture/${row.original.id}`}
            >
              <Button variant="default" className=" px-5">
                Visit
              </Button>
            </Link>
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
  } = useGetEnrolledCourses();
  return (
    <div>
      <section className="mx-5 mb-4 mt-8">
        <div className="overflow-visible">
          <div className="relative rounded-[12px] bg-[url('/images/course_banner.avif')] bg-cover bg-center bg-no-repeat ">
            <div className="rounded-[12px] px-[50px] py-[90px] ">
              <NegativeXAxisAnimation
                classes={`flex flex-col items-center justify-center`}
                isOneTime={true}
              >
                <h2 className="relative  text-xl font-bold capitalize text-white min-[1200px]:text-4xl">
                  My Courses
                </h2>
                <h4
                  className="pb-[30px] pt-2.5 text-sm font-bold -tracking-[0.64px] text-white min-[1200px]:text-base"
                  style={{ lineHeight: "1.1" }}
                >
                  Here you will get your enrolled courses
                </h4>
              </NegativeXAxisAnimation>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <PositiveYAxisAnimation
          classes={`mx-auto max-w-screen-xl px-4 md:px-8`}
          isOneTime={true}
        >
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
        </PositiveYAxisAnimation>
      </section>
    </div>
  );
};

export default page;
