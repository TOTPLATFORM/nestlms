"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetPayoutSettingsForAdmin,
  useUpdatePayoutSettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PayoutSettings() {
  const { t } = useTranslation();
  const { data: payoutSettings, isLoading: isPayoutDetailsLoading } =
    useGetPayoutSettingsForAdmin();

  const { form, handlePayoutSettings, isLoading } =
    useUpdatePayoutSettingsForAdminFormHandler();

  useEffect(() => {
    if (!payoutSettings?.data || !payoutSettings?.success) {
      return;
    }
    form.setValue(
      "withdraw_percentage",
      payoutSettings?.data?.withdraw_percentage
    );
  }, [payoutSettings?.data]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton title="Back To Dashboard" slug={`/admin`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Payout Settings`)}
          </h2>
        </div>
      </div>
      {isPayoutDetailsLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePayoutSettings)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <InputType
                form={form}
                formName={"withdraw_percentage"}
                formLabel={"Withdraw Percentage(%)"}
                formPlaceholder={"Enter Withdraw Percentage"}
                formDescription={null}
                isErrorMessageShow={false}
                type="number"
                minNumber={0}
                maxNumber={100}
              />
            </div>
            <LoaderButton
              buttonText={`Save`}
              isLoading={isLoading}
              loaderText={"Loading..."}
            />
          </form>
        </Form>
      )}
    </div>
  );
}
