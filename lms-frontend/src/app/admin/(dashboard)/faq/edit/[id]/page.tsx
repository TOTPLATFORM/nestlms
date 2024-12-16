"use client";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import SwitchBoxType from "@/components/form/SwitchBoxType";
import TextAreaType from "@/components/form/TextAreaType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  useGetFaqDetails,
  useUpdateFaqFormHandler,
} from "@/hooks/admin/faq.hook";

import { statusValueHandler } from "@/lib/helper";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const options = [
  { value: 0, label: "In-Active" },
  { value: 1, label: "Active" },
];
const typeOptions = [{ value: 0, label: "Landing Page" }];

export default function FaqEdit({ params }: { params: { id: any } }) {
  const { t } = useTranslation();

  const { data: faqDetails, isLoading: isDetailsLoading } =
    useGetFaqDetails(params?.id) || {};

  const { form, handleUpdateFaq, isLoading } = useUpdateFaqFormHandler();

  useEffect(() => {
    if (!faqDetails?.data) {
      return;
    }
    form.setValue("question", faqDetails?.data?.question);
    form.setValue("answer", faqDetails?.data?.answer);
    form.setValue("id", faqDetails?.data?.id);

    form.setValue(
      "status",
      statusValueHandler(faqDetails?.data?.status, options)
    );
    form.setValue(
      "type",
      statusValueHandler(faqDetails?.data?.type, typeOptions)
    );
  }, [faqDetails?.data]);

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BackButton title="Back To FAQ" slug={`/admin/faq`} />
          <h2 className="text-2xl font-bold tracking-tight">{t(`Edit FAQ`)}</h2>
        </div>
      </div>
      {isDetailsLoading ? (
        <FormSkelation />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateFaq)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <SelectType
                form={form}
                formName={"type"}
                formLabel={"FAQ For"}
                isMultipleSelect={false}
                selectOptions={typeOptions}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />

              <InputType
                form={form}
                formName={"question"}
                formLabel={"Question"}
                formPlaceholder={"Enter Question"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <TextAreaType
                form={form}
                formName={"answer"}
                formLabel={`Answer`}
                formPlaceholder={"Enter Answer"}
                formDescription={null}
                isErrorMessageShow={false}
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
