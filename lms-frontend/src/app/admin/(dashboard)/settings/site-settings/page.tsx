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
  useGetSiteSettingsForAdmin,
  useUpdateSiteSettingsFormHandler,
} from "@/hooks/admin/settings.hook";
import { IRootState } from "@/store";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosAdd } from "react-icons/io";
import { useSelector } from "react-redux";

export default function LandingPage() {
  const { t } = useTranslation();
  const { data } = useSelector((state: IRootState) => state.common);

  const [countryOptions, setCountryOptions] = useState<any>([]);
  const [openForImage, setOpenForImage] = useState(false);
  const [openForImageForSecond, setOpenForImageForSecond] = useState(false);
  const [openForImageForThird, setOpenForImageForThird] = useState(false);
  const { data: siteSettings, isLoading: isDetailsLoading } =
    useGetSiteSettingsForAdmin();

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
  } = useUpdateSiteSettingsFormHandler();

  useEffect(() => {
    if (!siteSettings?.data || !siteSettings?.success) {
      return;
    }
    form.setValue("site_name", siteSettings?.data?.site_name);
    setUploadImageUrl(siteSettings?.data?.site_logo ?? null);
    setUploadImageUrlForSecond(siteSettings?.data?.site_fav_icon ?? null);
    setUploadImageUrlForThird(siteSettings?.data?.site_footer_logo ?? null);

    form.setValue("site_url", siteSettings?.data?.site_url);
    form.setValue("site_email", siteSettings?.data?.site_email);
    form.setValue(
      "social_login_google_status",
      Number(siteSettings?.data?.social_login_google_status) ? true : false
    );
    form.setValue(
      "social_login_github_status",
      Number(siteSettings?.data?.social_login_github_status) ? true : false
    );
    form.setValue(
      "google_analytics_tracking_id",
      siteSettings?.data?.google_analytics_tracking_id
    );
    form.setValue(
      "site_copy_right_text",
      siteSettings?.data?.site_copy_right_text
    );
    form.setValue("meta_title", siteSettings?.data?.meta_title);
    form.setValue("meta_description", siteSettings?.data?.meta_description);
    form.setValue("meta_keywords", siteSettings?.data?.meta_keywords);
  }, [siteSettings?.data]);

  useEffect(() => {
    if (data?.countryList?.length == 0) {
      return;
    }
    const newOption = data?.countryList?.map((country: any) => ({
      ...country,
      value: country.name,
      label: country.name,
    }));
    setCountryOptions(newOption);
  }, [data?.countryList]);

  useEffect(() => {
    if (countryOptions?.length == 0 || !siteSettings?.data?.default_country) {
      return;
    }

    form.setValue(
      "default_country",
      countryOptions.find(
        (item: any) => item?.value == siteSettings?.data?.default_country
      )
    );
  }, [countryOptions]);

  useEffect(() => {
    if (!imageId) {
      return;
    }
    form.setValue("site_logo", imageId);
  }, [imageId]);

  useEffect(() => {
    if (!imageIdForSecond) {
      return;
    }
    form.setValue("site_fav_icon", imageIdForSecond);
  }, [imageIdForSecond]);

  useEffect(() => {
    if (!imageIdForThird) {
      return;
    }
    form.setValue("site_footer_logo", imageIdForThird);
  }, [imageIdForThird]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2 border-b pb-6">
        <div>
          <BackButton title="Back To Dashboard" slug={`/admin`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Site Settings`)}
          </h2>
        </div>
      </div>

      <div>
        {isDetailsLoading ? (
          <FormSkelation />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSettings)}
              className="space-y-4"
            >
              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputType
                    form={form}
                    formName={"site_name"}
                    formLabel={"Site Name"}
                    formPlaceholder={"Enter Site Name"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />

                  <InputType
                    form={form}
                    formName={"site_url"}
                    formLabel={"Site Url"}
                    formPlaceholder={"Enter Site Url"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />
                  <InputType
                    form={form}
                    formName={"site_email"}
                    formLabel={"Site Email"}
                    formPlaceholder={"Enter Site Email"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />
                  <InputType
                    form={form}
                    formName={"site_copy_right_text"}
                    formLabel={"Site Copy Right Text"}
                    formPlaceholder={"Enter Site Copy Right Text"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />
                  <SelectType
                    form={form}
                    formName={"default_country"}
                    formLabel={"Default Country"}
                    isMultipleSelect={false}
                    selectOptions={countryOptions}
                    formDescription={null}
                    isErrorMessageShow={false}
                    classNamePrefix={"lms-react"}
                  />
                </div>
                <div>
                  <h4 className="my-4 text-lg font-bold">
                    {t(`Social Login`)}
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SwitchBoxType
                    form={form}
                    formName={"social_login_github_status"}
                    formLabel={"Github"}
                    formDescription={`Do You Want To Enable Github Login`}
                    isErrorMessageShow={false}
                  />
                  <SwitchBoxType
                    form={form}
                    formName={"social_login_google_status"}
                    formLabel={"Google"}
                    formDescription={`Do You Want To Enable Google Login`}
                    isErrorMessageShow={false}
                  />
                </div>
                <div>
                  <h4 className="my-4 text-lg font-bold">
                    {t(`Logo Settings`)}
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ImagePicker
                    open={openForImage}
                    name={"Site Logo"}
                    setopen={setOpenForImage}
                    uploadImageUrl={uploadImageUrl}
                    setuploadImageUrl={setUploadImageUrl}
                    setId={setImageId}
                  />

                  <ImagePicker
                    open={openForImageForSecond}
                    name={"Site Favicon"}
                    setopen={setOpenForImageForSecond}
                    uploadImageUrl={uploadImageUrlForSecond}
                    setuploadImageUrl={setUploadImageUrlForSecond}
                    setId={setImageIdForSecond}
                  />
                  <ImagePicker
                    open={openForImageForThird}
                    name={"Footer Logo"}
                    setopen={setOpenForImageForThird}
                    uploadImageUrl={uploadImageUrlForThird}
                    setuploadImageUrl={setUploadImageUrlForThird}
                    setId={setImageIdForThird}
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
                    formName={"google_analytics_tracking_id"}
                    formLabel={
                      "Google Analytics Tracking ID (UA-1xxxxx) or (G-xxxxxx)"
                    }
                    formPlaceholder={"Ex: (UA-1xxxxx) or (G-xxxxxx)"}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />

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
                    formName={"meta_keywords"}
                    formLabel={"Meta Keywords"}
                    formPlaceholder={"Enter Meta Keywords"}
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
      </div>
    </div>
  );
}
