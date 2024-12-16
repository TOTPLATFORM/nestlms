"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React, { useEffect, useState } from "react";

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
import { useUpdateCategoriesFormHandler } from "@/hooks/admin/category.hook";
import { itemDeleteHandler } from "@/lib/helper";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import {
  useDeleteKycItem,
  useGetVerifykycLists,
  useGetkycLists,
  useUpdateKycFormHandler,
  useVerifyKycForUserFormHandlerForAdmin,
} from "@/hooks/admin/kyc.hook";
import { KYC_VERIFY_STATUS } from "@/constant/core";
import CustomImage from "@/components/CustomImage";
import CustomModal from "@/components/modal/CustomModal";
import { Mail, Phone } from "lucide-react";
import { Badge } from "flowbite-react";
import Swal from "sweetalert2";

export default function Kyc() {
  const { t } = useTranslation();
  const [selectedRequest, setSelectedRequest] = useState<any>({});
  const [openModalForView, setOpenModalForView] = useState(false);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "KycVerificationList",
      header: t(`KYC Name`),
      cell: ({ row }) => {
        const kycItem = row.original.KycVerificationList;

        return <span>{kycItem?.name}</span>;
      },
    },
    {
      accessorKey: "User",
      header: t(`User Name`),
      cell: ({ row }) => {
        const user = row.original.User;

        return (
          <span>
            {user?.first_name}
            {""} {user?.last_name}
          </span>
        );
      },
    },

    {
      accessorKey: "file_url",
      header: t("File"),
      cell: ({ row }) => {
        const file_url = row.original.file_url;

        return (
          <>
            {file_url ? (
              <div className="h-[50px] w-[50px] overflow-hidden rounded-[8px]">
                <CustomImage imageUrl={file_url} />
              </div>
            ) : (
              "N/A"
            )}
          </>
        );
      },
    },
    {
      accessorKey: "text",
      header: t("Text Required"),
      cell: ({ row }) => {
        const text = row.original.text;

        return (
          <>
            {text ? (
              <p>{text.length > 50 ? `${text.slice(0, 50)}...` : text}</p>
            ) : (
              <p>N/A</p>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("Is Verify"),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div
            className={
              status == KYC_VERIFY_STATUS.IS_VERIFIED
                ? "text-green-400"
                : status == KYC_VERIFY_STATUS.REJECTED
                ? "text-red-400"
                : "text-yellow-400"
            }
          >
            {status == KYC_VERIFY_STATUS.IS_VERIFIED
              ? "Verified"
              : status == KYC_VERIFY_STATUS.REJECTED
              ? "Rejected "
              : "Not Verified"}
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
            <Badge
              color="gray"
              className="inline-block cursor-pointer"
              onClick={() => {
                setOpenModalForView(true);
                setSelectedRequest(row.original);
              }}
            >
              Veiw
            </Badge>
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
  } = useGetVerifykycLists();

  const {
    isLoading: isVerifing,
    handleVerifyKyc,
    isSuccess,
  } = useVerifyKycForUserFormHandlerForAdmin();

  const closeModalForView = () => {
    setOpenModalForView(false);
  };
  const handleVerifyUserKyc = async (status: any) => {
    let data = {
      user_kyc_id: selectedRequest?.id,
      status: status,
    };
    const res = await handleVerifyKyc(data);
    if (res) {
      closeModalForView();
    }
  };

  const handleRejected = () => {
    Swal.fire({
      title: "Do you want to Reject?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        handleVerifyUserKyc(KYC_VERIFY_STATUS.REJECTED);
      } else {
        closeModalForView();
      }
    });
  };

  return (
    <>
      <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
        <div>
          <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {t(`User KYC Lists`)}
              </h2>
              <p className="text-muted-foreground">
                {t(`Manage User KYC Lists here.`)}
              </p>
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
      <CustomModal
        header={`Withdraw Request Details`}
        close={closeModalForView}
        isModalOpen={openModalForView}
        modalSize={"4xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-bold">User Info: </h2>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="h-[200px] w-[200px] overflow-hidden rounded-[8px] border">
                <CustomImage
                  imageUrl={
                    selectedRequest?.User?.photo || "/images/profile-pic.jpeg"
                  }
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700">
                  {selectedRequest?.User?.first_name}{" "}
                  {selectedRequest?.User?.last_name}
                </h4>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span> {selectedRequest?.User?.email}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span> {selectedRequest?.User?.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-bold">Kyc Info: </h2>
            <div className="mb-4">
              <h3 className="font-medium">
                {selectedRequest?.KycVerificationList?.name}
              </h3>
              <div className="mt-2 flex items-center gap-x-4 text-sm">
                <span>File Required: </span>
                <Badge
                  color={
                    selectedRequest?.KycVerificationList?.is_file_required == 1
                      ? "success"
                      : "failure"
                  }
                >
                  {selectedRequest?.KycVerificationList?.is_file_required == 1
                    ? "Yes"
                    : "No"}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-x-4 text-sm">
                <span>Text Required: </span>

                <Badge
                  color={
                    selectedRequest?.KycVerificationList?.is_text_required == 1
                      ? "success"
                      : "failure"
                  }
                >
                  {selectedRequest?.KycVerificationList?.is_text_required == 1
                    ? "Yes"
                    : "No"}
                </Badge>
              </div>
            </div>
            <h2 className="mb-3 text-xl font-bold">Submitted Info: </h2>
            <div>
              <div className="mb-4">{selectedRequest?.text}</div>
              {selectedRequest?.file_url && (
                <div className="h-[300px] w-full overflow-hidden rounded-[8px] border">
                  <CustomImage imageUrl={selectedRequest?.file_url} />
                </div>
              )}
            </div>
          </div>
          {selectedRequest?.status != KYC_VERIFY_STATUS.IS_VERIFIED &&
            selectedRequest?.status != KYC_VERIFY_STATUS.REJECTED && (
              <div className="mt-12 flex items-center gap-6">
                <Button
                  type="button"
                  onClick={() =>
                    handleVerifyUserKyc(KYC_VERIFY_STATUS.IS_VERIFIED)
                  }
                  disabled={isVerifing}
                >
                  {isVerifing ? "Verifing.." : "Approve"}
                </Button>
                <Button
                  type="button"
                  className="bg-[#000000]"
                  onClick={handleRejected}
                >
                  Reject
                </Button>
              </div>
            )}
        </div>
      </CustomModal>
    </>
  );
}
