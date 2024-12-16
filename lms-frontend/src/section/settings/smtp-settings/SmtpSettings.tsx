"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetSmtpSettingsForAdmin,
  useUpdateSmtpSettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SmtpSettings() {
  const { t } = useTranslation();
  const { data: smtpSettings, isLoading: isPayoutDetailsLoading } =
    useGetSmtpSettingsForAdmin();

  const { form, handleSettings, isLoading } =
    useUpdateSmtpSettingsForAdminFormHandler();

  useEffect(() => {
    if (!smtpSettings?.data || !smtpSettings?.success) {
      return;
    }
    form.setValue("smtp_host", smtpSettings?.data?.smtp_host);
    form.setValue("smtp_port", smtpSettings?.data?.smtp_port);
    form.setValue("smtp_user_name", smtpSettings?.data?.smtp_user_name);
    form.setValue("smtp_password", smtpSettings?.data?.smtp_password);
    form.setValue("smtp_sender_email", smtpSettings?.data?.smtp_sender_email);
    form.setValue("smtp_encryption", smtpSettings?.data?.smtp_encryption);
  }, [smtpSettings?.data]);

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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <InputType
                form={form}
                formName={"smtp_host"}
                formLabel={"SMTP Host"}
                formPlaceholder={"Enter SMTP Host"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <InputType
                form={form}
                formName={"smtp_port"}
                formLabel={"SMTP Port"}
                formPlaceholder={"Enter SMTP Port"}
                formDescription={null}
                isErrorMessageShow={false}
                type="number"
              />
              <InputType
                form={form}
                formName={"smtp_user_name"}
                formLabel={"SMTP User Name"}
                formPlaceholder={"Enter User Name"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <InputType
                form={form}
                formName={"smtp_password"}
                formLabel={"SMTP Password"}
                formPlaceholder={"Enter SMTP Password"}
                formDescription={null}
                isErrorMessageShow={false}
                type="password"
              />
              <InputType
                form={form}
                formName={"smtp_sender_email"}
                formLabel={"SMTP Sender Email"}
                formPlaceholder={"Enter SMTP Sender Email"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <InputType
                form={form}
                formName={"smtp_encryption"}
                formLabel={"SMTP Encryption"}
                formPlaceholder={"Enter SMTP Encryption"}
                formDescription={null}
                isErrorMessageShow={false}
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
    </>
  );
}
