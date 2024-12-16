"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import LoaderButton from "@/components/button/LoaderButton";
import {
  useBecomeAnInstructor,
  useGetInstructorApplicationStatus,
} from "@/hooks/auth.hook";
import { STATUS } from "@/constant/core";
import { Button } from "@/components/ui/button";
import InstructorModal from "@/components/modal/InstructorModal";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
const page: React.FC = () => {
  const { user, isLoggedIn } = useSelector(
    (state: IRootState) => state.userSlice
  );
  const { apply, isLoading } = useBecomeAnInstructor();
  const { data, isLoading: StatusLoading } =
    useGetInstructorApplicationStatus();

  const features = [
    {
      name: "Trusted",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Over 5000+ Courses",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M1 4.75C1 3.784 1.784 3 2.75 3h14.5c.966 0 1.75.784 1.75 1.75v10.515a1.75 1.75 0 01-1.75 1.75h-1.5c-.078 0-.155-.005-.23-.015H4.48c-.075.01-.152.015-.23.015h-1.5A1.75 1.75 0 011 15.265V4.75zm16.5 7.385V11.01a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25zm0 2.005a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .108.069.2.165.235h1.585a.25.25 0 00.25-.25v-1.11zm-15 1.11v-1.11a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v1.125a.25.25 0 01-.164.235H2.75a.25.25 0 01-.25-.25zm2-4.24v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V11.01a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25zm13-2.005V7.88a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25zM4.25 7.63a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V7.88a.25.25 0 01.25-.25h1.5zm0-3.13a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25h1.5zm11.5 1.625a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5zm-9 3.125a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "400 ratings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const [isVideoPoppedUp, setVideoPopUp] = useState(false);

  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);

  return (
    <section>
      <div className="mx-auto max-w-screen-xl gap-12 px-4 py-28 text-gray-600 md:px-8 xl:flex">
        <div className="mx-auto max-w-2xl space-y-5 text-center xl:text-left">
          <div className="flex flex-wrap items-center justify-center gap-6 xl:justify-start">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-x-2 text-sm text-gray-500"
              >
                {item.icon}
                {item.name}
              </div>
            ))}
          </div>
          {!user?.user_roles?.is_instructor && (
            <div>
              <h1 className="mx-auto mb-4 text-4xl font-extrabold text-gray-800 md:text-5xl">
                Become an Instructor and Empower Minds
              </h1>
              <p className="mx-auto max-w-xl xl:mx-0">
                Join our community of educators and share your expertise to make
                a lasting impact. By becoming an instructor on our platform, you
                have the opportunity to inspire learners, foster growth, and
                shape the future. Why join us as an instructor?
              </p>
              <p className="mx-auto max-w-xl xl:mx-0">
                Join us in revolutionizing education and empowering minds.
                Together, let's create a world where learning knows no bounds.
              </p>
            </div>
          )}
          {user?.user_roles?.is_instructor && (
            <div>
              <h1 className="mx-auto text-4xl font-extrabold text-gray-800 md:text-5xl">
                Congratulations on Becoming an Instructor!
              </h1>
              <p className="mx-auto max-w-xl xl:mx-0">
                Welcome to the exciting journey of becoming an instructor on our
                platform. Your decision to share your knowledge is a significant
                step, and we're here to support you along the way. Here are some
                valuable pieces of advice to make the most out of your
                instructor experience:
              </p>

              <p className="mx-auto max-w-xl xl:mx-0">
                Remember, becoming an instructor is not just about teaching;
                it's about inspiring and empowering others. Your expertise has
                the power to transform lives. Best of luck on your journey!
              </p>
            </div>
          )}

          <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0 xl:justify-start">
            {!data?.status && !StatusLoading && (
              <Button
                onClick={() => setIsInstructorModalOpen(true)}
                className="bg-primary flex items-center justify-center gap-x-2 rounded-lg px-4 py-2 font-medium text-white duration-150 hover:bg-gray-700 active:bg-gray-900 md:inline-flex"
              >
                Apply for instructor
              </Button>
            )}
          </div>
          {Number(data?.status) === STATUS.PENDING && !StatusLoading && (
            <div
              className="mb-4 flex items-center rounded-lg border border-blue-300 bg-primary/10 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400"
              role="alert"
            >
              <svg
                className="me-3 inline h-4 w-4 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Pending</span>
              <div>
                Your application is pending. We will get back to you soon.
              </div>
            </div>
          )}
          {Number(data?.status) === STATUS.ACTIVE && !StatusLoading && (
            <div
              className="mb-4 flex items-center rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-gray-800 dark:text-blue-400"
              role="alert"
            >
              <svg
                className="me-3 inline h-4 w-4 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <div>You are an instructor!</div>
            </div>
          )}
        </div>
        <div className="mx-auto mt-14 max-w-xl flex-1 xl:mt-0">
          <div className="relative">
            <img
              src="/images/become-instructor.avif"
              className="rounded-lg"
              alt=""
            />
            <button
              className="bg-primary hover:bg-primary absolute inset-0 m-auto h-16 w-16 rounded-full text-white ring-offset-2 duration-150 focus:ring"
              onClick={() => setVideoPopUp(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="m-auto h-6 w-6"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isVideoPoppedUp ? (
        <div className="fixed inset-0 flex h-full w-full items-center justify-center">
          <div
            className="absolute inset-0 h-full w-full bg-black/50"
            onClick={() => setVideoPopUp(false)}
          ></div>
          <div className="relative px-4">
            <button
              className="mb-5 h-12 w-12 rounded-full bg-gray-800 text-white duration-150 hover:bg-gray-700"
              onClick={() => setVideoPopUp(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="m-auto h-5 w-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
            <ReactPlayer
              url="https://www.youtube.com/watch?v=vrU6YJle6Q4"
              controls
              width="600px"
              height="400px"
              className="rounded-lg"
            />
          </div>
        </div>
      ) : (
        ""
      )}
      {isInstructorModalOpen && (
        <InstructorModal
          isInstructorModalOpen={isInstructorModalOpen}
          setIsInstructorModalOpen={setIsInstructorModalOpen}
        />
      )}
    </section>
  );
};

export default page;
