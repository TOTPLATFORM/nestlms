"use client";
import CustomImage from "@/components/CustomImage";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import { Form } from "@/components/ui/form";
import { useLoginHandler } from "@/hooks/auth.hook";
import { IRootState } from "@/store";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const demoUsers = [
  { name: "Admin", email: "admin@email.com", password: "123456" },
];
export default function Login() {
  const { form, handleLogin, isLoading } = useLoginHandler();
  const { settings } = useSelector((state: IRootState) => state.common.data);

  const selectDemoUser = (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
    handleLogin({
      email: email,
      password: password,
    });
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
            <div className="hidden h-screen md:block">
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
                      <h1 className="text-primary text-2xl font-extrabold uppercase !leading-snug md:text-3xl">
                        Sign in
                      </h1>
                      <p className="text-white-dark text-base font-bold leading-normal">
                        Enter your email and password to login
                      </p>
                    </div>
                    <Form {...form}>
                      <form
                        className="space-y-5 dark:text-white"
                        onSubmit={form.handleSubmit(handleLogin)}
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
                          formName={"password"}
                          formLabel={"Password"}
                          formPlaceholder={"Enter Password"}
                          formDescription={null}
                          isErrorMessageShow={false}
                          type="password"
                        />
                        <LoaderButton
                          buttonText={`Sign In`}
                          isLoading={isLoading}
                          loaderText={"Loading..."}
                          classNames="w-full"
                        />
                      </form>
                    </Form>
                    <div className="mt-4 w-full">
                      <table className="w-full table-auto border-none text-xs md:text-sm">
                        <tbody>
                          {demoUsers.map((user, index) => (
                            <tr
                              key={index}
                              className="dark:border-dark cursor-pointer border"
                            >
                              <td className="px-2 py-2 md:px-4">
                                {user.email}
                              </td>
                              <td className="px-2 py-2 md:px-4">
                                {user.password}
                              </td>
                              <td className="px-2 py-2 md:px-4">
                                <button
                                  className="rounded-[8px] border px-2 py-1.5 text-black shadow-none dark:text-white"
                                  onClick={() => {
                                    selectDemoUser(user.email, user.password);
                                  }}
                                >
                                  Use
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
