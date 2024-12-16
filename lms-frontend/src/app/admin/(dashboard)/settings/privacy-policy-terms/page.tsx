"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import DynamicAddRemoveLists from "@/components/form/DynamicAddRemoveLists";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import SwitchBoxType from "@/components/form/SwitchBoxType";
import TextAreaType from "@/components/form/TextAreaType";
import ImagePicker from "@/components/modal/imagePicker.comp";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetPriacyAndTermsSettingsForAdmin,
  useUpdatePriacyAndTermsSettingsFormHandler,
} from "@/hooks/admin/settings.hook";
import { IRootState } from "@/store";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosAdd } from "react-icons/io";
import { useSelector } from "react-redux";

export default function LandingPage() {
  const { t } = useTranslation();
  const { data } = useSelector((state: IRootState) => state.common);

  const { data: settingsData, isLoading: isDetailsLoading } =
    useGetPriacyAndTermsSettingsForAdmin();

  const { form, handleSettings, isLoading } =
    useUpdatePriacyAndTermsSettingsFormHandler();

  useEffect(() => {
    if (!settingsData?.data || !settingsData?.success) {
      return;
    }
    form.setValue("privacy_policy", settingsData?.data?.privacy_policy);

    form.setValue("terms_condition", settingsData?.data?.terms_condition);
    form.setValue(
      "privacy_policy_status",
      Number(settingsData?.data?.privacy_policy_status) ? true : false
    );
    form.setValue(
      "terms_condition_status",
      Number(settingsData?.data?.terms_condition_status) ? true : false
    );
  }, [settingsData?.data]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2 border-b pb-6">
        <div>
          <BackButton title="Back To Dashboard" slug={`/admin`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Privacy Policy And Terms Settings`)}
          </h2>
        </div>
      </div>

      <div>
        {isDetailsLoading ? (
          <FormSkelation />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSettings)}
              className="space-y-4"
            >
              <div>
                <div>
                  <h4 className="my-4 text-lg font-bold">
                    {t(`Privacy Policy`)}
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <SwitchBoxType
                    form={form}
                    formName={"privacy_policy_status"}
                    formLabel={"Privacy Policy"}
                    formDescription={`Do You Want To Enable Privacy Policy`}
                    isErrorMessageShow={false}
                  />
                  <TextAreaType
                    form={form}
                    formName={"privacy_policy"}
                    formLabel={"Privacy Policy Description"}
                    formPlaceholder={"Enter Privacy Policy Description"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />
                </div>
                <div>
                  <h4 className="my-4 text-lg font-bold">
                    {t(`Terms & Conditions`)}
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <SwitchBoxType
                    form={form}
                    formName={"terms_condition_status"}
                    formLabel={"Terms & Conditions"}
                    formDescription={`Do You Want To Enable Terms & Conditions`}
                    isErrorMessageShow={false}
                  />
                  <TextAreaType
                    form={form}
                    formName={"terms_condition"}
                    formLabel={"Terms & Conditions Description"}
                    formPlaceholder={"Enter Terms & Conditions Description"}
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
      </div>
    </div>
  );
}
