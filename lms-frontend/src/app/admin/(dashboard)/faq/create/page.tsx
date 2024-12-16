"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import TextAreaType from "@/components/form/TextAreaType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import { useAddFaqFormHandler } from "@/hooks/admin/faq.hook";
import React from "react";
import { useTranslation } from "react-i18next";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];

const typeOptions = [{ value: 0, label: "Landing Page" }];

export default function CreateFaq() {
  const { t } = useTranslation();

  const { form, handleAddFaq, isLoading } = useAddFaqFormHandler();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton title="Back To FAQ" slug={`/admin/faq`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Create FAQ`)}
          </h2>
        </div>
      </div>
      {isLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddFaq)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <SelectType
                form={form}
                formName={"type"}
                formLabel={"FAQ For"}
                isMultipleSelect={false}
                selectOptions={typeOptions}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />

              <InputType
                form={form}
                formName={"question"}
                formLabel={"Question"}
                formPlaceholder={"Enter Question"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <TextAreaType
                form={form}
                formName={"answer"}
                formLabel={`Answer`}
                formPlaceholder={"Enter Answer"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <SelectType
                form={form}
                formName={"status"}
                formLabel={"Status"}
                isMultipleSelect={false}
                selectOptions={options}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
            </div>
            <LoaderButton
              buttonText={`Create`}
              isLoading={isLoading}
              loaderText={"Creating..."}
            />
          </form>
        </Form>
      )}
    </div>
  );
}
