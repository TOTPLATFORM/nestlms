"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAddCategoriesFormHandlerForBlogs } from "@/hooks/admin/blogs.hook";
import { useAddCategoriesFormHandler } from "@/hooks/admin/category.hook";
import React from "react";
import { useTranslation } from "react-i18next";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];

export default function CreateCategoryForBlog() {
  const { t } = useTranslation();

  const { form, handleAddCategories, isLoading } =
    useAddCategoriesFormHandlerForBlogs();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton
            title="Back To Categories"
            slug={`/admin/blogs/categories`}
          />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Create Category`)}
          </h2>
        </div>
      </div>
      {isLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddCategories)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <InputType
                form={form}
                formName={"name"}
                formLabel={"Category Name"}
                formPlaceholder={"Enter Category Name"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <SelectType
                form={form}
                formName={"status"}
                formLabel={"Category Status"}
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
