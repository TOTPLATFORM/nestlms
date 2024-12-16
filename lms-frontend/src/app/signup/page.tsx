"use client";
import CustomImage from "@/components/CustomImage";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import {
  useLoginHandler,
  useUserLoginHandler,
  useUserSignUpHandler,
} from "@/hooks/auth.hook";
import { errorToast } from "@/lib/helper";
import { IRootState } from "@/store";

import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function SignUp() {
  const { form, handleSignUp, isLoading } = useUserSignUpHandler();
  const { settings } = useSelector((state: IRootState) => state.common.data);

  const [isTermsAndConditionClicked, setIsTermsAndConditionClicked] =
    useState<any>(false);

  const [isPrivacyPolicyClicked, setIsPrivacyPolicyClicked] =
    useState<any>(false);

  const handleSignUpForm = (value: any) => {
    if (settings?.privacy_policy_status == 1 && !isPrivacyPolicyClicked) {
      errorToast("Please accept the privacy policy.");
      return;
    }
    if (settings?.terms_condition_status == 1 && !isTermsAndConditionClicked) {
      errorToast("Please accept the terms and conditions.");
      return;
    }

    handleSignUp(value);
  };
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
              <div className="relative w-full max-w-[670px] rounded-md ">
                <div>
                  <div className="mx-auto w-full max-w-[540px]">
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
                        Sign Up
                      </h1>
                    </div>
                    <Form {...form}>
                      <form
                        className="space-y-5 dark:text-white"
                        onSubmit={form.handleSubmit(handleSignUpForm)}
                      >
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <InputType
                            form={form}
                            formName={"first_name"}
                            formLabel={"First Name"}
                            formPlaceholder={"Enter First Name"}
                            formDescription={null}
                            isErrorMessageShow={false}
                          />
                          <InputType
                            form={form}
                            formName={"last_name"}
                            formLabel={"Last Name"}
                            formPlaceholder={"Enter Last Name"}
                            formDescription={null}
                            isErrorMessageShow={false}
                          />
                        </div>
                        <InputType
                          form={form}
                          formName={"user_name"}
                          formLabel={"User Name"}
                          formPlaceholder={"Enter User Name"}
                          formDescription={null}
                          isErrorMessageShow={false}
                        />
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
                          formName={"password"}
                          formLabel={"Password"}
                          formPlaceholder={"Enter Password"}
                          formDescription={null}
                          isErrorMessageShow={false}
                          type="password"
                        />
                        <div className="text-sm">
                          {settings?.privacy_policy_status == 1 && (
                            <div className="mb-2 flex items-center">
                              <Checkbox
                                onCheckedChange={(value) =>
                                  setIsPrivacyPolicyClicked(value)
                                }
                                checked={isPrivacyPolicyClicked}
                              />
                              <label className="pl-2">
                                I Agree with this{" "}
                                <a
                                  href={`/privacy-policy`}
                                  className="text-primary"
                                  target="_blank"
                                >
                                  Privacy Policy
                                </a>
                              </label>
                            </div>
                          )}

                          {settings?.terms_condition_status == 1 && (
                            <div className="flex items-center">
                              <Checkbox
                                onCheckedChange={(value) =>
                                  setIsTermsAndConditionClicked(value)
                                }
                                checked={isTermsAndConditionClicked}
                              />
                              <label className="pl-2">
                                I Agree with this{" "}
                                <a
                                  href={`/terms-and-conditions`}
                                  className="text-primary"
                                  target="_blank"
                                >
                                  Terms And Conditions
                                </a>
                              </label>
                            </div>
                          )}
                        </div>

                        <LoaderButton
                          buttonText={`Sign Up`}
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
                    <div className="mb-6">
                      <ul className="flex justify-center gap-3.5">
                        <li>
                          <Link
                            href="#"
                            className="bg-primary inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                          >
                            <svg
                              width="14"
                              height="12"
                              viewBox="0 0 14 12"
                              fill="none"
                            >
                              <path
                                d="M14 1.625C13.475 1.8875 12.95 1.975 12.3375 2.0625C12.95 1.7125 13.3875 1.1875 13.5625 0.4875C13.0375 0.8375 12.425 1.0125 11.725 1.1875C11.2 0.6625 10.4125 0.3125 9.625 0.3125C7.7875 0.3125 6.3875 2.0625 6.825 3.8125C4.4625 3.725 2.3625 2.5875 0.875 0.8375C0.0875 2.15 0.525 3.8125 1.75 4.6875C1.3125 4.6875 0.875 4.5125 0.4375 4.3375C0.4375 5.65 1.4 6.875 2.7125 7.225C2.275 7.3125 1.8375 7.4 1.4 7.3125C1.75 8.45 2.8 9.325 4.1125 9.325C3.0625 10.1125 1.4875 10.55 0 10.375C1.3125 11.1625 2.8 11.6875 4.375 11.6875C9.7125 11.6875 12.6875 7.225 12.5125 3.1125C13.125 2.7625 13.65 2.2375 14 1.625Z"
                                fill="white"
                              />
                            </svg>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="#"
                            className="bg-primary inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.8512 7.15912C13.8512 6.66275 13.8066 6.18548 13.7239 5.72729H7.13116V8.43503H10.8984C10.7362 9.31003 10.243 10.0514 9.50162 10.5478V12.3041H11.7639C13.0875 11.0855 13.8512 9.29094 13.8512 7.15912Z"
                                fill="white"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.13089 14C9.0209 14 10.6054 13.3731 11.7636 12.3041L9.50135 10.5477C8.87454 10.9677 8.07272 11.2159 7.13089 11.2159C5.30771 11.2159 3.76452 9.9845 3.21407 8.32996H0.875427V10.1436C2.02725 12.4313 4.39453 14 7.13089 14Z"
                                fill="white"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.21435 8.32997C3.07435 7.90997 2.99481 7.46133 2.99481 6.99997C2.99481 6.5386 3.07435 6.08996 3.21435 5.66996V3.85632H0.875712C0.40162 4.80133 0.131165 5.87042 0.131165 6.99997C0.131165 8.12951 0.40162 9.19861 0.875712 10.1436L3.21435 8.32997Z"
                                fill="white"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.13089 2.7841C8.15862 2.7841 9.08135 3.13728 9.80681 3.83092L11.8145 1.82319C10.6023 0.693638 9.01772 0 7.13089 0C4.39453 0 2.02725 1.56864 0.875427 3.85637L3.21407 5.67001C3.76452 4.01546 5.30771 2.7841 7.13089 2.7841Z"
                                fill="white"
                              />
                            </svg>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="text-center dark:text-white">
                      Don't have an account ?&nbsp;
                      <Link
                        href="/login"
                        className="hover:text-[#4a5562] uppercase text-[#4a5562] underline transition dark:hover:text-white"
                      >
                        SIGN IN
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
