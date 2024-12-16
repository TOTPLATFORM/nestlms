"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import { useSendSmtpTestEmail } from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SmtpTestEmail() {
  const { t } = useTranslation();

  const { form, handleSettings, isLoading } = useSendSmtpTestEmail();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSettings)}
          className="space-y-4"
        >
          <div>
            <h4 className="mb-4 text-lg font-bold">{t(`SMTP Test Email`)}</h4>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <InputType
              form={form}
              formName={"email"}
              formLabel={"Test Email"}
              formPlaceholder={"Enter Test Email"}
              formDescription={null}
              isErrorMessageShow={false}
            />
          </div>
          <LoaderButton
            buttonText={`Send`}
            isLoading={isLoading}
            loaderText={"Loading..."}
          />
        </form>
      </Form>
    </>
  );
}
