"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetPaystackSettingsForAdmin,
  useUpdatePaystackSettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PaystackSettings() {
  const { t } = useTranslation();
  const { data: paystackSettings, isLoading: isPayoutDetailsLoading } =
    useGetPaystackSettingsForAdmin();

  const { form, handleSettings, isLoading } =
    useUpdatePaystackSettingsForAdminFormHandler();

  useEffect(() => {
    if (!paystackSettings?.data || !paystackSettings?.success) {
      return;
    }
    form.setValue(
      "payment_paystack_public_key",
      paystackSettings?.data?.payment_paystack_public_key
    );
    form.setValue(
      "payment_paystack_key_secret",
      paystackSettings?.data?.payment_paystack_key_secret
    );
    form.setValue(
      "payment_paystack_redirect_url",
      paystackSettings?.data?.payment_paystack_redirect_url
    );
  }, [paystackSettings?.data]);

  return (
    <>
      {isPayoutDetailsLoading ? (
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
                  {t(`Paystack Credentials Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputType
                  form={form}
                  formName={"payment_paystack_public_key"}
                  formLabel={"Paystack Public Key"}
                  formPlaceholder={"Paystack Public Key"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"payment_paystack_key_secret"}
                  formLabel={"Paystack Secret Key"}
                  formPlaceholder={"Paystack Secret Key"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"payment_paystack_redirect_url"}
                  formLabel={"Paystack Redirect Url"}
                  formPlaceholder={
                    "Use Redirect Url like this https://demo.com"
                  }
                  formDescription={null}
                  isErrorMessageShow={false}
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
