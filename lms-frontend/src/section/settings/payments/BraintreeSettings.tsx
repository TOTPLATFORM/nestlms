"use client";
import { BRAINTREE_MODE } from "@/constant/core";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";

import {
  useGetBraintreeSettingsForAdmin,
  useGetPayoutSettingsForAdmin,
  useUpdateBraintreeSettingsForAdminFormHandler,
  useUpdatePayoutSettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const brainTree = [
  { value: BRAINTREE_MODE.LIVE, label: "Live" },
  { value: BRAINTREE_MODE.SANDBOX, label: "Sandbox" },
];

export default function BraintreeSettings() {
  const { t } = useTranslation();
  const { data: braintreeSettings, isLoading: isBraintreeDetailsLoading } =
    useGetBraintreeSettingsForAdmin();

  const { form, handleSettings, isLoading } =
    useUpdateBraintreeSettingsForAdminFormHandler();

  useEffect(() => {
    if (!braintreeSettings?.data || !braintreeSettings?.success) {
      return;
    }
    form.setValue(
      "braintree_payment_mode",
      brainTree.find(
        (item) => item.value == braintreeSettings?.data?.braintree_payment_mode
      ) || {}
    );
    form.setValue(
      "braintree_merchant_id",
      braintreeSettings?.data?.braintree_merchant_id
    );
    form.setValue(
      "braintree_public_key",
      braintreeSettings?.data?.braintree_public_key
    );
    form.setValue(
      "braintree_private_key",
      braintreeSettings?.data?.braintree_private_key
    );
    form.setValue(
      "braintree_tokenization_keys",
      braintreeSettings?.data?.braintree_tokenization_keys
    );
    form.setValue(
      "braintree_google_merchant_id",
      braintreeSettings?.data?.braintree_google_merchant_id
    );
  }, [braintreeSettings?.data]);

  return (
    <>
      {isBraintreeDetailsLoading ? (
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
                  {t(`Braintree Credentials Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectType
                  form={form}
                  formName={"braintree_payment_mode"}
                  formLabel={"Braintree Payment Mode"}
                  isMultipleSelect={false}
                  selectOptions={brainTree}
                  formDescription={null}
                  isErrorMessageShow={false}
                  classNamePrefix={"lms-react"}
                />
                <InputType
                  form={form}
                  formName={"braintree_merchant_id"}
                  formLabel={"Braintree Merchant Id"}
                  formPlaceholder={"Braintree Merchant Id"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"braintree_public_key"}
                  formLabel={"Braintree Public Key"}
                  formPlaceholder={"Braintree Public Key"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"braintree_private_key"}
                  formLabel={"Braintree Private Key"}
                  formPlaceholder={"Braintree Private Key"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"braintree_tokenization_keys"}
                  formLabel={"Braintree Tokenization Keys"}
                  formPlaceholder={"Braintree Tokenization Keys"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"braintree_google_merchant_id"}
                  formLabel={"Braintree Google Merchant Id"}
                  formPlaceholder={"Braintree Google Merchant Id"}
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
