"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import SwitchBoxType from "@/components/form/SwitchBoxType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  useGetKycDetails,
  useUpdateKycFormHandler,
} from "@/hooks/admin/kyc.hook";
import { statusValueHandler } from "@/lib/helper";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];

export default function KycEdit({ params }: { params: { id: any } }) {
  const { t } = useTranslation();

  const { data: kycDetails, isLoading: isDetailsLoading } =
    useGetKycDetails(params?.id) || {};

  const { form, handleUpdateKyc, isLoading } = useUpdateKycFormHandler();

  useEffect(() => {
    if (!kycDetails?.data) {
      return;
    }
    form.setValue("name", kycDetails?.data?.name);
    form.setValue("id", kycDetails?.data?.id);

    form.setValue(
      "status",
      statusValueHandler(kycDetails?.data?.status, options)
    );
    form.setValue(
      "is_text_required",
      kycDetails?.data?.is_text_required == 1 ? true : false
    );
    form.setValue(
      "is_file_required",
      kycDetails?.data?.is_file_required == 1 ? true : false
    );
  }, [kycDetails?.data]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton title="Back To KYC Lists" slug={`/admin/kyc`} />
          <h2 className="text-2xl font-bold tracking-tight">{t(`Edit KYC`)}</h2>
        </div>
      </div>
      {isDetailsLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateKyc)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <InputType
                form={form}
                formName={"name"}
                formLabel={"KYC Name"}
                formPlaceholder={"Enter KYC Name"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <SelectType
                form={form}
                formName={"status"}
                formLabel={"KYC Status"}
                isMultipleSelect={false}
                selectOptions={options}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
              <SwitchBoxType
                form={form}
                formName={"is_text_required"}
                formLabel={"Is Text Required?"}
                formDescription={`This is your public display Details.`}
                isErrorMessageShow={false}
              />
              <SwitchBoxType
                form={form}
                formName={"is_file_required"}
                formLabel={"Is File Required?"}
                formDescription={`This is your public display Details.`}
                isErrorMessageShow={false}
              />
            </div>
            <LoaderButton
              buttonText={`Update`}
              isLoading={isLoading}
              loaderText={"Updating..."}
            />
          </form>
        </Form>
      )}
    </div>
  );
}
