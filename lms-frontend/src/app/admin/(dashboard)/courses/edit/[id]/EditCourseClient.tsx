'use client';

import { HiUserCircle } from "react-icons/hi";
import { IoIosAdd } from "react-icons/io";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import TextAreaType from "@/components/form/TextAreaType";
import ImagePicker from "@/components/modal/imagePicker.comp";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { COURSE_LEVEL, DISCOUNT_TYPE, UPLOAD_SOURCE } from "@/constant/core";
import { errorToast } from "@/lib/helper";
import SectionCompForAdmin from "@/section/admin/course/SectionCompForAdmin";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useAddEditCourseFormHandlerForAdmin,
  useGetActiveCategoryListsForAdmin,
  useGetCourseDetailsForAdmin,
  useGetInstructorListsForAdmin,
} from "@/hooks/admin/course.hook";
import { CourseDetails, EditCourseClientProps, FormHandlerReturn } from './types';

const optionsForPrivateStatus = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const isFreeOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const isDiscountStatusOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const discountTypeOptions = [
  { value: DISCOUNT_TYPE.AMOUNT, label: "Amount" },
  { value: DISCOUNT_TYPE.PERCENTAGE, label: "Percentage" },
];

const coursesLevelOptions = [
  { value: COURSE_LEVEL.BEGINNER, label: "Beginner" },
  { value: COURSE_LEVEL.INTERMEDIATE, label: "Intermediate" },
  { value: COURSE_LEVEL.ADVANCED, label: "Advanced" },
];

const videoSourceOptions = [
  { value: UPLOAD_SOURCE.LOCAL, label: "Local" },
  { value: UPLOAD_SOURCE.VIMEO, label: "Vimeo" },
  { value: UPLOAD_SOURCE.YOUTUBE, label: "Youtube" },
];

const tabSections = [
  {
    id: 1,
    name: "Basic Information",
    icon: HiUserCircle,
  },
  {
    id: 2,
    name: "Media Settings",
    icon: HiUserCircle,
  },
  {
    id: 3,
    name: "Seo Settings",
    icon: HiUserCircle,
  },
  {
    id: 4,
    name: "Curriculum",
    icon: HiUserCircle,
  },
];

export default async function EditCourseClient({ params }: EditCourseClientProps) {
  const { id } = params;
  const formHandler = useAddEditCourseFormHandlerForAdmin() as unknown as FormHandlerReturn;
  const {
    data: courseDetails,
    form,
    handleCourseSettings,
    isLoading,
    thumbnailImageId,
    setThumbnailImageId,
    setUploadImageUrlForThumbnailImage,
    uploadImageUrlForThumbnailImage,
    uploadImageUrlForCoverImage,
    setUploadImageUrlForCoverImage,
    setCoverImageId,
    coverImageId,
    videoId,
    setVideoId,
    uploadVideoUrl,
    setUploadVideoUrl,
    isSuccess,
  } = formHandler;

  const [activeTab, setActiveTab] = useState<number>(1);
  const [courseId, setCourseId] = useState<string>("");

  const { data: courseDetail, isLoading: isDetailsLoading } =
    useGetCourseDetailsForAdmin(id) || {};

  const { t } = useTranslation();
  const [openForThumbnailImage, setOpenForThumbnailImage] = useState(false);
  const [openForVideo, setOpenForVideo] = useState(false);

  const { data: categoryLists, isLoading: isCategoryListLoading } =
    useGetActiveCategoryListsForAdmin();

  const { data: instructorLists, isLoading: isInstructorListsLoding } =
    useGetInstructorListsForAdmin();

  const [openForCoverImage, setOpenForCoverImage] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<Array<any>>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<Array<any>>([]);
  const [instructorOptions, setInstructorOptions] = useState<Array<any>>([]);

  const [lists, setLists] = useState<Array<{ id: number; list: string }>>([
    {
      id: 1,
      list: "",
    },
  ]);

  const handleBasicInfo = async (data: any) => {
    const value = {
      name: data.name,
      duration: parseFloat(data.duration),
      course_level: data.course_level?.value,
      category_id: data.category_id?.value,
      description: data.description,
      id: courseId,
    };
    await handleCourseSettings(value);
    setActiveTab(2);
  };

  const handleMediaInfo = async (data: any) => {
    const value = {
      thumbnail_link: thumbnailImageId,
      cover_image_link: coverImageId,
      id: courseId,
    };
    await handleCourseSettings(value);
    setActiveTab(3);
  };

  const handleSeoInfo = async (data: any) => {
    const value = {
      meta_title: data.meta_title,
      meta_keyword: data.meta_keyword,
      meta_description: data.meta_description,
      id: courseId,
    };
    await handleCourseSettings(value);
    setActiveTab(4);
  };

  useEffect(() => {
    if (courseDetail?.data?.id && form) {
      setCourseId(courseDetail.data.id);
      form.setValue("id", courseDetail.data.id);
      form.setValue("name", courseDetail.data.name);
      form.setValue("duration", courseDetail.data.duration);
      form.setValue("description", courseDetail.data.description);
      form.setValue("course_level", coursesLevelOptions.find(
        (item) => item.value === courseDetail.data.course_level
      ) || {});
      form.setValue("category_id", {
        value: courseDetail.data.category?.id,
        label: courseDetail.data.category?.name,
      });
    }
  }, [courseDetail?.data, form]);

  useEffect(() => {
    if (categoryLists?.data?.length > 0) {
      const options = categoryLists.data.map((item: any) => ({
        label: item.name,
        value: item.id,
        subCategoryOptions: item.SubCategory,
      }));
      setCategoryOptions(options);
    }
  }, [categoryLists?.data]);

  const selectedCategory = form?.watch("category_id") || {};
  const discountStatusValue = form?.watch("discount_status") || {};
  const discountTypeValue = form?.watch("discount_type") || {};
  const videoUploadSource = form?.watch("video_upload_source") || {};
  const price = form?.watch("price");
  const discountValue = form?.watch("discount_value");

  if (!form) return null;

  return (
    <div className="mb-5">
      <div className="inline-block w-full">
        <ul className="mb-3 flex flex-wrap border-b border-gray-200 text-center dark:border-gray-700">
          {tabSections.map((item) => (
            <li key={item.id}>
              <button
                className={`${
                  activeTab === item.id
                    ? "border-b-2 border-cyan-600 text-cyan-600"
                    : ""
                }
                flex cursor-pointer items-center justify-center gap-x-2 rounded-t-lg p-4 text-sm font-medium first:ml-0 hover:border-b-2 focus:outline-none focus:!ring-0 disabled:cursor-not-allowed disabled:text-gray-400 dark:border-cyan-500 dark:text-cyan-500 disabled:dark:text-gray-500`}
                onClick={() => setActiveTab(item.id)}
                disabled={item.id !== 1 && !courseId}
                aria-label={item.name}
              >
                <span>
                  <item.icon size={22} />
                </span>
                <span>{t(item.name)}</span>
              </button>
            </li>
          ))}
        </ul>
        <div>
          {activeTab === 1 && (
            <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4 md:p-8">
              {isCategoryListLoading || isDetailsLoading ? (
                <FormSkelation />
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleBasicInfo)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <InputType
                        form={form}
                        formName="name"
                        formLabel="Course Name"
                        formPlaceholder="Enter Course Name"
                        formDescription={null}
                        isErrorMessageShow={false}
                      />
                      <InputType
                        form={form}
                        formName="duration"
                        type="number"
                        formLabel="Course Duration"
                        formPlaceholder="Enter Course Duration"
                        formDescription={null}
                        isErrorMessageShow={false}
                      />
                      <SelectType
                        form={form}
                        formName="course_level"
                        formLabel="Course Level"
                        isMultipleSelect={false}
                        selectOptions={coursesLevelOptions}
                        formDescription={null}
                        isErrorMessageShow={false}
                        classNamePrefix="lms-react"
                      />
                      <SelectType
                        form={form}
                        formName="category_id"
                        formLabel="Category"
                        isMultipleSelect={false}
                        selectOptions={categoryOptions}
                        formDescription={null}
                        isErrorMessageShow={false}
                        classNamePrefix="lms-react"
                      />
                      <TextAreaType
                        form={form}
                        formName="description"
                        formLabel="Course Description"
                        formPlaceholder="Enter Course Description"
                        formDescription={null}
                        isErrorMessageShow={false}
                      />
                    </div>
                    <LoaderButton
                      buttonText="Next"
                      isLoading={isLoading}
                      loaderText="Saving..."
                    />
                  </form>
                </Form>
              )}
            </div>
          )}
          {activeTab === 2 && (
            <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4 md:p-8">
              {isCategoryListLoading ? (
                <FormSkelation />
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleMediaInfo)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <ImagePicker
                        open={openForThumbnailImage}
                        name="Thumbnail Image"
                        setopen={setOpenForThumbnailImage}
                        uploadImageUrl={uploadImageUrlForThumbnailImage}
                        setuploadImageUrl={setUploadImageUrlForThumbnailImage}
                        setId={setThumbnailImageId}
                      />
                      <ImagePicker
                        open={openForCoverImage}
                        name="Cover Image"
                        setopen={setOpenForCoverImage}
                        uploadImageUrl={uploadImageUrlForCoverImage}
                        setuploadImageUrl={setUploadImageUrlForCoverImage}
                        setId={setCoverImageId}
                      />
                    </div>
                    <div className="flex gap-x-4">
                      <Button type="button" color="gray" onClick={() => setActiveTab(1)}>
                        Previous
                      </Button>
                      <LoaderButton
                        buttonText="Next"
                        isLoading={isLoading}
                        loaderText="Saving..."
                      />
                    </div>
                  </form>
                </Form>
              )}
            </div>
          )}
          {activeTab === 3 && (
            <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4 md:p-8">
              {isCategoryListLoading ? (
                <FormSkelation />
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSeoInfo)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <InputType
                        form={form}
                        formName="meta_title"
                        formLabel="Meta Title"
                        formPlaceholder="Enter Meta Title"
                        formDescription={null}
                        isErrorMessageShow={false}
                      />
                      <InputType
                        form={form}
                        formName="meta_keyword"
                        formLabel="Meta Keyword"
                        formPlaceholder="Enter Meta Keyword"
                        formDescription={null}
                        isErrorMessageShow={false}
                      />
                      <TextAreaType
                        form={form}
                        formName="meta_description"
                        formLabel="Course Meta Description"
                        formPlaceholder="Enter Course Meta Description"
                        formDescription={null}
                        isErrorMessageShow={false}
                      />
                    </div>
                    <div className="flex gap-x-2">
                      <Button type="button" color="gray" onClick={() => setActiveTab(2)}>
                        Previous
                      </Button>
                      <LoaderButton
                        buttonText="Next"
                        isLoading={isLoading}
                        loaderText="Saving..."
                      />
                    </div>
                  </form>
                </Form>
              )}
            </div>
          )}
          {activeTab === 4 && (
            <SectionCompForAdmin courseId={courseId} setActiveTab={setActiveTab} />
          )}
        </div>
      </div>
    </div>
  );
}
