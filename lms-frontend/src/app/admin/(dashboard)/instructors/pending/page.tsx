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
import { dateFormater, itemDeleteHandler } from "@/lib/helper";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { useUpdateFaqFormHandler } from "@/hooks/admin/faq.hook";
import TextAccordion from "@/components/text-accordion/TextAccordion";
import {
  useDeleteCouponItem,
  useUpdateCouponFormHandler,
} from "@/hooks/admin/coupon.hook.";
import { CouponUsesTypeConstant, DiscountConstant } from "@/constant/core";
import {
  useAssignAnInstructor,
  usePendingInstructorApplications,
} from "@/hooks/admin/instructors.hook";
import CustomImage from "@/components/CustomImage";

export default function Coupon() {
  const { t } = useTranslation();
  const { handleStatusChange } = useAssignAnInstructor();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "User Photo",
      header: t("User Photo"),
      cell: ({ row }) => {
        const user_photo = row.original.user.photo;
        return (
          <div className="h-[50px] w-[50px] overflow-hidden rounded-[8px]">
            <CustomImage
              imageUrl={user_photo ? user_photo : "/images/profile-pic.jpeg"}
            />
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
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Switch
            checked={status == status.ACTIVE ? true : false}
            onCheckedChange={(value) =>
              handleStatusChange(row.original.user.id)
            }
          />
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: t("Applied At"),
      cell: ({ row }) => {
        const applied_date = row.original.updated_at;
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
  } = usePendingInstructorApplications();

  const { handleUpdateCoupon, isLoading: isStatusUpdateLOading } =
    useUpdateCouponFormHandler();

  const handleDeleteItem = (item: any) => itemDeleteHandler(item, handleDelete);

  const handleStatusUpdate = (value: any, item: any) => {
    let data = {
      id: item.id,
      status: { value: value ? 1 : 0 },
      type: { value: item.type },
      title: item.title,
      code: item.code,
      discount_type: { value: item.discount_type },
      uses_type: { value: item.uses_type },
      start_date: item?.start_date
        ? new Date(item?.start_date)
        : item?.start_date,
      end_date: item?.end_date ? new Date(item?.end_date) : item?.end_date,
      discount_amount: item.discount_amount,
      minimum_purchase: item.minimum_purchase,
      uses_limit: item.uses_limit,
    };
    handleUpdateCoupon(data);
  };

  const { handleDelete } = useDeleteCouponItem();
  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div>
        <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t(`Instructor Applications`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Here is the list of all instructor applications.`)}
            </p>
          </div>
          <div>
            <Link href={`/admin/user/create`}>
              <Button variant="default">{t(`Add New User`)}</Button>
            </Link>
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
