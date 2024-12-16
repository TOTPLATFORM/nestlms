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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];

const discountType = [
  { value: DiscountConstant.DISCOUNT_FIXED, label: "Fixed" },
  { value: DiscountConstant.DISCOUNT_PERCENTAGE, label: "Percentage" },
];

const usesType = [
  { value: CouponUsesTypeConstant.LIMITED_USER, label: "Limited User" },
  { value: CouponUsesTypeConstant.UNLIMITED_USER, label: "Unlimited User" },
];

export default function CreateCoupon() {
  const { t } = useTranslation();

  const { form, handleAddCoupon, isLoading } = useAddCouponFormHandler();

  const selectedUsesType: any = form.watch("uses_type");
  useEffect(() => {
    if (!selectedUsesType?.value) {
      return;
    }
    form.setValue("uses_limit", 0);
  }, [selectedUsesType?.value]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton title="Back To Coupon" slug={`/admin/coupon`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Create Coupon`)}
          </h2>
        </div>
      </div>
      {isLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddCoupon)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <InputType
                form={form}
                formName={"title"}
                formLabel={"Title"}
                formPlaceholder={"Enter Title"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <InputType
                form={form}
                formName={"code"}
                formLabel={"Code"}
                formPlaceholder={"Enter Code"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <SelectType
                form={form}
                formName={"discount_type"}
                formLabel={"Discount Type"}
                isMultipleSelect={false}
                selectOptions={discountType}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
              <InputType
                form={form}
                formName={"discount_amount"}
                formLabel={"Discount Amount"}
                formPlaceholder={"Enter Discount Amount"}
                formDescription={null}
                isErrorMessageShow={false}
                type="number"
                minNumber={0}
              />

              <InputType
                form={form}
                formName={"minimum_purchase"}
                formLabel={"Minimum Purchase"}
                formPlaceholder={"Enter Minimum Purchase"}
                formDescription={null}
                isErrorMessageShow={false}
                type="number"
                minNumber={0}
              />

              <SelectType
                form={form}
                formName={"uses_type"}
                formLabel={"Uses Type"}
                isMultipleSelect={false}
                selectOptions={usesType}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />

              <InputType
                form={form}
                formName={"uses_limit"}
                formLabel={"User Limit"}
                formPlaceholder={"Enter User Limit"}
                formDescription={null}
                isErrorMessageShow={false}
                type="number"
                minNumber={0}
                disabled={
                  selectedUsesType?.value ==
                  CouponUsesTypeConstant.UNLIMITED_USER
                    ? true
                    : false
                }
              />
              <SelectType
                form={form}
                formName={"status"}
                formLabel={"Status"}
                isMultipleSelect={false}
                selectOptions={options}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
              <DatePickerType
                form={form}
                formName={"start_date"}
                formLabel={"Start Date"}
                formPlaceholder={"Enter Start Date"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <DatePickerType
                form={form}
                formName={"end_date"}
                formLabel={"End Date"}
                formPlaceholder={"Enter End Date"}
                formDescription={null}
                isErrorMessageShow={false}
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
