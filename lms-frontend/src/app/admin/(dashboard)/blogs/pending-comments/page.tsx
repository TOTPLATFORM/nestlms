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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";

import { useTranslation } from "react-i18next";
import { STATUS } from "@/constant/core";
import { useChangeInstructorWithdrawReq } from "@/hooks/admin/admin.hook";
import CustomModal from "@/components/modal/CustomModal";
import {
  useChangeCommentStatusFormHandler,
  useDeleteCommentItemForBlogsAdmin,
  useGetAllPendingCommentLists,
} from "@/hooks/admin/blogs.hook";
import moment from "moment";
import { itemDeleteHandler } from "@/lib/helper";

export default function PendingCommentLists() {
  const { t } = useTranslation();
  const [openModalForView, setOpenModalForView] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<any>({});

  const closeModalForView = () => {
    setOpenModalForView(false);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "Blog",
      header: t("Blog Title"),
      cell: ({ row }) => {
        const blog = row.original.Blog;

        return (
          <div>
            <span>{blog.title}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "message",
      header: t("Comment"),
      cell: ({ row }) => {
        const message = row?.original?.message || "";

        return (
          <div>
            <span>
              {message?.slice(0, 100)}
              {message?.length > 100 && "..."}{" "}
            </span>
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
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div>
            {STATUS.ACTIVE == status && (
              <p className="text-green-600">Accepted</p>
            )}
            {STATUS.PENDING == status && (
              <p className="text-yellow-600">Pending</p>
            )}
            {STATUS.REJECTED == status && (
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
                  }}
                >
                  {t(`View`)}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleDeleteItem(id)}
                >
                  {t(`Delete`)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const handleDeleteItem = (item: any) => itemDeleteHandler(item, handleDelete);
  const { handleDelete } = useDeleteCommentItemForBlogsAdmin();
  const {
    data: courseDetails,
    form,
    handleSettings,
    isLoading,

    isSuccess,
  } = useChangeCommentStatusFormHandler();
  const {
    data: commentLists,
    isLoading: isWithdrawListsLoading,
    setLimit,
    setPage,
    setSearch,
    limit,
    page,
  } = useGetAllPendingCommentLists();

  useEffect(() => {
    if (!isSuccess) return;
    closeModalForView();
  }, [isSuccess]);

  const handleConfirmStatusChange = () => {
    const formData = new FormData();
    formData.append("status", `${STATUS.ACTIVE}`);
    formData.append("blog_comment_id", selectedRequest?.id);

    handleSettings(formData);
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
        formData.append("status", `${STATUS.REJECTED}`);
        formData.append("blog_comment_id", selectedRequest?.id);

        handleSettings(formData);
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
                {t(`Pending Comment Lists`)}
              </h2>
              <p className="text-muted-foreground">
                {t(`Here is the lists of all Pending Comment  `)}
              </p>
            </div>
          </div>
        </div>
        <DataTable
          data={commentLists?.data?.list || []}
          columns={columns}
          setSearch={setSearch}
          isLoading={isLoading}
          setLimit={setLimit}
          limit={limit}
          setPage={setPage}
          paginationValue={commentLists?.data?.meta || {}}
          isSearchEnable={false}
          isPaginateEnable={true}
        />
      </div>
      <CustomModal
        header={`Pending Comment Details`}
        close={closeModalForView}
        isModalOpen={openModalForView}
        modalSize={"4xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          <div className="w-full">
            <h3 className="mb-4 text-xl font-bold">
              {selectedRequest?.Blog?.title}
            </h3>
            <div className="mb-2 flex items-center justify-between gap-6">
              <h3 className="text-base font-bold md:text-xl">
                {selectedRequest?.User?.first_name}{" "}
                {selectedRequest?.User?.last_name}
              </h3>
              <p className="text-xs md:text-base">
                {moment(selectedRequest?.created_at).format("DD MMM YYYY")}
              </p>
            </div>
            <p className="text-xs md:text-base">{selectedRequest?.message}</p>
          </div>
          {selectedRequest?.status != STATUS.ACTIVE && (
            <div className="mt-12 flex items-center gap-6">
              <Button
                type="button"
                onClick={() => {
                  handleConfirmStatusChange();
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
    </>
  );
}
