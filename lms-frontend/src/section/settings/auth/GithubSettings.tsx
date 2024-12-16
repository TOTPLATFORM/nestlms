"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetGithubSettingsForAdmin,
  useUpdateGithubSettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function GithubSettings() {
  const { t } = useTranslation();
  const { data: githubSettings, isLoading: isGithubLoading } =
    useGetGithubSettingsForAdmin();

  const { form, handleSettings, isLoading } =
    useUpdateGithubSettingsForAdminFormHandler();

  useEffect(() => {
    if (!githubSettings?.data || !githubSettings?.success) {
      return;
    }
    form.setValue(
      "github_auth_client_id",
      githubSettings?.data?.github_auth_client_id
    );
    form.setValue(
      "github_auth_client_secret",
      githubSettings?.data?.github_auth_client_secret
    );
  }, [githubSettings?.data]);

  return (
    <>
      {isGithubLoading ? (
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
                  {t(`Github Credentials Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputType
                  form={form}
                  formName={"github_auth_client_id"}
                  formLabel={"Github Client Id"}
                  formPlaceholder={"Github Client Id"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  type="password"
                />
                <InputType
                  form={form}
                  formName={"github_auth_client_secret"}
                  formLabel={"Github Client Secret"}
                  formPlaceholder={"Github Client Secret"}
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
