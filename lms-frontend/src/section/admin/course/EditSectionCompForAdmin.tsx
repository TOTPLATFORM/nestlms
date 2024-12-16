import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import { Form } from "@/components/ui/form";
import { useEditSectionForAdminFormHandler } from "@/hooks/admin/course.hook";
import { useEditSectionFormHandler } from "@/hooks/user/course.hook";
import React, { useEffect } from "react";

export default function EditSectionCompForAdmin({
  closeModal,
  editSection,
}: any) {
  const { form, handleUpdateSection, isLoading, isSuccess } =
    useEditSectionForAdminFormHandler();
  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    closeModal();
  }, [isSuccess]);
  useEffect(() => {
    if (!editSection?.id) {
      return;
    }

    form.setValue("id", editSection?.id);
    form.setValue("title", editSection?.title);
    form.setValue("courseId", editSection?.course_id);
  }, [editSection]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateSection)}
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
            buttonText={`Update`}
            isLoading={isLoading}
            loaderText={"Updating..."}
          />
        </form>
      </Form>
    </>
  );
}
