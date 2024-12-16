"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { DatePickerType } from "@/components/form/DatePickerType";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import TextAreaType from "@/components/form/TextAreaType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import { CouponUsesTypeConstant, DiscountConstant } from "@/constant/core";
import { useAddCouponFormHandler } from "@/hooks/admin/coupon.hook.";
import {
  useCreateLiveClassForInstructorFormHandler,
  useGetCourseListsForInstructorLiveClass,
} from "@/hooks/user/user.settings.hook";
import { errorToast } from "@/lib/helper";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreateLiveClass() {
  const { t } = useTranslation();
  const [courseOptions, setCourseOptions] = useState([]);
  const { form, handleSettings, isLoading } =
    useCreateLiveClassForInstructorFormHandler();

  const { data: courseLists, isLoading: isCourseLoading } =
    useGetCourseListsForInstructorLiveClass();

  useEffect(() => {
    if (courseLists?.data?.length === 0) {
      return;
    }
    let newOtions = courseLists?.data?.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
    setCourseOptions(newOtions);
  }, [courseLists?.data]);

  const handleLiveClass = (data: any) => {
    if (!data?.course_id?.value) {
      errorToast("Course is Required");
      return;
    }
    if (!data?.start_date) {
      errorToast("Date is Required");
      return;
    }
    if (!data?.start_time) {
      errorToast("Time is Required");
      return;
    }
    const startDate = new Date(data?.start_date);
    const startTime = data?.start_time;

    const [hours, minutes] = startTime.split(":").map(Number);

    startDate.setHours(hours);
    startDate.setMinutes(minutes);

    let value = {
      course_id: data?.course_id?.value,
      title: data?.title,
      start_date_time: startDate.getTime(),
    };

    handleSettings(value);
  };

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton
            title="Back To Live Classes"
            slug={`/instructor/live-class`}
          />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Create Live Class`)}
          </h2>
        </div>
      </div>
      {isCourseLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLiveClass)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <SelectType
                form={form}
                formName={"course_id"}
                formLabel={"Select Course"}
                isMultipleSelect={false}
                selectOptions={courseOptions}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
              <InputType
                form={form}
                formName={"title"}
                formLabel={"Live Class Title"}
                formPlaceholder={"Enter Title"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <DatePickerType
                form={form}
                formName={"start_date"}
                formLabel={"Start Date"}
                formPlaceholder={"Enter Start Date"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <InputType
                form={form}
                formName={"start_time"}
                formLabel={"Start Time"}
                formPlaceholder={"Enter Time"}
                formDescription={null}
                isErrorMessageShow={false}
                type="time"
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
