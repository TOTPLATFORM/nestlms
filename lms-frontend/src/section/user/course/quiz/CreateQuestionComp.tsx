import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import TextAreaType from "@/components/form/TextAreaType";
import VideoPicker from "@/components/modal/videoPicker.comp";
import { Form } from "@/components/ui/form";
import { UPLOAD_SOURCE } from "@/constant/core";
import {
  useAddLessonFormHandler,
  useAddQuestionFormHandler,
} from "@/hooks/user/course.hook";
import React, { useEffect, useState } from "react";

const videoSourceOptions = [
  { value: UPLOAD_SOURCE.LOCAL, label: "Local" },
  { value: UPLOAD_SOURCE.VIMEO, label: "Vimeo" },
  { value: UPLOAD_SOURCE.YOUTUBE, label: "Youtube" },
];
export default function CreateQuestionComp({ closeModal, selectedQuiz }: any) {
  const {
    data: courseDetails,
    form,
    isLoading,
    videoId,
    setVideoId,
    uploadVideoUrl,
    setUploadVideoUrl,
    isSuccess,
    handleQuestionSettings,
  } = useAddQuestionFormHandler();
  const videoUploadSource = form.watch("video_upload_source") || {};
  const [openForVideo, setOpenForVideo] = useState(false);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    closeModal();
  }, [isSuccess]);

  const handleQuizInfo = (data: any) => {
    if (!selectedQuiz?.id || !selectedQuiz?.courseId) {
      return;
    }
    let value = {
      ...data,
      mark: Number(data.mark),

      quiz_id: selectedQuiz?.id,
      course_id: selectedQuiz?.courseId,
      file_type: 0,
    };

    handleQuestionSettings(value);
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleQuizInfo)}
          className="space-y-4 p-6"
        >
          <div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <InputType
                form={form}
                formName={"title"}
                formLabel={"Question"}
                formPlaceholder={"Enter Question"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <InputType
                form={form}
                formName={"mark"}
                formLabel={"Question Mark"}
                type="number"
                formPlaceholder={"Enter Question Mark"}
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
