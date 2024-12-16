"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { DatePickerType } from "@/components/form/DatePickerType";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import { CouponUsesTypeConstant, DiscountConstant } from "@/constant/core";
import {
  useGetCouponDetails,
  useUpdateCouponFormHandler,
} from "@/hooks/admin/coupon.hook.";

import { statusValueHandler } from "@/lib/helper";
import React, { useEffect } from "react";
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

export default function CouponEdit({ params }: { params: { id: any } }) {
  const { t } = useTranslation();

  const { data: couponDetails, isLoading: isDetailsLoading } =
    useGetCouponDetails(params?.id) || {};

  const { form, handleUpdateCoupon, isLoading } = useUpdateCouponFormHandler();

  useEffect(() => {
    if (!couponDetails?.data) {
      return;
    }
    form.setValue("title", couponDetails?.data?.title);
    form.setValue("code", couponDetails?.data?.code);
    form.setValue("id", couponDetails?.data?.id);
    form.setValue("discount_amount", couponDetails?.data?.discount_amount);
    form.setValue("minimum_purchase", couponDetails?.data?.minimum_purchase);
    form.setValue("uses_limit", couponDetails?.data?.uses_limit || "");

    form.setValue(
      "start_date",
      couponDetails?.data?.start_date
        ? new Date(couponDetails?.data?.start_date)
        : new Date()
    );
    form.setValue(
      "end_date",
      couponDetails?.data?.start_date
        ? new Date(couponDetails?.data?.end_date)
        : null
    );

    form.setValue(
      "status",
      statusValueHandler(couponDetails?.data?.status, options)
    );
    form.setValue(
      "discount_type",
      statusValueHandler(couponDetails?.data?.discount_type, discountType)
    );
    form.setValue(
      "uses_type",
      statusValueHandler(couponDetails?.data?.uses_type, usesType)
    );
  }, [couponDetails?.data]);

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
            {t(`Edit Coupon`)}
          </h2>
        </div>
      </div>
      {isDetailsLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateCoupon)}
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
