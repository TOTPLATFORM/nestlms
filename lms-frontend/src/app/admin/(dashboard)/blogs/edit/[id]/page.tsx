"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import DynamicAddRemoveLists from "@/components/form/DynamicAddRemoveLists";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import SwitchBoxType from "@/components/form/SwitchBoxType";
import TextAreaType from "@/components/form/TextAreaType";
import ImagePicker from "@/components/modal/imagePicker.comp";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useAddBlogFormHandler,
  useGetAllCategoriesForBlogsForAdmin,
  useGetAllTagsForBlogsForAdmin,
  useGetBlogDetailsForAdmin,
  useUpdateBlogFormHandler,
} from "@/hooks/admin/blogs.hook";
import { statusValueHandler } from "@/lib/helper";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];
export default function EditBlog({ params }: { params: { id: any } }) {
  const { t } = useTranslation();

  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [tagOptions, setTagOptions] = useState<any>([]);
  const [openForImage, setOpenForImage] = useState(false);
  const [openForImageForSecond, setOpenForImageForSecond] = useState(false);
  const [openForImageForThird, setOpenForImageForThird] = useState(false);

  const { data: blogDetails, isLoading: isDetailsLoading } =
    useGetBlogDetailsForAdmin(params?.id) || {};

  const { data: categoryLists, isLoading: isCategoryLoading } =
    useGetAllCategoriesForBlogsForAdmin();
  const { data: tagLists, isLoading: isTagLoading } =
    useGetAllTagsForBlogsForAdmin();
  const {
    form,
    handleSettings,
    isLoading,
    setImageId,
    imageId,
    uploadImageUrl,
    setUploadImageUrl,
    imageIdForSecond,
    setImageIdForSecond,
    uploadImageUrlForSecond,
    setUploadImageUrlForSecond,
    imageIdForThird,
    setImageIdForThird,
    uploadImageUrlForThird,
    setUploadImageUrlForThird,
  } = useUpdateBlogFormHandler();

  useEffect(() => {
    if (!blogDetails?.data || !blogDetails?.success) {
      return;
    }
    form.setValue("title", blogDetails?.data?.title);
    setUploadImageUrl(blogDetails?.data?.thumbnail_link ?? null);
    setUploadImageUrlForSecond(blogDetails?.data?.cover_image_link ?? null);
    setUploadImageUrlForThird(blogDetails?.data?.meta_img ?? null);

    form.setValue("description", blogDetails?.data?.description);
    form.setValue(
      "status",
      statusValueHandler(blogDetails?.data?.status, options)
    );
    form.setValue("meta_title", blogDetails?.data?.meta_title);
    form.setValue("meta_description", blogDetails?.data?.meta_description);
    form.setValue("meta_keyword", blogDetails?.data?.meta_keyword);
  }, [blogDetails?.data]);

  useEffect(() => {
    if (!categoryLists || categoryLists?.data?.length === 0) {
      return;
    }
    const newOption = categoryLists?.data?.map((cat: any) => ({
      ...cat,
      value: cat.id,
      label: cat.name,
    }));
    setCategoryOptions(newOption);
    return () => {
      setCategoryOptions([]);
    };
  }, [categoryLists?.data]);

  useEffect(() => {
    if (!tagLists || tagLists?.data?.length === 0) {
      return;
    }
    const newOption = tagLists?.data?.map((tag: any) => ({
      ...tag,
      value: tag.name,
      label: tag.name,
    }));
    setTagOptions(newOption);

    return () => {
      setTagOptions([]);
    };
  }, [tagLists?.data]);

  useEffect(() => {
    if (categoryOptions?.length == 0 || !blogDetails?.data?.blogCategoryId) {
      return;
    }

    form.setValue(
      "blog_category_id",
      categoryOptions.find(
        (item: any) => item?.value == blogDetails?.data?.blogCategoryId
      )
    );
  }, [categoryOptions, blogDetails?.data]);

  useEffect(() => {
    if (tagOptions?.length == 0 || !blogDetails?.data?.tag) {
      return;
    }
    let newOption =
      tagOptions.filter((obj: any) =>
        blogDetails?.data?.tag.split(",").some((item: any) => obj.value == item)
      ) || [];

    form.setValue("tag", newOption);
  }, [tagOptions, blogDetails?.data]);

  useEffect(() => {
    if (!imageId) {
      return;
    }
    form.setValue("thumbnail_link", imageId);
  }, [imageId]);

  useEffect(() => {
    if (!imageIdForSecond) {
      return;
    }
    form.setValue("cover_image_link", imageIdForSecond);
  }, [imageIdForSecond]);

  useEffect(() => {
    if (!imageIdForThird) {
      return;
    }
    form.setValue("meta_img", imageIdForThird);
  }, [imageIdForThird]);

  const updateBlogPostHandler = (value: any) => {
    handleSettings(value, params?.id);
  };

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2 border-b pb-6">
        <div>
          <BackButton title="Back To Blogs" slug={`/admin/blogs`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Edit Blog`)}
          </h2>
        </div>
      </div>

      <div>
        {isCategoryLoading || isTagLoading || isDetailsLoading ? (
          <FormSkelation />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(updateBlogPostHandler)}
              className="space-y-4"
            >
              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputType
                    form={form}
                    formName={"title"}
                    formLabel={"Blog Title"}
                    formPlaceholder={"Enter Blog Title"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />

                  <SelectType
                    form={form}
                    formName={"status"}
                    formLabel={"Blog Status"}
                    isMultipleSelect={false}
                    selectOptions={options}
                    formDescription={null}
                    isErrorMessageShow={false}
                    classNamePrefix={"lms-react"}
                  />
                  <SelectType
                    form={form}
                    formName={"blog_category_id"}
                    formLabel={"Select Category"}
                    isMultipleSelect={false}
                    selectOptions={categoryOptions}
                    formDescription={null}
                    isErrorMessageShow={false}
                    classNamePrefix={"lms-react"}
                  />
                  <SelectType
                    form={form}
                    formName={"tag"}
                    formLabel={"Select Tags"}
                    isMultipleSelect={true}
                    selectOptions={tagOptions}
                    formDescription={null}
                    isErrorMessageShow={false}
                    classNamePrefix={"lms-react"}
                  />
                  <TextAreaType
                    form={form}
                    formName={"description"}
                    formLabel={"Blog Description"}
                    formPlaceholder={"Enter Blog Description"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />
                </div>

                <div>
                  <h4 className="my-4 text-lg font-bold">
                    {t(`Blog Media Settings`)}
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ImagePicker
                    open={openForImage}
                    name={"Thumbnail Image"}
                    setopen={setOpenForImage}
                    uploadImageUrl={uploadImageUrl}
                    setuploadImageUrl={setUploadImageUrl}
                    setId={setImageId}
                  />

                  <ImagePicker
                    open={openForImageForSecond}
                    name={"Cover Image"}
                    setopen={setOpenForImageForSecond}
                    uploadImageUrl={uploadImageUrlForSecond}
                    setuploadImageUrl={setUploadImageUrlForSecond}
                    setId={setImageIdForSecond}
                  />
                </div>
                <div>
                  <h4 className="my-4 text-lg font-bold">
                    {t(`Seo Settings`)}
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputType
                    form={form}
                    formName={"meta_title"}
                    formLabel={"Meta Title"}
                    formPlaceholder={"Enter Meta Title"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />
                  <TextAreaType
                    form={form}
                    formName={"meta_description"}
                    formLabel={"Meta Description"}
                    formPlaceholder={"Enter Meta Description"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />

                  <TextAreaType
                    form={form}
                    formName={"meta_keyword"}
                    formLabel={"Meta Keywords"}
                    formPlaceholder={"Enter Meta Keywords"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />
                  <ImagePicker
                    open={openForImageForThird}
                    name={"Meta Image"}
                    setopen={setOpenForImageForThird}
                    uploadImageUrl={uploadImageUrlForThird}
                    setuploadImageUrl={setUploadImageUrlForThird}
                    setId={setImageIdForThird}
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
      </div>
    </div>
  );
}
