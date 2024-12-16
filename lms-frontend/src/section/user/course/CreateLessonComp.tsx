import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import TextAreaType from "@/components/form/TextAreaType";
import VideoPicker from "@/components/modal/videoPicker.comp";
import { Form } from "@/components/ui/form";
import { UPLOAD_SOURCE } from "@/constant/core";
import { useAddLessonFormHandler } from "@/hooks/user/course.hook";
import React, { useEffect, useState } from "react";

const videoSourceOptions = [
  { value: UPLOAD_SOURCE.LOCAL, label: "Local" },
  { value: UPLOAD_SOURCE.VIMEO, label: "Vimeo" },
  { value: UPLOAD_SOURCE.YOUTUBE, label: "Youtube" },
];
export default function CreateLessonComp({ closeModal, selectedSection }: any) {
  const {
    data: courseDetails,
    form,
    isLoading,
    videoId,
    setVideoId,
    uploadVideoUrl,
    setUploadVideoUrl,
    isSuccess,
    handleLesonSettings,
  } = useAddLessonFormHandler();
  const videoUploadSource = form.watch("video_upload_source") || {};
  const [openForVideo, setOpenForVideo] = useState(false);

  useEffect(() => {
    if (!videoUploadSource?.value) {
      return;
    }
    form.setValue("video_url", "");
    setUploadVideoUrl("");
  }, [videoUploadSource?.value]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    closeModal();
  }, [isSuccess]);

  const handleLessonInfo = (data: any) => {
    if (!selectedSection?.id || !selectedSection?.course_id) {
      return;
    }
    let value = {
      ...data,
      video_url: data.video_url,
      section_id: selectedSection?.id,
      course_id: selectedSection?.course_id,
      video_upload_source: data.video_upload_source?.value,
    };

    if (data.video_upload_source?.value == UPLOAD_SOURCE.LOCAL) {
      value = { ...value, video_url: `${videoId}` };
    }
    handleLesonSettings(value);
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLessonInfo)}
          className="space-y-4 p-6"
        >
          <div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <InputType
                form={form}
                formName={"title"}
                formLabel={"Lesson Title"}
                formPlaceholder={"Enter Lesson Title"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <TextAreaType
                form={form}
                formName={"description"}
                formLabel={"Lesson Description"}
                formPlaceholder={"Enter Lesson Description"}
                formDescription={null}
                isErrorMessageShow={false}
              />
              <SelectType
                form={form}
                formName={"video_upload_source"}
                formLabel={"Video Upload Source"}
                isMultipleSelect={false}
                selectOptions={videoSourceOptions}
                formDescription={null}
                isErrorMessageShow={false}
                classNamePrefix={"lms-react"}
              />
              {videoUploadSource?.label &&
                (videoUploadSource?.value == UPLOAD_SOURCE.LOCAL ? (
                  <VideoPicker
                    open={openForVideo}
                    name={"Upload Video"}
                    setopen={setOpenForVideo}
                    uploadVideoUrl={uploadVideoUrl}
                    setuploadVideoUrl={setUploadVideoUrl}
                    setId={setVideoId}
                    inputText={`Upload Video`}
                  />
                ) : (
                  <InputType
                    form={form}
                    formName={"video_url"}
                    formLabel={`${videoUploadSource?.label} Link`}
                    formPlaceholder={`Enter ${videoUploadSource?.label} Link`}
                    formDescription={null}
                    isErrorMessageShow={false}
                  />
                ))}
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
