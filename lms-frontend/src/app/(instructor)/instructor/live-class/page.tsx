"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
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
import { useTranslation } from "react-i18next";

import { LIVE_CLASS_STATUS } from "@/constant/core";
import CustomImage from "@/components/CustomImage";
import {
  useDeleteLiveClassItemForInstructor,
  useGetLiveClassListsForInstructor,
  useStartLiveClassForInstructorFormHandler,
} from "@/hooks/user/user.settings.hook";
import moment from "moment";
import { Badge } from "flowbite-react";

const statusOption = [
  {
    value: LIVE_CLASS_STATUS.UPCOMING,
    label: "Upcoming",
    colorClass: "warning",
  },
  {
    value: LIVE_CLASS_STATUS.LIVE,
    label: "Live",
    colorClass: "success",
  },
  {
    value: LIVE_CLASS_STATUS.COMPLETED,
    label: "Completed",
    colorClass: "failure",
  },
  {
    value: LIVE_CLASS_STATUS.CANCELLED,
    label: "Cancelled",
    colorClass: "failure",
  },
];

export default function Courses() {
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "Course",
      header: t("Thumbnail Image"),
      cell: ({ row }) => {
        const course = row.original.Course;

        return (
          <div className="h-[50px] w-[50px] overflow-hidden rounded-[8px]">
            <CustomImage
              imageUrl={course?.thumbnail_link || "/images/course_banner.avif"}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "Course",
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
      cell: ({ row }: any) => {
        const course = row.original.Course;

        return <span>{course?.name}</span>;
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
            {t(`Live Class Name`)}
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
      accessorKey: "start_date_time",
      header: t("Start Time"),
      cell: ({ row }: any) => {
        const start_date_time = row.original.start_date_time;

        return (
          <div>{moment(start_date_time).format("DD-MM-yyyy, h:mm:ss a")}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }: any) => {
        const status = row.original.status;

        return (
          <Badge
            color={`${
              statusOption.find((item: any) => item.value == status)?.colorClass
            }`}
            className="inline-block rounded-full"
          >
            {statusOption.find((item: any) => item.value == status)?.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("Created At"),
      cell: ({ row }: any) => {
        const created_at = row.original.created_at;

        return <div>{dateFormater(created_at)}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t(`Actions`)}</div>,
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="text-right">
            {(row?.original?.status == LIVE_CLASS_STATUS.UPCOMING ||
              row?.original?.status == LIVE_CLASS_STATUS.LIVE) && (
              <Button
                onClick={() =>
                  startLiveClassHandler({
                    class_id: Number(row?.original?.id),
                    class_name: row?.original?.channel_name,
                  })
                }
                className="h-min rounded-full py-0.5 text-sm"
              >
                Start
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>

                  <BsThreeDots />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/instructor/live-class/edit/${id}`}>
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
    data: liveClassLists,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
  } = useGetLiveClassListsForInstructor();

  const handleDeleteItem = (item: any) => itemDeleteHandler(item, handleDelete);

  const { startLiveClassHandler } = useStartLiveClassForInstructorFormHandler();

  const { handleDelete } = useDeleteLiveClassItemForInstructor();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Live Classes`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Manage your Live Class Lists here.`)}
            </p>
          </div>
          <div>
            <Link href={`/instructor/live-class/create`}>
              <Button variant="default">{t(`Add new Live Class`)}</Button>
            </Link>
          </div>
        </div>
      </div>
      <DataTable
        data={liveClassLists?.data?.list || []}
        columns={columns}
        setSearch={setSearch}
        isLoading={isLoading}
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        paginationValue={liveClassLists?.data?.meta || {}}
        isSearchEnable={true}
        isPaginateEnable={true}
      />
    </div>
  );
}
