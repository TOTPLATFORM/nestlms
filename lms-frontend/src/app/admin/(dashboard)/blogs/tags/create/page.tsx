"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAddTagFormHandlerForBlogs } from "@/hooks/admin/blogs.hook";
import React from "react";
import { useTranslation } from "react-i18next";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];

export default function CreateTagForBlog() {
  const { t } = useTranslation();

  const { form, handleAddTag, isLoading } = useAddTagFormHandlerForBlogs();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton title="Back To tags" slug={`/admin/blogs/tags`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Create Tag`)}
          </h2>
        </div>
      </div>
      {isLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddTag)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <InputType
                form={form}
                formName={"name"}
                formLabel={"Tag Name"}
                formPlaceholder={"Enter Tag Name"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <SelectType
                form={form}
                formName={"status"}
                formLabel={"Tag Status"}
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
