"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  useGetCategoryDetailsForBlogs,
  useUpdateCategoriesForBlogsFormHandler,
} from "@/hooks/admin/blogs.hook";
import {
  useGetCategoryDetails,
  useUpdateCategoriesFormHandler,
} from "@/hooks/admin/category.hook";
import { statusValueHandler } from "@/lib/helper";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];

export default function CreateEdit({ params }: { params: { id: any } }) {
  const { t } = useTranslation();

  const { data: catDetails, isLoading: isDetailsLoading } =
    useGetCategoryDetailsForBlogs(params?.id) || {};

  const { form, handleUpdateCategories, isLoading } =
    useUpdateCategoriesForBlogsFormHandler();

  useEffect(() => {
    if (!catDetails?.data) {
      return;
    }
    form.setValue("name", catDetails?.data?.name);
    form.setValue("id", catDetails?.data?.id);

    form.setValue(
      "status",
      statusValueHandler(catDetails?.data?.status, options)
    );
  }, [catDetails?.data]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton
            title="Back To Categories"
            slug={`/admin/blogs/categories`}
          />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Edit Category`)}
          </h2>
        </div>
      </div>
      {isDetailsLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateCategories)}
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
