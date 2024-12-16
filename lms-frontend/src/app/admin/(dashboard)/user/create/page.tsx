"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { DatePickerType } from "@/components/form/DatePickerType";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ALL_USER_ROLLS, GENDER, STATUS } from "@/constant/core";
import { useCreateUserForAdminFormHandler } from "@/hooks/admin/admin.hook";
import { useAddCategoriesFormHandler } from "@/hooks/admin/category.hook";
import { useUpdateUserSettingsFormHandler } from "@/hooks/user/user.settings.hook";
import { IRootState } from "@/store";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const options = [
  { value: GENDER.MALE, label: "Male" },
  { value: GENDER.FEMALE, label: "Female" },
  { value: GENDER.OTHERS, label: "Others" },
];

const userRollOptions = [
  { value: ALL_USER_ROLLS.STUDENT, label: "Student" },
  { value: ALL_USER_ROLLS.INSTRUCTOR, label: "Instructor" },
];

const statusOptions = [
  { value: STATUS.ACTIVE, label: "Active" },
  { value: STATUS.INACTIVE, label: "In-Active" },
  { value: STATUS.PENDING, label: "Pending" },
];

export default function CreateUser() {
  const { t } = useTranslation();

  const { data } = useSelector((state: IRootState) => state.common);

  const [countryOptions, setCountryOptions] = useState<any>([]);

  const { form, handleUserSettings, isLoading } =
    useCreateUserForAdminFormHandler();

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

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton title="Back To User" slug={`/admin/students`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Create User`)}
          </h2>
        </div>
      </div>
      {isLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUserSettings)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <SelectType
                form={form}
                formName={"roles"}
                formLabel={"Roles"}
                isMultipleSelect={false}
                selectOptions={userRollOptions}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
              <SelectType
                form={form}
                formName={"status"}
                formLabel={"Status"}
                isMultipleSelect={false}
                selectOptions={statusOptions}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
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
                formName={"nick_name"}
                formLabel={"User Name"}
                formPlaceholder={"Enter User Name"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <InputType
                form={form}
                formName={"email"}
                formLabel={"Email"}
                formPlaceholder={"Enter User Email"}
                formDescription={null}
                isErrorMessageShow={false}
                type="email"
              />
              <InputType
                form={form}
                formName={"password"}
                formLabel={"Password"}
                formPlaceholder={"Enter User password"}
                formDescription={null}
                isErrorMessageShow={false}
                type="password"
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
            </div>
            <LoaderButton
              buttonText={`Create`}
              isLoading={isLoading}
              loaderText={"Creating..."}
            />
          </form>
        </Form>
      )}
    </div>
  );
}
