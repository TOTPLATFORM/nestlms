"use client";
import CustomImage from "@/components/CustomImage";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import { Form } from "@/components/ui/form";
import {
  useLoginHandler,
  useUserForgetPassHandler,
  useUserLoginHandler,
  useUserVerifyEmailHandler,
} from "@/hooks/auth.hook";
import { IRootState } from "@/store";

import Link from "next/link";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ForgetPassword() {
  const { form, handleForgetPassEmail, isLoading } = useUserForgetPassHandler();
  const { settings } = useSelector((state: IRootState) => state.common.data);

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
                      <h1 className="text-xl font-extrabold uppercase !leading-snug text-[#4a5562] md:text-3xl">
                        Password Recovery
                      </h1>
                      <p className="text-base font-bold leading-normal text-[#4a5562]">
                        Enter your email to Password Recovery
                      </p>
                    </div>
                    <Form {...form}>
                      <form
                        className="space-y-5 dark:text-white"
                        onSubmit={form.handleSubmit(handleForgetPassEmail)}
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

                        <LoaderButton
                          buttonText={`Recover`}
                          isLoading={isLoading}
                          loaderText={"Loading..."}
                          classNames="w-full bg-primary hover:bg-primary"
                        />
                      </form>
                    </Form>
                    <div className="relative my-7 text-center md:mb-6">
                      <span className="bg-white-light dark:bg-white-dark absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2"></span>
                      <span className="dark:bg-dark dark:text-white-light relative bg-white px-2 font-bold uppercase text-[#4a5562]">
                        or
                      </span>
                    </div>
                    <div className="mt-4 text-center dark:text-white">
                      <Link
                        href="/login"
                        className=" hover:text-[#4a5562] border-b border-black pb-1 text-[#4a5562] transition dark:hover:text-white"
                      >
                        Log In
                      </Link>
                    </div>
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
