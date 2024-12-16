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
  useGetAboutUsSettingsForAdmin,
  useUpdateAboutUsSettingsFormHandler,
} from "@/hooks/admin/settings.hook";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosAdd } from "react-icons/io";

export default function AboutUsSectionSettings() {
  const { t } = useTranslation();

  const [openForImage, setOpenForImage] = useState(false);
  const [openForImageForSecond, setOpenForImageForSecond] = useState(false);
  const [openForImageForThird, setOpenForImageForThird] = useState(false);
  const { data: aboutUsSettings, isLoading: isDetailsLoading } =
    useGetAboutUsSettingsForAdmin();

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
  } = useUpdateAboutUsSettingsFormHandler();

  useEffect(() => {
    if (!aboutUsSettings?.data || !aboutUsSettings?.success) {
      return;
    }
    form.setValue(
      "landing_about_us_first_title",
      aboutUsSettings?.data?.landing_about_us_first_title
    );
    setUploadImageUrl(
      aboutUsSettings?.data?.landing_about_us_first_image_url ?? null
    );
    setUploadImageUrlForSecond(
      aboutUsSettings?.data?.landing_about_us_second_image_url ?? null
    );
    setUploadImageUrlForThird(
      aboutUsSettings?.data?.landing_about_us_third_image_url ?? null
    );

    form.setValue(
      "landing_about_us_first_description",
      aboutUsSettings?.data?.landing_about_us_first_description
    );
  }, [aboutUsSettings?.data]);

  useEffect(() => {
    if (!imageId) {
      return;
    }
    form.setValue("landing_about_us_first_image_url", imageId);
  }, [imageId]);

  useEffect(() => {
    if (!imageIdForSecond) {
      return;
    }
    form.setValue("landing_about_us_second_image_url", imageIdForSecond);
  }, [imageIdForSecond]);

  useEffect(() => {
    if (!imageIdForThird) {
      return;
    }
    form.setValue("landing_about_us_third_image_url", imageIdForThird);
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
                  {t(`About Us Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputType
                  form={form}
                  formName={"landing_about_us_first_title"}
                  formLabel={"About Us First Title"}
                  formPlaceholder={"Enter About Us First Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />

                <TextAreaType
                  form={form}
                  formName={"landing_about_us_first_description"}
                  formLabel={"About Us Description"}
                  formPlaceholder={"Enter About Us First Description"}
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
                <DynamicAddRemoveLists
                  form={form}
                  formName={"landing_about_us_bullet_point"}
                  formLabel={"About Us Bullet Point"}
                  formPlaceholder={"Enter About Us Bullet Point"}
                  formDescription={null}
                  isErrorMessageShow={false}
                  existingListsString={
                    aboutUsSettings?.data?.landing_about_us_bullet_point || ""
                  }
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
