"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import TextAreaType from "@/components/form/TextAreaType";
import ImagePicker from "@/components/modal/imagePicker.comp";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetBannerSettingsForAdmin,
  useUpdateBannerSettingsFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function BannerSection() {
  const { t } = useTranslation();

  const [openForImage, setOpenForImage] = useState(false);
  const { data: bannerSettings, isLoading: isDetailsLoading } =
    useGetBannerSettingsForAdmin();

  const {
    form,
    handleSettings,
    isLoading,
    setImageId,
    imageId,
    uploadImageUrl,
    setUploadImageUrl,
  } = useUpdateBannerSettingsFormHandler();

  useEffect(() => {
    if (!bannerSettings?.data || !bannerSettings?.success) {
      return;
    }
    form.setValue(
      "landing_main_banner_first_title",
      bannerSettings?.data?.landing_main_banner_first_title
    );
    setUploadImageUrl(
      bannerSettings?.data?.landing_main_banner_image_url ?? null
    );

    form.setValue(
      "landing_main_banner_first_description",
      bannerSettings?.data?.landing_main_banner_first_description
    );
  }, [bannerSettings?.data]);

  useEffect(() => {
    if (!imageId) {
      return;
    }
    form.setValue("landing_main_banner_image_url", imageId);
  }, [imageId]);

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
                  {t(`Banner Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputType
                  form={form}
                  formName={"landing_main_banner_first_title"}
                  formLabel={"Banner First Title"}
                  formPlaceholder={"Enter Banner First Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />

                <TextAreaType
                  form={form}
                  formName={"landing_main_banner_first_description"}
                  formLabel={"Banner First Description"}
                  formPlaceholder={"Enter Banner First Description"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <ImagePicker
                  open={openForImage}
                  name={"Banner Image"}
                  setopen={setOpenForImage}
                  uploadImageUrl={uploadImageUrl}
                  setuploadImageUrl={setUploadImageUrl}
                  setId={setImageId}
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
