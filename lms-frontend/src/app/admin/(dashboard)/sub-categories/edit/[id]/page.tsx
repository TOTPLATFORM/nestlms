"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  useGetActiveCategoryLists,
  useGetSubCategoryDetails,
  useUpdateSubCategoriesFormHandler,
} from "@/hooks/admin/category.hook";
import { statusValueHandler } from "@/lib/helper";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];

export default function SubCatEdit({ params }: { params: { id: any } }) {
  const { t } = useTranslation();

  const [categoryOptions, setCategoryOptions] = useState<any>([]);

  const { data: categoryLists, isLoading: isCategoryListLoading } =
    useGetActiveCategoryLists();

  const { data: catDetails, isLoading: isDetailsLoading } =
    useGetSubCategoryDetails(params?.id) || {};

  const { form, handleUpdateSubCategories, isLoading } =
    useUpdateSubCategoriesFormHandler();

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

  useEffect(() => {
    if (!catDetails?.data) {
      return;
    }
    form.setValue("name", catDetails?.data?.name);
    form.setValue("id", catDetails?.data?.id);

    form.setValue("logo", catDetails?.data?.logo);
    form.setValue(
      "status",
      statusValueHandler(catDetails?.data?.status, options)
    );
    form.setValue("category_id", {
      label: catDetails?.data?.category?.name,
      value: catDetails?.data?.category?.id,
    });
  }, [catDetails?.data]);

  useEffect(() => {
    if (!categoryLists?.data) return;
    if (categoryLists?.data?.list?.length === 0) {
      return;
    }
    let newOtions = categoryLists?.data?.list.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
    setCategoryOptions(newOtions);
  }, [categoryLists?.data?.list]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton
            title="Back To Sub Categories"
            slug={`/admin/sub-categories`}
          />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Edit Sub Category`)}
          </h2>
        </div>
      </div>
      {isCategoryListLoading || isDetailsLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateSubCategories)}
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
