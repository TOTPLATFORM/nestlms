"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useGetCourseEnrollmentListsForReports } from "@/hooks/admin/course.hook";
import CustomImage from "@/components/CustomImage";

export default function CourseEnrollments() {
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
      header: t(`Course Name`),
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
      accessorKey: "User",
      header: t(`Instructor Name`),
      cell: ({ row }) => {
        const user = row.original.User;

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
      header: t(`Instructor Email`),
      cell: ({ row }) => {
        const user = row.original.User;

        return (
          <div>
            <span>{user?.email}</span>
          </div>
        );
      },
    },

    {
      accessorKey: "payable_price",
      header: t("Payable Price"),
    },
    {
      accessorKey: "total_enrolled",
      header: t("Total Enrolled"),
    },
    {
      accessorKey: "total_review",
      header: t("Total Review"),
    },
    {
      accessorKey: "completed_course",
      header: t("Total Completed"),
    },
  ];

  const {
    data: courseLists,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
  } = useGetCourseEnrollmentListsForReports();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Course Enrollments`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Here is the Report of Course Enrollment Lists.`)}
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
