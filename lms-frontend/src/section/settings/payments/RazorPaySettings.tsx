"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetPayoutSettingsForAdmin,
  useGetRazorPaySettingsForAdmin,
  useUpdatePayoutSettingsForAdminFormHandler,
  useUpdateRazorPaySettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RazorPaySettings() {
  const { t } = useTranslation();
  const { data: razorPaySettings, isLoading: isRazorPayDetailsLoading } =
    useGetRazorPaySettingsForAdmin();

  const { form, handleSettings, isLoading } =
    useUpdateRazorPaySettingsForAdminFormHandler();

  useEffect(() => {
    if (!razorPaySettings?.data || !razorPaySettings?.success) {
      return;
    }
    form.setValue(
      "payment_razorpay_key_id",
      razorPaySettings?.data?.payment_razorpay_key_id
    );
    form.setValue(
      "payment_razorpay_key_secret",
      razorPaySettings?.data?.payment_razorpay_key_secret
    );
  }, [razorPaySettings?.data]);

  return (
    <>
      {isRazorPayDetailsLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSettings)}
            className="space-y-4"
          >
            <div>
              <div>
                <h4 className="mb-4 text-lg font-bold">
                  {t(`Razorpay Credentials Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputType
                  form={form}
                  formName={"payment_razorpay_key_id"}
                  formLabel={"Razorpay Key Id"}
                  formPlaceholder={"Razorpay Key Id"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"payment_razorpay_key_secret"}
                  formLabel={"Razorpay Key Secret"}
                  formPlaceholder={"Razorpay Key Secret"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
              </div>
            </div>
            <LoaderButton
              buttonText={`Save`}
              isLoading={isLoading}
              loaderText={"Saveing..."}
            />
          </form>
        </Form>
      )}
    </>
  );
}
