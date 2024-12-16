"use client";
import React from "react";
import DialogModal from "@/components/modal/DialogModal";
import {
  useCheckKycForUserFormHandler,
  useGetKycVerificationListsForUser,
} from "@/hooks/user/user.settings.hook";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "flowbite-react";
import KycVerifyUserForm from "../kyc-verify-user/KycVerifyUserForm";
import CustomModal from "./CustomModal";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { checkKycVerificationForUserApi } from "@/service/user/user.settings";
import { errorToast } from "@/lib/helper";
import { useBecomeAnInstructor } from "@/hooks/auth.hook";
import { KYC_VERIFY_STATUS } from "@/constant/core";
export default function InstructorModal({
  isInstructorModalOpen,
  setIsInstructorModalOpen,
}: any) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetKycVerificationListsForUser();
  const { isLoading: isChecking, handleCheckKycForUser } =
    useCheckKycForUserFormHandler();
  const { apply, isLoading: isBecomeInstructorLoading } =
    useBecomeAnInstructor();
  const closeModal = () => {
    setIsInstructorModalOpen(false);
  };

  const handleApplyInstructor = async () => {
    const response = await handleCheckKycForUser();

    if (response) {
      apply();
    }
  };

  return (
    <CustomModal
      isModalOpen={isInstructorModalOpen}
      close={closeModal}
      header="Apply For Instructor"
      modalSize={"4xl"}
    >
      {isLoading ? (
        <div>
          {[1, 2, 3, 4].map((number: any) => (
            <Skeleton className="mb-4 h-[60px] w-full last:mb-0" key={number} />
          ))}
        </div>
      ) : (
        <>
          {data?.data?.length == 0 ? (
            <p>Apply Here</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {data?.data?.map((item: any, index: any) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 px-2">
                      <p className=" font-semibold capitalize">{item?.name}</p>
                      <Badge
                        color={
                          !item?.status
                            ? "failure"
                            : item?.status == KYC_VERIFY_STATUS.PENDING
                            ? "warning"
                            : item?.status == KYC_VERIFY_STATUS.REJECTED
                            ? "failure"
                            : "success"
                        }
                        className="rounded-full px-2 py-0 text-[10px]"
                      >
                        {!item?.status
                          ? "Not submitted"
                          : item?.status == KYC_VERIFY_STATUS.PENDING
                          ? "Pending"
                          : item?.status == KYC_VERIFY_STATUS.REJECTED
                          ? "Rejected"
                          : "Verified"}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  {(!item?.status ||
                    item?.status == KYC_VERIFY_STATUS.REJECTED) && (
                    <AccordionContent>
                      <KycVerifyUserForm item={item} />
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </>
      )}
      <div className="mt-6">
        <Button
          onClick={handleApplyInstructor}
          disabled={isBecomeInstructorLoading || isChecking}
        >
          {isBecomeInstructorLoading || isChecking
            ? t("Processing...")
            : t(`Apply Now`)}
        </Button>
      </div>
    </CustomModal>
  );
}
