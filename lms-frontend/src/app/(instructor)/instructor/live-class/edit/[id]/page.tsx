"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { DatePickerType } from "@/components/form/DatePickerType";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetCourseListsForInstructorLiveClass,
  useGetLiveClassDetailsForInstructor,
  useUpdateLiveClassForInstructorFormHandler,
} from "@/hooks/user/user.settings.hook";
import { errorToast } from "@/lib/helper";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function EditLiveClass({ params }: { params: { id: any } }) {
  const { t } = useTranslation();
  const { data: liveClassDetail, isLoading: isDetailsLoading } =
    useGetLiveClassDetailsForInstructor(params?.id) || {};

  const [courseOptions, setCourseOptions] = useState([]);
  const { form, handleSettings, isLoading } =
    useUpdateLiveClassForInstructorFormHandler();

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
      classId: data?.classId,
    };

    handleSettings(value);
  };

  const getHoursAndMinutes = (date: any) => {
    if (!date) {
      return;
    }
    const startDate = new Date(date);
    const hours = String(startDate.getHours()).padStart(2, "0");
    const minutes = String(startDate.getMinutes()).padStart(2, "0");
    const hoursAndMin = `${hours}:${minutes}`;
    form.setValue("start_time", hoursAndMin);
  };
  useEffect(() => {
    form.setValue("classId", liveClassDetail?.data?.id);
    form.setValue("course_id", {
      label: liveClassDetail?.data?.Course?.name,
      value: liveClassDetail?.data?.Course?.id,
    });
    form.setValue("title", liveClassDetail?.data?.title);
    form.setValue(
      "start_date",
      liveClassDetail?.data?.start_date_time &&
        new Date(liveClassDetail?.data?.start_date_time)
    );
    getHoursAndMinutes(liveClassDetail?.data?.start_date_time);
  }, [liveClassDetail?.data]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton
            title="Back To Live Classes"
            slug={`/instructor/live-class`}
          />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Edit Live Class`)}
          </h2>
        </div>
      </div>
      {isCourseLoading || isDetailsLoading ? (
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
              buttonText={`Update`}
              isLoading={isLoading}
              loaderText={"Updating..."}
            />
          </form>
        </Form>
      )}
    </div>
  );
}
