import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import TextAreaType from "@/components/form/TextAreaType";
import VideoPicker from "@/components/modal/videoPicker.comp";
import { Form } from "@/components/ui/form";
import { UPLOAD_SOURCE } from "@/constant/core";
import {
  useCheckAdminAmountForWithdrawRequest,
  useSendWithdrawRequestForInstructor,
} from "@/hooks/admin/instructors.hook";
import { useAddLessonFormHandler } from "@/hooks/user/course.hook";
import { errorToast } from "@/lib/helper";
import React, { useEffect, useState } from "react";

const videoSourceOptions = [
  { value: UPLOAD_SOURCE.LOCAL, label: "Local" },
  { value: UPLOAD_SOURCE.VIMEO, label: "Vimeo" },
  { value: UPLOAD_SOURCE.YOUTUBE, label: "Youtube" },
];
export default function SendWithdrawRequestComp({ closeModal }: any) {
  const { form, isLoading, handleSendWithdrawReq, isSuccess } =
    useSendWithdrawRequestForInstructor();
  const { handleCheckAdminAmountWithdrawReq, data } =
    useCheckAdminAmountForWithdrawRequest();
  const amount = form.watch("requested_amount");

  const message = data?.data?.admin_fee
    ? `Admin Fee ${data?.data?.admin_fee}`
    : "";

  useEffect(() => {
    if (!amount) {
      return;
    }
    if (!parseFloat(amount) && parseFloat(amount) != 0) {
      form.setValue("requested_amount", "");
      return;
    }
    if (parseFloat(amount) < 0) {
      errorToast("Please enter minimum amount greater than 0");
      return;
    }
    handleCheckAdminAmountWithdrawReq({
      requested_amount: amount,
    });
  }, [amount]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    closeModal();
  }, [isSuccess]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSendWithdrawReq)}
          className="space-y-4 p-6"
        >
          <div>
            <div className="grid grid-cols-1 gap-y-4">
              <InputType
                form={form}
                formName={"requested_amount"}
                formLabel={"Requested Amount"}
                formPlaceholder={"Enter requested amount"}
                formDescription={message}
                isErrorMessageShow={false}
              />
              <TextAreaType
                form={form}
                formName={"requested_payment_details"}
                formLabel={"Payment Details"}
                formPlaceholder={"Enter Payment Details"}
                formDescription={null}
                isErrorMessageShow={false}
              />
            </div>
          </div>

          <LoaderButton
            buttonText={`Send`}
            isLoading={isLoading}
            loaderText={"Sending..."}
          />
        </form>
      </Form>
    </>
  );
}
