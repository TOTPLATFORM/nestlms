"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SwitchBoxType from "@/components/form/SwitchBoxType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  useGetLiveClassSettingsForAdmin,
  useUpdateLiveClassSettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import GithubSettings from "@/section/settings/auth/GithubSettings";
import GoogleSettings from "@/section/settings/auth/GoogleSettings";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function AuthCredentials() {
  const { t } = useTranslation();

  const { data: liveClassSettings, isLoading: isLiveClassDetailsLoading } =
    useGetLiveClassSettingsForAdmin();

  const { form, handleSettings, isLoading } =
    useUpdateLiveClassSettingsForAdminFormHandler();

  const isLiveClassEnable = form.watch("agora_status");

  useEffect(() => {
    if (!liveClassSettings?.data || !liveClassSettings?.success) {
      return;
    }
    form.setValue("agora_app_id", liveClassSettings?.data?.agora_app_id);
    form.setValue("app_certificate", liveClassSettings?.data?.app_certificate);
    form.setValue(
      "agora_status",
      liveClassSettings?.data?.agora_status == 1 ? true : false
    );
  }, [liveClassSettings?.data]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2 border-b pb-6">
        <div>
          <BackButton title="Back To Dashboard" slug={`/admin`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Live Class Settings`)}
          </h2>
        </div>
      </div>

      <div>
        {isLiveClassDetailsLoading ? (
          <FormSkelation />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSettings)}
              className="space-y-4"
            >
              <div>
                <div className="mb-6 grid grid-cols-1 gap-4">
                  <SwitchBoxType
                    form={form}
                    formName={"agora_status"}
                    formLabel={"Do You want to Enable Live Class?"}
                    formDescription={`Live Class will be aplicable for all instructor.`}
                    isErrorMessageShow={false}
                  />
                </div>
                {isLiveClassEnable && (
                  <>
                    <div>
                      <h4 className="mb-4 text-lg font-bold">
                        {t(`Agora Credentials Settings`)}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InputType
                        form={form}
                        formName={"agora_app_id"}
                        formLabel={"Agora App Id"}
                        formPlaceholder={"Agora App Id"}
                        formDescription={null}
                        isErrorMessageShow={false}
                        type="text"
                      />
                      <InputType
                        form={form}
                        formName={"app_certificate"}
                        formLabel={"Agora App Secret"}
                        formPlaceholder={"Agora App Secret"}
                        formDescription={null}
                        isErrorMessageShow={false}
                        type="text"
                      />
                    </div>
                  </>
                )}
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
