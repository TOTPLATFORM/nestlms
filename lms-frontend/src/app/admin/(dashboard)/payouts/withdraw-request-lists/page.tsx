"use client";

import { DataTable } from "@/section/admin/custom-table/DataTable";
import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { RiArrowUpDownFill } from "react-icons/ri";
import Swal from "sweetalert2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";

import { useTranslation } from "react-i18next";
import { WithdrawStatusConstant } from "@/constant/core";
import {
  useChangeInstructorWithdrawReq,
  useGetWithdrawRequestLists,
} from "@/hooks/admin/admin.hook";
import CustomModal from "@/components/modal/CustomModal";
import { Mail, Phone } from "lucide-react";
import ImagePicker from "@/components/modal/imagePicker.comp";
import SelectType from "@/components/form/SelectType";
import LoaderButton from "@/components/button/LoaderButton";
import { FileType } from "@/components/form/FileType";
import CustomImage from "@/components/CustomImage";

const requestStatusOptions = [
  {
    label: "Approved",
    value: WithdrawStatusConstant.ACCEPTED,
  },
  {
    label: "Pending",
    value: WithdrawStatusConstant.PENDING,
  },
  {
    label: "Rejected",
    value: WithdrawStatusConstant.REJECTED,
  },
];

export default function WithdrawRequestLists() {
  const { t } = useTranslation();
  const [openModalForView, setOpenModalForView] = useState(false);
  const [openModalForConfirmReq, setOpenModalForConfirmReq] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<any>({});
  const [openForThumbnailImage, setOpenForThumbnailImage] = useState(false);

  const closeModalForView = () => {
    setOpenModalForView(false);
  };
  const closeModalForConfirmModal = () => {
    setOpenModalForConfirmReq(false);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "User",
      header: t("Image"),
      cell: ({ row }) => {
        const user = row.original.User;

        return (
          <div className="h-[50px] w-[50px] overflow-hidden rounded-[8px]">
            <CustomImage imageUrl={user?.photo || "/images/profile-pic.jpeg"} />
          </div>
        );
      },
    },
    {
      accessorKey: "User",
      header: t("Name"),
      cell: ({ row }) => {
        const user = row.original.User;

        return (
          <div>
            <span>
              {user.first_name} {user.last_name}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "requested_amount",
      header: "Requested Amount",
      cell: ({ row }) => {
        const requested_amount = row.original.requested_amount;
        return <span>${requested_amount}</span>;
      },
    },
    {
      accessorKey: "admin_fee_amount",
      header: "Admin Fee Amount",
      cell: ({ row }) => {
        const admin_fee_amount = row.original.admin_fee_amount;
        return <span>${admin_fee_amount}</span>;
      },
    },

    {
      accessorKey: "status",
      header: t("Status"),
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
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setOpenModalForView(true);
                    setSelectedRequest(row.original);
                    setOpenModalForConfirmReq(false);
                  }}
                >
                  {t(`View`)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const {
    data: courseDetails,
    form,
    handleChangeInstructorWithdrawReq,
    isLoading,

    isSuccess,
  } = useChangeInstructorWithdrawReq();
  const {
    data: withdrawRequestLists,
    isLoading: isWithdrawListsLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
    page,
  } = useGetWithdrawRequestLists();

  useEffect(() => {
    if (!isSuccess) return;
    closeModalForConfirmModal();
  }, [isSuccess]);

  const handleConfirmStatusChange = (request: any) => {
    const formData = new FormData();
    formData.append("file", request.file[0]);
    formData.append("status", "1");
    formData.append("withdraw_transaction_id", selectedRequest?.id);
    formData.append("instructor_id", selectedRequest?.userId);

    handleChangeInstructorWithdrawReq(formData);
  };

  const handleRejected = () => {
    Swal.fire({
      title: "Do you want to Reject?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("status", "2");
        formData.append("withdraw_transaction_id", selectedRequest?.id);
        formData.append("instructor_id", selectedRequest?.userId);

        handleChangeInstructorWithdrawReq(formData);
        closeModalForView();
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
                {t(`Withdraw Request Lists`)}
              </h2>
              <p className="text-muted-foreground">
                {t(`Here is the lists of all Withdraw Request `)}
              </p>
            </div>
          </div>
        </div>
        <DataTable
          data={withdrawRequestLists?.data?.list || []}
          columns={columns}
          setSearch={setSearch}
          isLoading={isLoading}
          setLimit={setLimit}
          limit={limit}
          setPage={setPage}
          paginationValue={withdrawRequestLists?.data?.meta || {}}
          isSearchEnable={false}
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
            <h2 className="mb-3 text-xl font-bold">Withdraw Request Info: </h2>
            <div className="text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-5">
                <div className="col-span-2">Requested Amount: </div>
                <div className="col-span-3">
                  ${selectedRequest?.requested_amount}{" "}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5">
                <div className="col-span-2">Admin Fee Amount: </div>
                <div className="col-span-3">
                  ${selectedRequest?.admin_fee_amount}{" "}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5">
                <div className="col-span-2">Requested Payment Details: </div>
                <div className="col-span-3">
                  {selectedRequest?.requested_payment_details}{" "}
                </div>
              </div>
            </div>
          </div>
          {selectedRequest?.status != WithdrawStatusConstant.ACCEPTED && (
            <div className="mt-12 flex items-center gap-6">
              <Button
                type="button"
                onClick={() => {
                  setOpenModalForConfirmReq(true);
                  setOpenModalForView(false);
                }}
              >
                Approve
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
      <CustomModal
        header={`Confirm Withdraw Request`}
        close={closeModalForConfirmModal}
        isModalOpen={openModalForConfirmReq}
        modalSize={"2xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleConfirmStatusChange)}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="">
                      <label
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        htmlFor="file_input"
                      >
                        Upload file
                      </label>
                      <input
                        {...form.register("file", { required: true })}
                        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 py-1.5 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
                        id="file_input"
                        type="file"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-6">
                  <LoaderButton
                    buttonText={`Confirm`}
                    isLoading={isLoading}
                    loaderText={"Creating..."}
                  />
                  <Button
                    type="button"
                    color="gray"
                    className="bg-[#000000]"
                    onClick={() => {
                      setOpenModalForConfirmReq(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
