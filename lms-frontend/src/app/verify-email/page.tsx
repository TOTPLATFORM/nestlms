"use client";
import CustomImage from "@/components/CustomImage";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import { Form } from "@/components/ui/form";
import {
  useLoginHandler,
  useUserLoginHandler,
  useUserVerifyEmailHandler,
} from "@/hooks/auth.hook";
import { IRootState } from "@/store";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function VerifyEmail() {
  const { form, handleVerifyEmail, isLoading } = useUserVerifyEmailHandler();
  const { settings } = useSelector((state: IRootState) => state.common.data);

  const searchParams = useSearchParams();
  const oldEmail = searchParams.get("email");
  useEffect(() => {
    if (!oldEmail) {
      return;
    }
    form.setValue("email", oldEmail);
  }, [oldEmail]);

  return (
    <div>
      <section
        className="bg-primary/10 relative overflow-hidden"
        style={{ backdropFilter: "blur(14px)" }}
      >
        <img
          src="/images/line-1.png"
          alt=""
          className="absolute -left-[100px] top-0 -z-[2] opacity-50"
        />

        <div
          className="bg-primary/30 absolute right-0 top-1/2 -z-[2] h-[400px] w-[400px] -translate-y-1/2 rounded-full"
          style={{ filter: "blur(250px)" }}
        ></div>

        <img
          src="/images/line-arrow-1.png"
          alt=""
          className="absolute bottom-0 right-0"
        />

        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="hidden h-screen max-h-screen md:block">
              <CustomImage
                imageUrl="/images/auth_bg.jpg"
                className="h-screen"
              />
            </div>
            <div className="dark:bg-[#060818] relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-16">
              <div className="relative w-full max-w-[570px] rounded-md ">
                <div>
                  <div className="mx-auto w-full max-w-[440px]">
                    <div className="mb-4 flex justify-center">
                      <Link href="/">
                        <span className="sr-only">Your Company</span>
                        <img
                          className="h-[45px] w-auto"
                          src={settings?.site_logo || "/images/logo.png"}
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="mb-8 text-center">
                      <h1 className="text-2xl font-extrabold uppercase !leading-snug text-[#4a5562] md:text-3xl">
                        Verify Email
                      </h1>
                      <p className="text-base font-bold leading-normal text-[#4a5562]">
                        Enter your email and code to verify
                      </p>
                    </div>
                    <Form {...form}>
                      <form
                        className="space-y-5 dark:text-white"
                        onSubmit={form.handleSubmit(handleVerifyEmail)}
                      >
                        <InputType
                          form={form}
                          formName={"email"}
                          formLabel={"Email"}
                          formPlaceholder={"Enter Email"}
                          formDescription={null}
                          isErrorMessageShow={false}
                          type="email"
                        />
                        <InputType
                          form={form}
                          formName={"code"}
                          formLabel={"Code"}
                          formPlaceholder={"Enter Code"}
                          formDescription={null}
                          isErrorMessageShow={false}
                        />

                        <LoaderButton
                          buttonText={`Verify`}
                          isLoading={isLoading}
                          loaderText={"Loading..."}
                          classNames="w-full bg-primary hover:bg-primary"
                        />
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
