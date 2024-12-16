"use client";
import CustomImage from "@/components/CustomImage";
import NoItem from "@/components/NoItem";
import BackButton from "@/components/back-button/BackButton";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import TextAreaType from "@/components/form/TextAreaType";
import FormSkelation from "@/components/skelaton/FormSkelation";
import { Form } from "@/components/ui/form";
import {
  useGetPayoutSettingsForAdmin,
  useUpdatePayoutSettingsForAdminFormHandler,
} from "@/hooks/admin/settings.hook";
import {
  useGetCommentForUser,
  useSendCommentForUserFormHandler,
} from "@/hooks/common.hook";
import { IRootState } from "@/store";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function CommentSection({ blogID }: any) {
  const { isLoggedIn } = useSelector((state: IRootState) => state.userSlice);
  const { t } = useTranslation();
  const { data: commentLists, isLoading: isCommentLoading } =
    useGetCommentForUser(blogID || null);
  const { form, handleUserSettings, isLoading } =
    useSendCommentForUserFormHandler();

  const handleData = (value: any) => {
    let data = {
      ...value,
      blogId: blogID,
    };
    handleUserSettings(data);
    form.setValue("message", "");
  };

  return (
    <div>
      <div>
        <h3 className="mb-6 text-xl font-bold">
          {t(`Comments (${commentLists?.data?.length || 0})`)}
        </h3>
      </div>
      {isCommentLoading ? (
        <div>Loading..</div>
      ) : (
        <div>
          {!commentLists || commentLists?.data?.length === 0 ? (
            <NoItem notFoundtext={`No Comments.`} />
          ) : (
            <div className="mb-4">
              {commentLists?.data?.map((comment: any, index: number) => (
                <div
                  key={index}
                  className="mb-8 flex flex-col gap-6 md:flex-row"
                >
                  <div className="min-w-[80px]">
                    <div className="h-[70px] max-h-[70px] w-[70px] min-w-[70px] overflow-hidden rounded-full">
                      <CustomImage
                        imageUrl={
                          comment.User.photo
                            ? comment.User.photo
                            : "/images/profile-pic.jpeg"
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="mb-2 flex items-center justify-between gap-6">
                      <h3 className="text-base font-bold md:text-xl">
                        {comment?.User?.email}
                      </h3>
                      <p className="text-xs md:text-base">
                        {moment(comment?.created_at).format("DD MMM YYYY")}
                      </p>
                    </div>
                    <p className="text-xs md:text-base">{comment?.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div></div>
      {isLoggedIn && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleData)} className="space-y-4">
            <div className="grid grid-cols-1">
              <TextAreaType
                form={form}
                formName={"message"}
                formLabel={""}
                formPlaceholder={"Write your Comment here..."}
                formDescription={null}
                isErrorMessageShow={false}
              />
            </div>
            <LoaderButton
              buttonText={`Post Comment`}
              isLoading={isLoading}
              loaderText={"Loading..."}
            />
          </form>
        </Form>
      )}
    </div>
  );
}
