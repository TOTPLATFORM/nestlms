import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import { Form } from "@/components/ui/form";
import {
  useAddAnswerFormHandler,
  useAddQuizFormHandler,
  useAddSectionFormHandler,
  useUpdateAnswerFormHandler,
} from "@/hooks/user/course.hook";
import React, { useEffect, useState } from "react";

const options = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];

export default function EditAnswerComp({ activeAnswer }: any) {
  const { form, handleUpdateAnswer, isLoading, isSuccess } =
    useUpdateAnswerFormHandler();

  useEffect(() => {
    if (!activeAnswer?.id) {
      return;
    }
    form.setValue("id", activeAnswer?.id);
    form.setValue("quiz_id", activeAnswer?.quizId);
    form.setValue("quiz_question_id", activeAnswer?.quizQuestionId);
    form.setValue("title", activeAnswer?.title);
    form.setValue(
      "is_correct",
      options.find((item: any) => item.value == activeAnswer?.is_correct) || {}
    );
  }, [activeAnswer?.id]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateAnswer)}
          className="space-y-4"
        >
          <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputType
                form={form}
                formName={"title"}
                formLabel={"Answer"}
                formPlaceholder={"Enter Answer"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <SelectType
                form={form}
                formName={"is_correct"}
                formLabel={"Is Correct"}
                isMultipleSelect={false}
                selectOptions={options}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
            </div>
          </div>

          <LoaderButton
            buttonText={`Update`}
            isLoading={isLoading}
            loaderText={"Updating..."}
          />
        </form>
      </Form>
    </>
  );
}
