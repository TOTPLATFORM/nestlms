import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import SelectType from "@/components/form/SelectType";
import TextAreaType from "@/components/form/TextAreaType";
import { Form } from "@/components/ui/form";
import {
  useAddAnswerFormHandler,
  useAddQuizFormHandler,
  useAddReviewForUserFormHandler,
  useAddSectionFormHandler,
} from "@/hooks/user/course.hook";
import { errorToast } from "@/lib/helper";
import React, { useEffect, useState } from "react";
import { IoMdStar } from "react-icons/io";

const options = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];

export default function CreateReview({ closeModal, courseId }: any) {
  const { form, handleAddReviewForUser, isLoading, isSuccess } =
    useAddReviewForUserFormHandler();
  const [rating, setRating] = useState(0);
  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    closeModal();
  }, [isSuccess]);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setRating(i)}
          style={{ cursor: "pointer", color: i <= rating ? "#FFA41B" : "gray" }}
        >
          <IoMdStar size={22} />
        </span>
      );
    }
    return stars;
  };

  const handleUserReview = (value: any) => {
    if (!courseId) {
      errorToast("Course not found");
      closeModal();
      return;
    }
    let data: any = {
      rating: rating,
      content: value.content,
      course_id: courseId,
    };

    handleAddReviewForUser(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUserReview)}
          className="space-y-4"
        >
          <div>
            <div className="grid grid-cols-1">
              <div className="mb-2 flex items-center gap-x-4">
                <label className="text-sm">Rating:</label>
                <div className="flex gap-x-2">{renderStars()}</div>
              </div>
              <TextAreaType
                form={form}
                formName={"content"}
                formLabel={"Content"}
                formPlaceholder={"Enter Content"}
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
