"use client";

import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";

import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import TextAreaType from "@/components/form/TextAreaType";
import ImagePicker from "@/components/modal/imagePicker.comp";
import VideoPicker from "@/components/modal/videoPicker.comp";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { COURSE_LEVEL, DISCOUNT_TYPE, UPLOAD_SOURCE } from "@/constant/core";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { errorToast } from "@/lib/helper";
import {
  useAddEditCourseFormHandlerForAdmin,
  useGetActiveCategoryListsForAdmin,
  useGetInstructorListsForAdmin,
} from "@/hooks/admin/course.hook";
import SectionCompForAdmin from "@/section/admin/course/SectionCompForAdmin";
import { HelpCircle, X } from "lucide-react";
import { IoIosAdd } from "react-icons/io";
import QuizComp from "@/section/user/course/QuizComp";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];

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
  { value: DISCOUNT_TYPE.PERCENTAGE, label: "Persentage" },
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

export default function CreateCourse() {
  const [activeTab, setActiveTab] = useState<any>(1);
  const [courseId, setCourseId] = useState<any>("");

  const [lists, setLists] = useState<any>([
    {
      id: 1,
      list: "",
    },
  ]);

  const { t } = useTranslation();
  const [openForThumbnailImage, setOpenForThumbnailImage] = useState(false);
  const [openForVideo, setOpenForVideo] = useState(false);

  const { data: categoryLists, isLoading: isCategoryListLoading } =
    useGetActiveCategoryListsForAdmin();

  const { data: instructorLists, isLoading: isInstructorListsLoding } =
    useGetInstructorListsForAdmin();

  const [openForCoverImage, setOpenForCoverImage] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

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
  } = useAddEditCourseFormHandlerForAdmin();

  const selectedCategory = form.watch("category_id") || {};
  const discountStatusValue = form.watch("discount_status") || {};
  const discountTypeValue = form.watch("discount_type") || {};
  const videoUploadSource = form.watch("video_upload_source") || {};
  const price = form.watch("price");
  const discountValue = form.watch("discount_value");

  useEffect(() => {
    if (
      discountTypeValue?.value == DISCOUNT_TYPE.AMOUNT &&
      price &&
      discountValue
    ) {
      if (parseFloat(price) < parseFloat(discountValue)) {
        form.setValue("discount_value", "");
        errorToast(`Discount Value Cannot be Greater than ${price}`);
      }
    }
  }, [discountValue, discountTypeValue?.value, price]);

  useEffect(() => {
    form.setValue("discount_type", {});
    form.setValue("discount_value", "");
  }, [discountStatusValue?.value]);

  useEffect(() => {
    if (categoryLists?.data?.length === 0) {
      return;
    }
    let newOtions = categoryLists?.data?.map((item: any) => ({
      label: item.name,
      value: item.id,
      subCategoryOptions: item.SubCategory,
    }));
    setCategoryOptions(newOtions);
  }, [categoryLists?.data]);

  useEffect(() => {
    if (!instructorLists?.data || instructorLists?.data?.length === 0) {
      return;
    }
    let newOtions = instructorLists?.data?.map((item: any) => ({
      label: `${item.first_name} ${item.last_name}`,
      value: item.id,
    }));
    setInstructorOptions(newOtions);
  }, [instructorLists?.data]);

  useEffect(() => {
    if (!selectedCategory?.value) {
      return;
    }
    let newSubOtions = selectedCategory.subCategoryOptions?.map(
      (item: any) => ({
        label: item.name,
        value: item.id,
      })
    );

    setSubCategoryOptions(newSubOtions);
  }, [selectedCategory?.value]);

  useEffect(() => {
    if (!isSuccess || !courseDetails?.data?.id) {
      return;
    }
    setActiveTab((prev: any) => prev + 1);
  }, [isSuccess]);

  useEffect(() => {
    if (!courseDetails?.data?.id) {
      return;
    }
    setCourseId(courseDetails?.data?.id);
  }, [courseDetails?.data?.id]);

  const handleBasicInfo = (data: any) => {
    let value: any = {
      name: data.name,
      short_description: data.short_description,
      description: data.description,
      private_status: data.private_status?.value,
      course_level: data.course_level?.value,
      is_free: data.is_free?.value,
      discount_status: data.discount_status?.value,
      discount_type: data.discount_type?.value,
      discount_value: data.discount_value ? parseFloat(data.discount_value) : 0,
      category_id: data.category_id?.value,
      sub_category_id: data.sub_category_id?.value || null,
      duration: parseFloat(data.duration),
      price: parseFloat(data.price),
      instructorId: data.instructorId?.value,
      what_you_will_learn: data.what_you_will_learn
        ?.map((item: any) => item?.list)
        .filter((list: any) => list?.trim() !== "")
        .join(",,,"),
      requirments: data.requirments,
    };
    if (courseId) {
      value = {
        ...value,
        id: courseId,
      };
    }
    handleCourseSettings(value);
  };

  const handleMediaInfo = (data: any) => {
    if (!courseId) {
      setActiveTab(1);
      return;
    }
    let value = {
      thumbnail_link: thumbnailImageId,
      cover_image_link: coverImageId,
      demo_video: data.demo_video,
      id: courseId,
      video_upload_source: data.video_upload_source?.value,
    };

    if (data.video_upload_source?.value == UPLOAD_SOURCE.LOCAL) {
      value = { ...value, demo_video: `${videoId}` };
    }

    handleCourseSettings(value);
  };

  const handleSeoInfo = (data: any) => {
    if (!courseId) {
      setActiveTab(1);
      return;
    }
    let value = {
      meta_description: data?.meta_description,
      meta_title: data?.meta_title,
      meta_keyword: data.meta_keyword,
      id: courseId,
    };

    handleCourseSettings(value);
  };

  const addItem = () => {
    let maxId = 0;
    maxId = lists?.length
      ? lists.reduce(
          (max: number, item: any) => (item.id > max ? item.id : max),
          lists[0].id
        )
      : 0;

    setLists([
      ...lists,
      {
        id: maxId + 1,
        list: "",
      },
    ]);
  };

  const removeItem = (item: any) => {
    const updatedItems = lists.filter((data: any) => data.id != item.id);
    setLists(updatedItems);

    const itemIndex = lists.findIndex((data: any) => data.id == item.id);
    if (itemIndex != -1) {
      const fieldName = `what_you_will_learn[${item.id}]`;
      form.setValue(`${fieldName}.list`, "");
    }
  };
  return (
    <>
      <div className="mb-5">
        <div className="inline-block w-full">
          <ul className="mb-3 flex flex-wrap border-b border-gray-200 text-center dark:border-gray-700 ">
            {tabSections.map((item: any) => (
              <li key={item.id}>
                <button
                  className={`${
                    activeTab === item.id
                      ? "border-b-2 border-cyan-600 text-cyan-600"
                      : ""
                  }
                 flex cursor-pointer items-center justify-center gap-x-2 rounded-t-lg p-4  text-sm font-medium first:ml-0  hover:border-b-2 focus:outline-none focus:!ring-0  disabled:cursor-not-allowed disabled:text-gray-400 dark:border-cyan-500 dark:text-cyan-500 disabled:dark:text-gray-500`}
                  onClick={() => setActiveTab(item.id)}
                  disabled={item.id !== 1 && !courseId}
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
            <div className="mb-5">
              {activeTab === 1 && (
                <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
                  {isCategoryListLoading || isInstructorListsLoding ? (
                    <FormSkelation />
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleBasicInfo)}
                        className="space-y-4"
                      >
                        <div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <InputType
                              form={form}
                              formName={"name"}
                              formLabel={"Course Name"}
                              formPlaceholder={"Enter Course Name"}
                              formDescription={null}
                              isErrorMessageShow={false}
                            />

                            <InputType
                              form={form}
                              formName={"duration"}
                              type={"number"}
                              formLabel={"Course Duration"}
                              formPlaceholder={"Enter Course Duration"}
                              formDescription={null}
                              isErrorMessageShow={false}
                            />

                            <InputType
                              form={form}
                              formName={"price"}
                              type={"number"}
                              formLabel={"Course Price"}
                              formPlaceholder={"Enter Course Price"}
                              formDescription={null}
                              isErrorMessageShow={false}
                            />

                            <SelectType
                              form={form}
                              formName={"private_status"}
                              formLabel={"Course Private Status"}
                              isMultipleSelect={false}
                              selectOptions={optionsForPrivateStatus}
                              formDescription={null}
                              isErrorMessageShow={false}
                              classNamePrefix={"lms-react"}
                            />
                            <SelectType
                              form={form}
                              formName={"course_level"}
                              formLabel={"Course Level"}
                              isMultipleSelect={false}
                              selectOptions={coursesLevelOptions}
                              formDescription={null}
                              isErrorMessageShow={false}
                              classNamePrefix={"lms-react"}
                            />

                            <SelectType
                              form={form}
                              formName={"is_free"}
                              formLabel={"Is Free?"}
                              isMultipleSelect={false}
                              selectOptions={isFreeOptions}
                              formDescription={null}
                              isErrorMessageShow={false}
                              classNamePrefix={"lms-react"}
                            />
                            <SelectType
                              form={form}
                              formName={"discount_status"}
                              formLabel={"Discount Status"}
                              isMultipleSelect={false}
                              selectOptions={isDiscountStatusOptions}
                              formDescription={null}
                              isErrorMessageShow={false}
                              classNamePrefix={"lms-react"}
                            />
                            <SelectType
                              form={form}
                              formName={"discount_type"}
                              formLabel={"Discount Type"}
                              isMultipleSelect={false}
                              selectOptions={discountTypeOptions}
                              formDescription={null}
                              isErrorMessageShow={false}
                              classNamePrefix={"lms-react"}
                              isDisabled={!discountStatusValue.value}
                            />
                            <InputType
                              form={form}
                              formName={"discount_value"}
                              type={"number"}
                              formLabel={`Discount Value ${
                                discountTypeValue.value ==
                                DISCOUNT_TYPE.PERCENTAGE
                                  ? "(%)"
                                  : ""
                              }`}
                              formPlaceholder={"Enter Discount Value"}
                              formDescription={null}
                              isErrorMessageShow={false}
                              disabled={!discountStatusValue.value}
                            />
                            <SelectType
                              form={form}
                              formName={"instructorId"}
                              formLabel={"Instructor"}
                              isMultipleSelect={false}
                              selectOptions={instructorOptions}
                              formDescription={null}
                              isErrorMessageShow={false}
                              classNamePrefix={"lms-react"}
                            />
                            <SelectType
                              form={form}
                              formName={"category_id"}
                              formLabel={"Category"}
                              isMultipleSelect={false}
                              selectOptions={categoryOptions}
                              formDescription={null}
                              isErrorMessageShow={false}
                              classNamePrefix={"lms-react"}
                            />
                            <SelectType
                              form={form}
                              formName={"sub_category_id"}
                              formLabel={"Sub Category"}
                              isMultipleSelect={false}
                              selectOptions={subCategoryOptions}
                              formDescription={null}
                              isErrorMessageShow={false}
                              classNamePrefix={"lms-react"}
                              isDisabled={
                                subCategoryOptions.length === 0 ? true : false
                              }
                            />
                            <TextAreaType
                              form={form}
                              formName={"short_description"}
                              formLabel={"Course Short Description"}
                              formPlaceholder={"Enter Course Short Description"}
                              formDescription={null}
                              isErrorMessageShow={false}
                            />
                            <TextAreaType
                              form={form}
                              formName={"description"}
                              formLabel={"Course Description"}
                              formPlaceholder={"Enter Course Description"}
                              formDescription={null}
                              isErrorMessageShow={false}
                            />
                            <TextAreaType
                              form={form}
                              formName={"requirments"}
                              formLabel={"Requirments"}
                              formPlaceholder={"Enter Requirments"}
                              formDescription={null}
                              isErrorMessageShow={false}
                            />
                            <div className="w-full">
                              <div className="flex items-center justify-between">
                                <label className=" text-sm">
                                  {t(`What You Will Learn`)}
                                </label>

                                <button
                                  type="button"
                                  className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full"
                                  onClick={() => addItem()}
                                >
                                  <IoIosAdd size={20} />
                                </button>
                              </div>
                              {lists.map((item: any) => {
                                return (
                                  <div
                                    className="mb-2 flex w-full items-center gap-4"
                                    key={item.id}
                                  >
                                    <InputType
                                      form={form}
                                      formName={`what_you_will_learn[${item.id}].list`}
                                      formLabel={""}
                                      formPlaceholder={"Add Lists Item"}
                                      formDescription={null}
                                      isErrorMessageShow={false}
                                      className="!w-full"
                                    />
                                    {lists.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeItem(item)}
                                      >
                                        <X className="h-4 w-4 text-red-600" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <LoaderButton
                          buttonText={`Next`}
                          isLoading={isLoading}
                          loaderText={"Creating..."}
                        />
                      </form>
                    </Form>
                  )}
                </div>
              )}
            </div>
            <div className="mb-5">
              {activeTab === 2 && (
                <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
                  {isCategoryListLoading ? (
                    <FormSkelation />
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleMediaInfo)}
                        className="space-y-4"
                      >
                        <div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <ImagePicker
                              open={openForThumbnailImage}
                              name={"Thumbnail Image"}
                              setopen={setOpenForThumbnailImage}
                              uploadImageUrl={uploadImageUrlForThumbnailImage}
                              setuploadImageUrl={
                                setUploadImageUrlForThumbnailImage
                              }
                              setId={setThumbnailImageId}
                            />

                            <ImagePicker
                              open={openForCoverImage}
                              name={"Cover Image"}
                              setopen={setOpenForCoverImage}
                              uploadImageUrl={uploadImageUrlForCoverImage}
                              setuploadImageUrl={setUploadImageUrlForCoverImage}
                              setId={setCoverImageId}
                            />
                            <SelectType
                              form={form}
                              formName={"video_upload_source"}
                              formLabel={"Video Upload Source"}
                              isMultipleSelect={false}
                              selectOptions={videoSourceOptions}
                              formDescription={null}
                              isErrorMessageShow={false}
                              classNamePrefix={"lms-react"}
                            />
                            {videoUploadSource?.label &&
                              (videoUploadSource?.value ==
                              UPLOAD_SOURCE.LOCAL ? (
                                <VideoPicker
                                  open={openForVideo}
                                  name={"Upload Video"}
                                  setopen={setOpenForVideo}
                                  uploadVideoUrl={uploadVideoUrl}
                                  setuploadVideoUrl={setUploadVideoUrl}
                                  setId={setVideoId}
                                  inputText={`Upload Video`}
                                />
                              ) : (
                                <InputType
                                  form={form}
                                  formName={"demo_video"}
                                  formLabel={`${videoUploadSource?.label} Link`}
                                  formPlaceholder={`Enter ${videoUploadSource?.label} Link`}
                                  formDescription={null}
                                  isErrorMessageShow={false}
                                />
                              ))}
                          </div>
                        </div>

                        <div className="flex gap-x-4">
                          <Button
                            type="button"
                            color="gray"
                            onClick={() => setActiveTab(1)}
                          >
                            Previous
                          </Button>
                          <LoaderButton
                            buttonText={`Next`}
                            isLoading={isLoading}
                            loaderText={"Creating..."}
                          />
                        </div>
                      </form>
                    </Form>
                  )}
                </div>
              )}
            </div>
            <div className="mb-5">
              {activeTab === 3 && (
                <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
                  {isCategoryListLoading ? (
                    <FormSkelation />
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleSeoInfo)}
                        className="space-y-4"
                      >
                        <div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <InputType
                              form={form}
                              formName={"meta_title"}
                              formLabel={"Meta Title"}
                              formPlaceholder={"Enter Meta Title"}
                              formDescription={null}
                              isErrorMessageShow={false}
                            />

                            <InputType
                              form={form}
                              formName={"meta_keyword"}
                              formLabel={"Meta Keyword"}
                              formPlaceholder={"Enter Meta Keyword"}
                              formDescription={null}
                              isErrorMessageShow={false}
                            />

                            <TextAreaType
                              form={form}
                              formName={"meta_description"}
                              formLabel={"Course Meta Description"}
                              formPlaceholder={"Enter Course Meta Description"}
                              formDescription={null}
                              isErrorMessageShow={false}
                            />
                          </div>
                        </div>
                        <div className="flex gap-x-2">
                          <Button
                            type="button"
                            color="gray"
                            onClick={() => setActiveTab(2)}
                          >
                            Previous
                          </Button>
                          <LoaderButton
                            buttonText={`Next`}
                            isLoading={isLoading}
                            loaderText={"Creating..."}
                          />
                        </div>
                      </form>
                    </Form>
                  )}
                </div>
              )}
            </div>
            <div className="mb-5">
              {activeTab === 4 && (
                <SectionCompForAdmin
                  courseId={courseId}
                  setActiveTab={setActiveTab}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
