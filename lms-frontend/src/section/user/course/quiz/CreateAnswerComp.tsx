import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import { Form } from "@/components/ui/form";
import {
  useAddAnswerFormHandler,
  useAddQuizFormHandler,
  useAddSectionFormHandler,
} from "@/hooks/user/course.hook";
import React, { useEffect, useState } from "react";

const options = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];

export default function CreateAnswerComp({
  closeModal,
  selectedQuestion,
}: any) {
  const { form, handleAddAnswer, isLoading, isSuccess } =
    useAddAnswerFormHandler();

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    closeModal();
  }, [isSuccess]);

  useEffect(() => {
    if (!selectedQuestion?.id) {
      return;
    }
    form.setValue("quiz_id", selectedQuestion?.quizId);
    form.setValue("quiz_question_id", selectedQuestion?.id);
  }, [selectedQuestion?.id]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddAnswer)}
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
            buttonText={`Add`}
            isLoading={isLoading}
            loaderText={"Creating..."}
          />
        </form>
      </Form>
    </>
  );
}
