import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import { Form } from "@/components/ui/form";
import { useAddSectionForAdminFormHandler } from "@/hooks/admin/course.hook";
import React, { useEffect } from "react";

export default function CreateSectionComp({ closeModal, courseId }: any) {
  const { form, handleAddSection, isLoading, isSuccess } =
    useAddSectionForAdminFormHandler();
  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    closeModal();
  }, [isSuccess]);

  useEffect(() => {
    if (!courseId) {
      return;
    }
    form.setValue("courseId", courseId);
  }, [courseId]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddSection)}
          className="space-y-4"
        >
          <div>
            <div className="grid grid-cols-1">
              <InputType
                form={form}
                formName={"title"}
                formLabel={"Section Title"}
                formPlaceholder={"Enter Section Title"}
                formDescription={null}
                isErrorMessageShow={false}
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
