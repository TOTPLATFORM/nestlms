"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetGoogleSettingsForAdmin,
  useUpdateGoogleSettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function GoogleSettings() {
  const { t } = useTranslation();
  const { data: googleSettings, isLoading: isGoogleLoading } =
    useGetGoogleSettingsForAdmin();

  const { form, handleSettings, isLoading } =
    useUpdateGoogleSettingsForAdminFormHandler();

  useEffect(() => {
    if (!googleSettings?.data || !googleSettings?.success) {
      return;
    }
    form.setValue(
      "google_auth_client_id",
      googleSettings?.data?.google_auth_client_id
    );
    form.setValue(
      "google_auth_client_secret",
      googleSettings?.data?.google_auth_client_secret
    );
  }, [googleSettings?.data]);

  return (
    <>
      {isGoogleLoading ? (
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
                  {t(`Google Credentials Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputType
                  form={form}
                  formName={"google_auth_client_id"}
                  formLabel={"Google Client Id"}
                  formPlaceholder={"Google Client Id"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"google_auth_client_secret"}
                  formLabel={"Google Client Secret"}
                  formPlaceholder={"Google Client Secret"}
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
