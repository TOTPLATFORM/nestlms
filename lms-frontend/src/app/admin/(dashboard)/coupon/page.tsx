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
  useGetCouponLists,
  useUpdateCouponFormHandler,
} from "@/hooks/admin/coupon.hook.";
import { CouponUsesTypeConstant, DiscountConstant } from "@/constant/core";

export default function Coupon() {
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            {t(`Title`)}
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
      accessorKey: "code",
      header: t("Code"),
    },
    {
      accessorKey: "discount_type",
      header: t("Discount Type"),
      cell: ({ row }) => {
        const discount_type = row.original.discount_type;

        if (discount_type == DiscountConstant.DISCOUNT_FIXED) {
          return <p>{t("Fixed")}</p>;
        }
        if (discount_type == DiscountConstant.DISCOUNT_PERCENTAGE) {
          return <p>{t("Percentage")}</p>;
        }
      },
    },
    {
      accessorKey: "uses_type",
      header: t("Uses Type"),
      cell: ({ row }) => {
        const uses_type = row.original.uses_type;

        if (uses_type == CouponUsesTypeConstant.LIMITED_USER) {
          return <p>{t("Limited User")}</p>;
        }
        if (uses_type == CouponUsesTypeConstant.UNLIMITED_USER) {
          return <p>{t("Unlimited User")}</p>;
        }
      },
    },
    {
      accessorKey: "uses_limit",
      header: t("User Limit"),
      cell: ({ row }) => {
        const uses_limit = row.original.uses_limit;

        if (!uses_limit) {
          return <p>{t("N/A")}</p>;
        }
        return <p>{uses_limit}</p>;
      },
    },
    {
      accessorKey: "discount_amount",
      header: t("Discount Amount"),
    },
    {
      accessorKey: "minimum_purchase",
      header: t("Minimum Purchase"),
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
      accessorKey: "start_date",
      header: t("Start Date"),
      cell: ({ row }) => {
        const start_date = row.original.start_date;

        return dateFormater(start_date);
      },
    },
    {
      accessorKey: "end_date",
      header: t("End Date"),
      cell: ({ row }) => {
        const end_date = row.original.end_date;

        return dateFormater(end_date);
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
                <Link href={`/admin/coupon/edit/${id}`}>
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
    data: couponLists,
    isLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
  } = useGetCouponLists();

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
              {t(`Coupon Lists`)}
            </h2>
            <p className="text-muted-foreground">
              {t(`Total ${couponLists?.data?.meta?.total || 0} Coupons`)}
            </p>
          </div>
          <div>
            <Link href={`/admin/coupon/create`}>
              <Button variant="default">{t(`Add new Coupon`)}</Button>
            </Link>
          </div>
        </div>
      </div>
      <DataTable
        data={couponLists?.data?.list || []}
        columns={columns}
        setSearch={setSearch}
        isLoading={isLoading}
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        paginationValue={couponLists?.data?.meta || {}}
        isSearchEnable={true}
        isPaginateEnable={true}
      />
    </div>
  );
}
