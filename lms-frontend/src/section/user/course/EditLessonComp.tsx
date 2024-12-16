import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import TextAreaType from "@/components/form/TextAreaType";
import VideoPicker from "@/components/modal/videoPicker.comp";
import { Form } from "@/components/ui/form";
import { UPLOAD_SOURCE } from "@/constant/core";
import {
  useAddLessonFormHandler,
  useUpdateLessonFormHandler,
} from "@/hooks/user/course.hook";
import React, { useEffect, useState } from "react";

const videoSourceOptions = [
  { value: UPLOAD_SOURCE.LOCAL, label: "Local" },
  { value: UPLOAD_SOURCE.VIMEO, label: "Vimeo" },
  { value: UPLOAD_SOURCE.YOUTUBE, label: "Youtube" },
];
export default function EditLessonComp({ activeLesson }: any) {
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
  } = useUpdateLessonFormHandler();
  const videoUploadSource = form.watch("video_upload_source") || {};
  const [openForVideo, setOpenForVideo] = useState(false);

  useEffect(() => {
    if (videoUploadSource?.value == activeLesson?.video_upload_source) {
      return;
    }
    form.setValue("video_url", "");
    setUploadVideoUrl("");
  }, [videoUploadSource?.value]);

  useEffect(() => {
    if (!activeLesson?.id) {
      return;
    }

    if (activeLesson?.video_upload_source == UPLOAD_SOURCE.LOCAL) {
      setUploadVideoUrl(activeLesson?.video_url ?? null);
    } else {
      form.setValue("video_url", activeLesson?.video_url);
    }
    form.setValue("id", activeLesson?.id);

    form.setValue("title", activeLesson?.title);

    form.setValue("course_id", activeLesson?.course_id);

    form.setValue("section_id", activeLesson?.section_id);

    form.setValue("description", activeLesson?.description);

    form.setValue(
      "video_upload_source",
      videoSourceOptions.find(
        (item) => item.value == activeLesson?.video_upload_source
      ) || {}
    );
  }, [activeLesson]);

  const handleLessonInfo = (data: any) => {
    if (!activeLesson?.id) {
      return;
    }
    let value = {
      ...data,
      video_upload_source: data.video_upload_source?.value,
    };

    handleLesonSettings(value);
  };

  useEffect(() => {
    if (!videoId) {
      return;
    }

    form.setValue("video_url", `${videoId}`);
  }, [videoId]);
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
            buttonText={`Update`}
            isLoading={isLoading}
            loaderText={"Updating..."}
          />
        </form>
      </Form>
    </>
  );
}
