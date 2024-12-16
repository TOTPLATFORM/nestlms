import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useVerifyKycForUserFormHandler } from "@/hooks/user/user.settings.hook";
import TextAreaType from "../form/TextAreaType";
import LoaderButton from "../button/LoaderButton";
import ImagePicker from "../modal/imagePicker.comp";
export default function KycVerifyUserForm({ item }: any) {
  const {
    form,
    handleSubmitKycForUser,
    uploadImageUrl,
    setUploadImageUrl,
    imageId,
    setImageId,
    isLoading,
  } = useVerifyKycForUserFormHandler();

  const [openForImage, setOpenForImage] = useState(false);

  useEffect(() => {
    if (!imageId) {
      return;
    }
    form.setValue("file_id", imageId);
  }, [imageId]);

  useEffect(() => {
    form.setValue("kyc_verification_id", item?.id);
  }, [item]);

  return (
    <div className="p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitKycForUser)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1">
            {item?.is_text_required == 1 && (
              <TextAreaType
                form={form}
                formName={"text"}
                formLabel={"Enter Text"}
                formPlaceholder={"Enter Text"}
                formDescription={null}
                isErrorMessageShow={false}
              />
            )}
            {item?.is_file_required == 1 && (
              <ImagePicker
                open={openForImage}
                name={"Thumbnail Image"}
                setopen={setOpenForImage}
                uploadImageUrl={uploadImageUrl}
                setuploadImageUrl={setUploadImageUrl}
                setId={setImageId}
              />
            )}
          </div>
          <LoaderButton
            buttonText={`Verify`}
            isLoading={isLoading}
            loaderText={"Verifing..."}
          />
        </form>
      </Form>
    </div>
  );
}
