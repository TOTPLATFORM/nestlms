"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  useAddSubCategoriesFormHandler,
  useGetActiveCategoryLists,
} from "@/hooks/admin/category.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];

export default function CreateSubCategory() {
  const { t } = useTranslation();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { form, handleAddSubCategories, isLoading } =
    useAddSubCategoriesFormHandler();

  const { data: categoryLists, isLoading: isCategoryListLoading } =
    useGetActiveCategoryLists();

  useEffect(() => {
    if (categoryLists?.data?.list?.length === 0) {
      return;
    }
    let newOtions = categoryLists?.data?.list.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
    setCategoryOptions(newOtions);
  }, [categoryLists?.data?.list]);

  const CategoryIconLabel = () => {
    return (
      <div className="mb-2.5 mt-2 flex items-center gap-x-2">
        <p>{t(`Sub Category Icon`)}</p>
        <a
          href="https://fontawesome.com/icons"
          target="_blank"
          className="text-sky-800 underline"
        >
          {t(`Fontawesome Icon`)}
        </a>
      </div>
    );
  };

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton
            title="Back To Sub Categories"
            slug={`/admin/sub-categories`}
          />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Create Sub Category`)}
          </h2>
        </div>
      </div>
      {isCategoryListLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddSubCategories)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <InputType
                form={form}
                formName={"name"}
                formLabel={"Sub Category Name"}
                formPlaceholder={"Enter Sub Category Name"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <InputType
                form={form}
                formName={"logo"}
                formLabel={CategoryIconLabel()}
                formPlaceholder={"Enter an icon calss"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <SelectType
                form={form}
                formName={"category_id"}
                formLabel={"Select Category"}
                isMultipleSelect={false}
                selectOptions={categoryOptions}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />

              <SelectType
                form={form}
                formName={"status"}
                formLabel={"Sub Category Status"}
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
