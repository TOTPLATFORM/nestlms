import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import { Form } from "@/components/ui/form";
import {
  useEditSectionFormHandler,
  useUpdateQuizFormHandler,
} from "@/hooks/user/course.hook";
import React, { useEffect, useState } from "react";

const options = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];

const statusOptions = [
  { label: "Active", value: 1 },
  { label: "In-Active", value: 0 },
];

export default function EditQuizComp({ closeModal, editQuiz, sections }: any) {
  const { form, handleUpdateQuiz, isLoading, isSuccess } =
    useUpdateQuizFormHandler();

  const [sectionLists, setSectionLists] = useState<any>([]);

  useEffect(() => {
    let newData = sections.map((section: any) => ({
      label: section.title,
      value: section.id,
    }));
    setSectionLists(newData);
  }, [sections]);

  const displayLimitedQus: any = form.watch("display_limited_qus") || {};

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    closeModal();
  }, [isSuccess]);
  useEffect(() => {
    if (!editQuiz?.id) {
      return;
    }

    form.setValue("id", editQuiz?.id);
    form.setValue("title", editQuiz?.title);
    form.setValue("course_id", editQuiz?.courseId);
    form.setValue("time", editQuiz?.time);
    form.setValue("max_attempts", editQuiz?.max_attempts);
    form.setValue("pass_mark", editQuiz?.pass_mark);
    form.setValue("expiry_days", editQuiz?.expiry_days);
    if (editQuiz?.qus_limit) {
      form.setValue("qus_limit", editQuiz?.qus_limit);
    }
    form.setValue(
      "display_qus_randomly",
      findYesOrNoOptions(editQuiz?.display_qus_randomly)
    );
    form.setValue(
      "display_limited_qus",
      findYesOrNoOptions(editQuiz?.display_limited_qus)
    );
    form.setValue(
      "certificate_included",
      findYesOrNoOptions(editQuiz?.certificate_included)
    );
    form.setValue(
      "status",
      statusOptions.find((option) => option.value === editQuiz?.status) || {}
    );
  }, [editQuiz]);

  useEffect(() => {
    if (sectionLists.length == 0) return;

    form.setValue(
      "section_id",
      sectionLists.find(
        (section: any) => section.value === editQuiz?.sectionId
      ) || {}
    );
  }, [sectionLists]);

  const findYesOrNoOptions = (value: any) => {
    return options.find((option) => option.value === value) || {};
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateQuiz)}
          className="space-y-4"
        >
          <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectType
                form={form}
                formName={"section_id"}
                formLabel={"Select Section"}
                isMultipleSelect={false}
                selectOptions={sectionLists}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
              <InputType
                form={form}
                formName={"title"}
                formLabel={"Quiz Title"}
                formPlaceholder={"Enter Quiz Title"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <InputType
                form={form}
                formName={"time"}
                formLabel={"Quiz Time"}
                type="number"
                formPlaceholder={"Enter Quiz Time"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <InputType
                form={form}
                formName={"max_attempts"}
                formLabel={"Max Attempts"}
                type="number"
                formPlaceholder={"Enter Max Attempts"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <InputType
                form={form}
                formName={"pass_mark"}
                formLabel={"Pass Mark"}
                type="number"
                formPlaceholder={"Enter Pass Mark"}
                formDescription={null}
                isErrorMessageShow={false}
              />

              <SelectType
                form={form}
                formName={"display_qus_randomly"}
                formLabel={"Display Question Randomly"}
                isMultipleSelect={false}
                selectOptions={options}
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
