"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useInstructorEarningsDashboardInfo } from "@/hooks/admin/instructors.hook";
import { DataTable } from "@/section/admin/custom-table/DataTable";
import { Book, DollarSign, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CustomModal from "@/components/modal/CustomModal";
import SendWithdrawRequestComp from "@/section/user/earnings/SendWithdrawRequestComp";
import { WithdrawStatusConstant } from "@/constant/core";
import CustomImage from "@/components/CustomImage";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function instructorEarnings() {
  const [openModalForView, setOpenModalForView] = useState(false);
  const closeModalForView = () => {
    setOpenModalForView(false);
  };
  const [selectedItem, setSelectedItem] = useState<any>({});

  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "payment_accepted_document",
      header: t("Document"),
      cell: ({ row }) => {
        const payment_accepted_document =
          row.original.payment_accepted_document;

        return (
          <>
            {payment_accepted_document ? (
              <div className="h-[50px] w-[50px] overflow-hidden rounded-[8px]">
                <CustomImage imageUrl={payment_accepted_document} />
              </div>
            ) : (
              <div>N/A</div>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "requested_amount",
      header: "Requested Amount",
      cell: ({ row }) => {
        const requested_amount = row.original.requested_amount;
        return <span>{requested_amount}</span>;
      },
    },
    {
      accessorKey: "admin_fee_amount",
      header: "Admin Fee Amount",
      cell: ({ row }) => {
        const admin_fee_amount = row.original.admin_fee_amount;
        return <span>{admin_fee_amount}</span>;
      },
    },
    {
      accessorKey: "requested_payment_details",
      header: t("Payment Details"),
      cell: ({ row }) => {
        const description = row.original.requested_payment_details;
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
      accessorKey: "status",
      header: t("Payment Status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div>
            {WithdrawStatusConstant.ACCEPTED == status && (
              <p className="text-green-600">Accepted</p>
            )}
            {WithdrawStatusConstant.PENDING == status && (
              <p className="text-yellow-600">Pending</p>
            )}
            {WithdrawStatusConstant.REJECTED == status && (
              <p className="text-red-600">Rejected</p>
            )}
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
            <button
              className="text-primary underline"
              onClick={() => {
                setSelectedItem(row.original);
                setOpenModalForView(true);
              }}
              disabled={row.original.payment_accepted_document ? false : true}
            >
              View
            </button>
          </div>
        );
      },
    },
  ];
  const { data, isLoading, setLimit, limit, setPage, setSearch } =
    useInstructorEarningsDashboardInfo();

  const [openModal, setOpenModal] = useState(false);
  const closeModalForWithdraw = () => {
    setOpenModal(false);
  };
  return (
    <>
      <main>
        <div className="flex flex-col">
          <h2 className="mb-4 text-2xl font-bold">Earnings Overview</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="custom-shadow flex items-start rounded-sm bg-white p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <DollarSign />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold">
                  {data?.wallet_details?.balance
                    ? data?.wallet_details?.balance
                    : 0}{" "}
                  USD
                </h2>
                <p className="mt-2 text-sm text-gray-500">Total Balance</p>
              </div>
            </div>
            <div className="custom-shadow flex items-start rounded-sm bg-white p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-100 bg-green-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <DollarSign />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold">
                  {data?.wallet_details?.total_withdrawn_amount
                    ? data?.wallet_details?.total_withdrawn_amount
                    : 0}{" "}
                  USD
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Total Withdrawn Amount
                </p>
              </div>
            </div>
            <div className="custom-shadow flex items-start rounded-sm bg-white p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-100 bg-yellow-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <DollarSign />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold">
                  {data?.wallet_details?.total_pending_withdraw
                    ? data?.wallet_details?.total_pending_withdraw
                    : 0}{" "}
                  USD
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Total Pending Withdraw
                </p>
              </div>
            </div>
            <div className="custom-shadow flex items-start rounded-sm bg-white p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-100 bg-red-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6  text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <DollarSign />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold">
                  {data?.wallet_details?.admin_earning
                    ? data?.wallet_details?.admin_earning
                    : 0}{" "}
                  USD
                </h2>
                <p className="mt-2 text-sm text-gray-500">Admin Earning</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Withdraw Lists</h2>
            {data && (
              <Button type="button" onClick={() => setOpenModal(true)}>
                Withdraw Request
              </Button>
            )}
          </div>
        </div>
        <div className="custom-shadow mt-8 w-full rounded-md p-2 md:p-8">
          <div>
            <DataTable
              data={data?.withdraw_list || []}
              columns={columns}
              setSearch={setSearch}
              isLoading={isLoading}
              setLimit={setLimit}
              limit={limit}
              setPage={setPage}
              paginationValue={data?.meta || {}}
              isSearchEnable={false}
              isPaginateEnable={true}
            />
          </div>
        </div>
      </main>
      <CustomModal
        header={`Send Withdraw Request`}
        close={closeModalForWithdraw}
        isModalOpen={openModal}
        modalSize={"3xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          <SendWithdrawRequestComp closeModal={closeModalForWithdraw} />
        </div>
      </CustomModal>
      <CustomModal
        header={`Payment Accepted Document`}
        close={closeModalForView}
        isModalOpen={openModalForView}
        modalSize={"5xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          {selectedItem?.payment_accepted_document && (
            <div className="h-full max-h-[80vh] w-full">
              <CustomImage imageUrl={selectedItem?.payment_accepted_document} />
            </div>
          )}
        </div>
      </CustomModal>
    </>
  );
}
