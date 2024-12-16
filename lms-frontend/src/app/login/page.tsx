"use client";
import CustomImage from "@/components/CustomImage";
import GitHubLogin from "@/components/auth/github.comp";
import LoaderButton from "@/components/button/LoaderButton";
import { InputType } from "@/components/form/InputType";
import { Form } from "@/components/ui/form";
import { STATUS } from "@/constant/core";
import {
  useLoginHandler,
  useSignin,
  useUserLoginHandler,
} from "@/hooks/auth.hook";
import { errorToast } from "@/lib/helper";
import { IRootState } from "@/store";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next-nprogress-bar";

import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const demoUsers = [
  { name: "Student", email: "student@email.com", password: "123456" },
  { name: "Instructor", email: "instructor@email.com", password: "123456" },
  { name: "Admin", email: "admin@email.com", password: "123456" },
];

export default function Login() {
  const { form, handleLogin, isLoading } = useUserLoginHandler();

  const router = useRouter();

  const { settings } = useSelector((state: IRootState) => state.common.data);

  const { gLoading, handleGoogleLogin, mutateGoogle } = useSignin();

  const selectDemoUser = (email: string, password: string) => {
    if (email == "admin@email.com") {
      router.push("/admin/login");
      return;
    }
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
                        Sign in
                      </h1>
                      <p className="text-base font-bold leading-normal text-[#4a5562]">
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

                    <div className="mb-4 flex items-center justify-center gap-x-4">
                      {Number(settings?.social_login_github_status) ===
                        STATUS.ACTIVE && <GitHubLogin />}
                      {Number(settings?.social_login_google_status) ===
                        STATUS.ACTIVE &&
                        settings?.google_auth_client_id && (
                          <GoogleLogin
                            onSuccess={(credentialResponse: any) => {
                              handleGoogleLogin(
                                credentialResponse?.credential,
                                credentialResponse?.clientId
                              );
                            }}
                            type="icon"
                            shape="circle"
                            size="large"
                            theme="filled_black"
                            onError={() => {
                              errorToast("Login Failed");
                            }}
                            useOneTap
                          />
                        )}
                    </div>
                    <div className="text-center dark:text-white">
                      Don't have an account ?&nbsp;
                      <Link
                        href="/signup"
                        className="hover:text-[#4a5562] uppercase text-[#4a5562] underline transition dark:hover:text-white"
                      >
                        SIGN UP
                      </Link>
                    </div>
                    <div className="mt-4 text-center dark:text-white">
                      <Link
                        href="/forget-password"
                        className=" hover:text-[#4a5562] text-[#4a5562] underline transition dark:hover:text-white"
                      >
                        Forget Your Password?
                      </Link>
                    </div>

                    <div className="mt-4 flex justify-center">
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
