"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetPayoutSettingsForAdmin,
  useGetStripeSettingsForAdmin,
  useUpdatePayoutSettingsForAdminFormHandler,
  useUpdateStripeSettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function StripeSettings() {
  const { t } = useTranslation();
  const { data: stripeSettings, isLoading: isStripeLoading } =
    useGetStripeSettingsForAdmin();

  const { form, handleSettings, isLoading } =
    useUpdateStripeSettingsForAdminFormHandler();

  useEffect(() => {
    if (!stripeSettings?.data || !stripeSettings?.success) {
      return;
    }
    form.setValue(
      "pm_stripe_client_id_live",
      stripeSettings?.data?.pm_stripe_client_id_live
    );
    form.setValue(
      "pm_stripe_secret_key_live",
      stripeSettings?.data?.pm_stripe_secret_key_live
    );
  }, [stripeSettings?.data]);

  return (
    <>
      {isStripeLoading ? (
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
                  {t(`Stripe Credentials Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputType
                  form={form}
                  formName={"pm_stripe_client_id_live"}
                  formLabel={"Stripe Client Id"}
                  formPlaceholder={"Stripe Client Id"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"pm_stripe_secret_key_live"}
                  formLabel={"Stripe Client Secret"}
                  formPlaceholder={"Stripe Client Secret"}
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
