"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import DynamicAddRemoveLists from "@/components/form/DynamicAddRemoveLists";
import { InputType } from "@/components/form/InputType";
import TextAreaType from "@/components/form/TextAreaType";
import ImagePicker from "@/components/modal/imagePicker.comp";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetHowItWorksSettingsForAdmin,
  useUpdateHowItWorksUsSettingsFormHandler,
} from "@/hooks/admin/settings.hook";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosAdd } from "react-icons/io";

export default function HowItWorkSectionSettings() {
  const { t } = useTranslation();

  const [openForImage, setOpenForImage] = useState(false);
  const [openForImageForSecond, setOpenForImageForSecond] = useState(false);
  const [openForImageForThird, setOpenForImageForThird] = useState(false);
  const { data: howItWorkSettings, isLoading: isDetailsLoading } =
    useGetHowItWorksSettingsForAdmin();

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
  } = useUpdateHowItWorksUsSettingsFormHandler();

  useEffect(() => {
    if (!howItWorkSettings?.data || !howItWorkSettings?.success) {
      return;
    }
    form.setValue(
      "landing_how_it_work_first_title",
      howItWorkSettings?.data?.landing_how_it_work_first_title
    );
    setUploadImageUrl(
      howItWorkSettings?.data?.landing_how_it_work_list_first_image_url ?? null
    );
    setUploadImageUrlForSecond(
      howItWorkSettings?.data?.landing_how_it_work_list_second_image_url ?? null
    );
    setUploadImageUrlForThird(
      howItWorkSettings?.data?.landing_how_it_work_list_third_image_url ?? null
    );

    form.setValue(
      "landing_how_it_work_list_first_title",
      howItWorkSettings?.data?.landing_how_it_work_list_first_title
    );
    form.setValue(
      "landing_how_it_work_list_first_description",
      howItWorkSettings?.data?.landing_how_it_work_list_first_description
    );
    form.setValue(
      "landing_how_it_work_list_second_title",
      howItWorkSettings?.data?.landing_how_it_work_list_second_title
    );
    form.setValue(
      "landing_how_it_work_list_second_description",
      howItWorkSettings?.data?.landing_how_it_work_list_second_description
    );
    form.setValue(
      "landing_how_it_work_list_third_title",
      howItWorkSettings?.data?.landing_how_it_work_list_third_title
    );
    form.setValue(
      "landing_how_it_work_list_third_description",
      howItWorkSettings?.data?.landing_how_it_work_list_third_description
    );
  }, [howItWorkSettings?.data]);

  useEffect(() => {
    if (!imageId) {
      return;
    }
    form.setValue("landing_how_it_work_list_first_image_url", imageId);
  }, [imageId]);

  useEffect(() => {
    if (!imageIdForSecond) {
      return;
    }
    form.setValue(
      "landing_how_it_work_list_second_image_url",
      imageIdForSecond
    );
  }, [imageIdForSecond]);

  useEffect(() => {
    if (!imageIdForThird) {
      return;
    }
    form.setValue("landing_how_it_work_list_third_image_url", imageIdForThird);
  }, [imageIdForThird]);

  return (
    <>
      {isDetailsLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSettings)}
            className="space-y-4"
          >
            <div>
              <div>
                <h4 className="mb-4 text-lg font-bold">
                  {t(`How It Works Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputType
                  form={form}
                  formName={"landing_how_it_work_first_title"}
                  formLabel={"How It Works Title"}
                  formPlaceholder={"Enter How It Works Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <ImagePicker
                  open={openForImage}
                  name={"First Image"}
                  setopen={setOpenForImage}
                  uploadImageUrl={uploadImageUrl}
                  setuploadImageUrl={setUploadImageUrl}
                  setId={setImageId}
                />
                <ImagePicker
                  open={openForImageForSecond}
                  name={"Second Image"}
                  setopen={setOpenForImageForSecond}
                  uploadImageUrl={uploadImageUrlForSecond}
                  setuploadImageUrl={setUploadImageUrlForSecond}
                  setId={setImageIdForSecond}
                />
                <ImagePicker
                  open={openForImageForThird}
                  name={"Third Image"}
                  setopen={setOpenForImageForThird}
                  uploadImageUrl={uploadImageUrlForThird}
                  setuploadImageUrl={setUploadImageUrlForThird}
                  setId={setImageIdForThird}
                />

                <InputType
                  form={form}
                  formName={"landing_how_it_work_list_first_title"}
                  formLabel={"First List Title"}
                  formPlaceholder={"Enter First List Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <TextAreaType
                  form={form}
                  formName={"landing_how_it_work_list_first_description"}
                  formLabel={"First List Description"}
                  formPlaceholder={"Enter First List Description"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <InputType
                  form={form}
                  formName={"landing_how_it_work_list_second_title"}
                  formLabel={"Second List Title"}
                  formPlaceholder={"Enter Second List Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <TextAreaType
                  form={form}
                  formName={"landing_how_it_work_list_second_description"}
                  formLabel={"Second Description"}
                  formPlaceholder={"Enter Second List Description"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <InputType
                  form={form}
                  formName={"landing_how_it_work_list_third_title"}
                  formLabel={"Third List Title"}
                  formPlaceholder={"Enter Third List Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <TextAreaType
                  form={form}
                  formName={"landing_how_it_work_list_third_description"}
                  formLabel={"Third List Description"}
                  formPlaceholder={"Enter Third List Description"}
                  formDescription={null}
                  isErrorMessageShow={false}
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
    </>
  );
}
