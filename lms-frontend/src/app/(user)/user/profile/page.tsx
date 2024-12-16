"use client";

import { Tabs, FlowbiteTabTheme } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoaderButton from "@/components/button/LoaderButton";
import { Form } from "@/components/ui/form";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { useForm } from "react-hook-form";
import { DatePickerType } from "@/components/form/DatePickerType";

import ImagePicker from "@/components/modal/imagePicker.comp";
import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import { GENDER } from "@/constant/core";
import {
  useGetUserProfileDetails,
  useUpdateUserSettingsFormHandler,
} from "@/hooks/user/user.settings.hook";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";

const options = [
  { value: GENDER.MALE, label: "Male" },
  { value: GENDER.FEMALE, label: "Female" },
  { value: GENDER.OTHERS, label: "Others" },
];

const customTheme: FlowbiteTabTheme = {
  base: "flex flex-col gap-2",
  tablist: {
    base: "flex text-center",
    styles: {
      default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
      underline:
        "flex-wrap -mb-px border-b border-gray-200 dark:border-gray-700",
      pills:
        "flex-wrap font-medium text-sm text-gray-500 dark:text-gray-400 space-x-2",
      fullWidth:
        "w-full text-sm font-medium divide-x divide-gray-200 shadow grid grid-flow-col dark:divide-gray-700 dark:text-gray-400 rounded-none",
    },
    tabitem: {
      base: "flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:ring-4 focus:ring-cyan-300 focus:outline-none",
      styles: {
        default: {
          base: "rounded-t-lg",
          active: {
            on: "bg-gray-100 text-cyan-600 dark:bg-gray-800 dark:text-cyan-500",
            off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800  dark:hover:text-gray-300",
          },
        },
        underline: {
          base: "rounded-t-lg",
          active: {
            on: "text-cyan-600 rounded-t-lg border-b-2 border-cyan-600 active dark:text-cyan-500 dark:border-cyan-500 focus:!ring-0",
            off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:!ring-0",
          },
        },
        pills: {
          base: "",
          active: {
            on: "rounded-lg bg-cyan-600 text-white",
            off: "rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white",
          },
        },
        fullWidth: {
          base: "ml-0 first:ml-0 w-full rounded-none flex",
          active: {
            on: "p-4 text-gray-900 bg-gray-100 active dark:bg-gray-700 dark:text-white rounded-none",
            off: "bg-white hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 rounded-none",
          },
        },
      },
      icon: "mr-2 h-5 w-5",
    },
  },
  tabitemcontainer: {
    base: "",
    styles: {
      default: "",
      underline: "",
      pills: "",
      fullWidth: "",
    },
  },
  tabpanel: "py-3",
};
export default function PanelSettings() {
  const { t } = useTranslation();
  const [openForImage, setOpenForImage] = useState(false);

  const [countryOptions, setCountryOptions] = useState<any>([]);
  const { data } = useSelector((state: IRootState) => state.common);
  const { user } = useSelector(
    (state: IRootState) => state.userSlice?.user || {}
  );

  const { data: userDetails, isLoading: isDetailsLoading } =
    useGetUserProfileDetails();

  const {
    form,
    handleUserSettings,
    uploadImageUrl,
    setUploadImageUrl,
    setImageId,
    imageId,
    isLoading,
  } = useUpdateUserSettingsFormHandler();

  useEffect(() => {
    if (!imageId) {
      return;
    }
    form.setValue("file_id", imageId);
  }, [imageId]);

  useEffect(() => {
    if (!userDetails?.success) {
      return;
    }
    form.setValue("first_name", userDetails?.data?.user?.first_name);
    form.setValue("last_name", userDetails?.data?.user?.last_name);
    form.setValue("user_name", userDetails?.data?.user?.user_name);
    form.setValue("phone", userDetails?.data?.user?.phone || "");
    form.setValue(
      "birth_date",
      userDetails?.data?.user?.birth_date &&
        new Date(userDetails?.data?.user?.birth_date)
    );

    if (userDetails?.data?.user?.photo) {
      setUploadImageUrl(userDetails?.data?.user?.photo);
    }
    form.setValue(
      "gender",
      options.find((item) => item.value == userDetails?.data?.user?.gender)
    );
  }, [userDetails?.data]);

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
    if (countryOptions?.length == 0 || !userDetails?.data?.user?.country) {
      return;
    }

    form.setValue(
      "country",
      countryOptions?.find(
        (item: any) => item?.value == userDetails?.data?.user?.country
      )
    );
  }, [countryOptions]);

  return (
    <section className="container overflow-auto">
      <Tabs.Group
        aria-label="Tabs with underline"
        style="underline"
        theme={customTheme}
      >
        <Tabs.Item
          active
          title="Basic Information"
          icon={HiUserCircle}
          className="focus:ring-0"
        >
          <div className="panel mb-10">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
              <div className="col-span-2">
                {!isDetailsLoading && (
                  <NegativeXAxisAnimation
                    classes={`flex h-full w-full items-center justify-center`}
                    isOneTime={true}
                  >
                    <ImagePicker
                      open={openForImage}
                      name={""}
                      setopen={setOpenForImage}
                      uploadImageUrl={uploadImageUrl}
                      setuploadImageUrl={setUploadImageUrl}
                      setId={setImageId}
                      isForProfile={true}
                      inputText={`Select an Image`}
                    />
                  </NegativeXAxisAnimation>
                )}
              </div>

              <div className="col-span-5">
                {isDetailsLoading ? (
                  <FormSkelation />
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleUserSettings)}
                      className="space-y-4"
                    >
                      <PositiveXAxisAnimation
                        classes={`grid grid-cols-1 gap-2 sm:grid-cols-2`}
                        isOneTime={true}
                      >
                        <InputType
                          form={form}
                          formName={"first_name"}
                          formLabel={"First Name"}
                          formPlaceholder={"Enter First Name"}
                          formDescription={null}
                          isErrorMessageShow={false}
                        />

                        <InputType
                          form={form}
                          formName={"last_name"}
                          formLabel={"Last Name"}
                          formPlaceholder={"Enter Last Name"}
                          formDescription={null}
                          isErrorMessageShow={false}
                        />

                        <InputType
                          form={form}
                          formName={"user_name"}
                          formLabel={"User Name"}
                          formPlaceholder={"Enter User Name"}
                          formDescription={null}
                          isErrorMessageShow={false}
                        />
                        <DatePickerType
                          form={form}
                          formName={"birth_date"}
                          formLabel={"Birth Date"}
                          formPlaceholder={"Enter Birth Date"}
                          formDescription={null}
                          isErrorMessageShow={false}
                        />
                        <SelectType
                          form={form}
                          formName={"country"}
                          formLabel={"Country"}
                          isMultipleSelect={false}
                          selectOptions={countryOptions}
                          formDescription={null}
                          isErrorMessageShow={false}
                          classNamePrefix={"lms-react"}
                        />

                        <InputType
                          form={form}
                          formName={"phone"}
                          formLabel={"Phone"}
                          formPlaceholder={"Enter Phone Number"}
                          formDescription={null}
                          isErrorMessageShow={false}
                        />

                        <SelectType
                          form={form}
                          formName={"gender"}
                          formLabel={"Gender"}
                          isMultipleSelect={false}
                          selectOptions={options}
                          formDescription={null}
                          isErrorMessageShow={false}
                          classNamePrefix={"lms-react"}
                        />
                      </PositiveXAxisAnimation>
                      <LoaderButton
                        buttonText={`Update`}
                        isLoading={isLoading}
                        loaderText={"Updating..."}
                      />
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </section>
  );
}
