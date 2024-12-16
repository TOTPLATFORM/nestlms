"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import TextAreaType from "@/components/form/TextAreaType";
import ImagePicker from "@/components/modal/imagePicker.comp";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetChooseUsSettingsForAdmin,
  useUpdateChooseUsSettingsFormHandler,
} from "@/hooks/admin/settings.hook";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ChooseUsSectionSettings() {
  const { t } = useTranslation();

  const [openForImage, setOpenForImage] = useState(false);
  const { data: chosseUsSettings, isLoading: isDetailsLoading } =
    useGetChooseUsSettingsForAdmin();

  const {
    form,
    handleSettings,
    isLoading,
    setImageId,
    imageId,
    uploadImageUrl,
    setUploadImageUrl,
  } = useUpdateChooseUsSettingsFormHandler();

  useEffect(() => {
    if (!chosseUsSettings?.data || !chosseUsSettings?.success) {
      return;
    }
    form.setValue(
      "landing_choose_us_first_title",
      chosseUsSettings?.data?.landing_choose_us_first_title
    );
    setUploadImageUrl(
      chosseUsSettings?.data?.landing_choose_us_first_image_url ?? null
    );

    form.setValue(
      "landing_choose_us_list_first_title",
      chosseUsSettings?.data?.landing_choose_us_list_first_title
    );
    form.setValue(
      "landing_choose_us_list_first_description",
      chosseUsSettings?.data?.landing_choose_us_list_first_description
    );
    form.setValue(
      "landing_choose_us_list_second_title",
      chosseUsSettings?.data?.landing_choose_us_list_second_title
    );
    form.setValue(
      "landing_choose_us_list_second_description",
      chosseUsSettings?.data?.landing_choose_us_list_second_description
    );
    form.setValue(
      "landing_choose_us_list_third_title",
      chosseUsSettings?.data?.landing_choose_us_list_third_title
    );
    form.setValue(
      "landing_choose_us_list_third_description",
      chosseUsSettings?.data?.landing_choose_us_list_third_description
    );
    form.setValue(
      "landing_choose_us_list_fourth_title",
      chosseUsSettings?.data?.landing_choose_us_list_fourth_title
    );
    form.setValue(
      "landing_choose_us_list_fourth_description",
      chosseUsSettings?.data?.landing_choose_us_list_fourth_description
    );
  }, [chosseUsSettings?.data]);

  useEffect(() => {
    if (!imageId) {
      return;
    }
    form.setValue("landing_choose_us_first_image_url", imageId);
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
                  {t(`Choose Us Settings`)}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputType
                  form={form}
                  formName={"landing_choose_us_first_title"}
                  formLabel={"Choose Us Title"}
                  formPlaceholder={"Enter Choose Us Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <ImagePicker
                  open={openForImage}
                  name={"Choose Us Image"}
                  setopen={setOpenForImage}
                  uploadImageUrl={uploadImageUrl}
                  setuploadImageUrl={setUploadImageUrl}
                  setId={setImageId}
                />
                <InputType
                  form={form}
                  formName={"landing_choose_us_list_first_title"}
                  formLabel={"First List Title"}
                  formPlaceholder={"Enter First List Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <TextAreaType
                  form={form}
                  formName={"landing_choose_us_list_first_description"}
                  formLabel={"First List Description"}
                  formPlaceholder={"Enter First List Description"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <InputType
                  form={form}
                  formName={"landing_choose_us_list_second_title"}
                  formLabel={"Second List Title"}
                  formPlaceholder={"Enter Second List Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <TextAreaType
                  form={form}
                  formName={"landing_choose_us_list_second_description"}
                  formLabel={"Second Description"}
                  formPlaceholder={"Enter Second List Description"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <InputType
                  form={form}
                  formName={"landing_choose_us_list_third_title"}
                  formLabel={"Third List Title"}
                  formPlaceholder={"Enter Third List Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <TextAreaType
                  form={form}
                  formName={"landing_choose_us_list_third_description"}
                  formLabel={"Third List Description"}
                  formPlaceholder={"Enter Third List Description"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <InputType
                  form={form}
                  formName={"landing_choose_us_list_fourth_title"}
                  formLabel={"Fourth List Title"}
                  formPlaceholder={"Enter Fourth List Title"}
                  formDescription={null}
                  isErrorMessageShow={false}
                />
                <TextAreaType
                  form={form}
                  formName={"landing_choose_us_list_fourth_description"}
                  formLabel={"Fourth List Description"}
                  formPlaceholder={"Enter Fourth List Description"}
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
