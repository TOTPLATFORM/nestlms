"use client";
import BreadcrumbComp from "@/components/breadcrumb/BreadcrumbComp";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { TbInfoOctagonFilled } from "react-icons/tb";
import { MdOutlineLanguage } from "react-icons/md";
import { SiAudioboom } from "react-icons/si";
import { MdOutlineQuiz } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { GrCertificate } from "react-icons/gr";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { LiaCertificateSolid } from "react-icons/lia";

import {
  ArrowLeftFromLine,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  File,
  FileVideo,
  Languages,
  Layers,
  Minus,
  Play,
  PlayCircleIcon,
  Plus,
  ShieldCheck,
  TimerIcon,
  User,
  Wrench,
  X,
  Youtube,
} from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";
import AnimateHeight from "react-animate-height";
import { cn, formatDate } from "@/lib/utils";
import { FaHouseUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import {
  useGetEnrolledCourseDetails,
  useGetPublicCourseDetails,
  useGetQuizDetailsByQuizId,
  useGetUserReviewDetailsByCourseId,
} from "@/hooks/user/course.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { COURSE_LEVEL, LIVE_CLASS_STATUS } from "@/constant/core";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import CustomModal from "@/components/modal/CustomModal";
import CreateReview from "@/section/user/course/review/CreateReview";
import {
  generateCertificateByCourseIdApi,
  showQuizResultByQuizIdApi,
  startQuizByQuizIdApi,
  submitLessonCheckedApi,
  submitQuizAnswerApi,
} from "@/service/user/course";
import { errorToast, processResponse } from "@/lib/helper";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import NoItem from "@/components/NoItem";
import CustomImage from "@/components/CustomImage";
import { Badge } from "flowbite-react";
import moment from "moment";
import { useJoinLiveClassForStudentFormHandler } from "@/hooks/user/user.settings.hook";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const sortOptions = [
  { name: "Newest", value: "latest" },
  { name: "Price High to Low", value: "price_high_to_low" },
  { name: "Price Low to High", value: "price_low_to_high" },
];

const coursesLevelOptions = [
  { value: COURSE_LEVEL.BEGINNER, label: "Beginner" },
  { value: COURSE_LEVEL.INTERMEDIATE, label: "Intermediate" },
  { value: COURSE_LEVEL.ADVANCED, label: "Advanced" },
];

const tabSections = [
  {
    id: 1,
    name: "Overview",
  },
  {
    id: 2,
    name: "Reviews",
  },
  {
    id: 3,
    name: "Certificates",
  },
];

const liveClass = {
  id: 4,
  name: "Live Class",
};

export default function CourseLecture({ params: { id } }: any) {
  const [page, setPage] = useState<any>(1);
  const [limit, setLimit] = useState(1);

  const router = useRouter();
  const [totalCompletePercentege, setTotalCompletePercentege] =
    useState<any>(0);

  const [checkedAnswer, setcheckedAnswer] = useState<any>([]);

  const [showQuizResults, setShowQuizResults] = useState<any>(false);

  const [quizResults, setQuizResults] = useState<any>({});

  const [viewOffset, setViewOffset] = useState([]);

  const [activeQuiz, setActiveQuiz] = useState<any>({});

  const [startQuiz, setStartQuiz] = useState(false);

  const [startedQuizQuestions, setStartedQuizQuestions] = useState<any>({});

  const [allLessons, setAllLessons] = useState<any>([]);

  const { data: enrolledCourseDetails, isLoading } =
    useGetEnrolledCourseDetails(id);

  const { joinLiveClassHandler } = useJoinLiveClassForStudentFormHandler();

  const { data: reviewDetails, isLoading: reviewIsLoading } =
    useGetUserReviewDetailsByCourseId(id);

  const { data: quizDetails, isLoading: quizIsLoading } =
    useGetQuizDetailsByQuizId(activeQuiz?.id);

  const [activeTab, setActiveTab] = useState<any>(1);

  const [openModalForReview, setOpenModalForReview] = useState<any>(false);

  const [activeLesson, setActiveLesson] = useState<any>({});

  const [isCourseContentOpen, setIsCourseContentOpen] = useState(true);

  const { t } = useTranslation();
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  const startQuizHandler = async () => {
    if (!activeQuiz?.id) {
      errorToast("Select a Quiz");
      return;
    }
    let queryStr = `limit=${limit}&offset=${page}`;

    if (viewOffset.length > 0) {
      let newOffset = viewOffset.join(",");
      queryStr += `&visited_offset=${newOffset}`;
    }

    const response = await startQuizByQuizIdApi(activeQuiz?.id, queryStr);

    if (!response.success) {
      errorToast(response.message);
      return;
    }
    setStartQuiz(true);
    setStartedQuizQuestions(response.data);
  };

  const submitQuizHandler = async () => {
    if (!activeQuiz?.id) {
      errorToast("Select a Quiz");
      return;
    }

    if (checkedAnswer?.length === 0) {
      errorToast("Please select a Answer");
      return;
    }

    let submitAnswerValue = {
      quiz_id: activeQuiz?.id,
      quiz_question_id: startedQuizQuestions?.list[0].id,
      answer: checkedAnswer.join(",").toString(),
    };

    const answer = await submitQuizAnswerApi(submitAnswerValue);

    if (!answer.success) {
      errorToast(answer.message);
      return;
    }

    setcheckedAnswer([]);

    if (!startedQuizQuestions.meta.next) {
      showQuizResultHandler();
      return;
    }

    startQuizHandler();
  };

  const showQuizResultHandler = async () => {
    const result = await showQuizResultByQuizIdApi(activeQuiz?.id);

    if (!result.success) {
      errorToast(result.message);
      return;
    }
    setShowQuizResults(true);

    setQuizResults(result?.data);
  };
  useEffect(() => {
    if (!enrolledCourseDetails) {
      return;
    }

    if (!enrolledCourseDetails?.success) {
      errorToast(enrolledCourseDetails?.message);
      router.push("/");
      return;
    }

    setTotalCompletePercentege(
      enrolledCourseDetails?.data?.total_complete_percentage
    );
    if (enrolledCourseDetails?.data?.Section?.length === 0) {
      return;
    }
    if (enrolledCourseDetails?.data?.Section[0].Lesson?.length === 0) {
      return;
    }
    setActiveLesson(enrolledCourseDetails?.data?.Section[0].Lesson[0]);
    const allLessons = enrolledCourseDetails?.data?.Section.reduce(
      (lessons: any, section: any) => {
        if (section.Lesson && section.Lesson.length > 0) {
          lessons = lessons.concat(section.Lesson);
        }
        return lessons;
      },
      []
    );

    setAllLessons(allLessons);
  }, [enrolledCourseDetails?.data]);

  const closeModalForReview = () => {
    setOpenModalForReview(false);
  };

  const ratingFilterHandler = (number: any) => {
    if (reviewDetails?.data?.total_review_data?.rating_groupBy?.length === 0) {
      return 0;
    }
    return (
      reviewDetails?.data?.total_review_data?.rating_groupBy.find(
        (item: any) => item.rating == number
      )?.percentage || 0
    );
  };

  useEffect(() => {
    if (!startQuiz) return;
    submitQuizHandler();
  }, [page, viewOffset]);

  const quizNextButtonHandler = (nextPage: any, currentPage: any) => {
    if (nextPage) {
      setPage(nextPage);
    }
    let newOffset: any = [...viewOffset];
    newOffset.push(currentPage);
    newOffset = newOffset.filter(
      (currentValue: any, index: any, arr: any) =>
        arr.indexOf(currentValue) === index
    );

    setViewOffset(newOffset);
  };

  const handleAnswerCheckedValue = (value: any, answerId: any) => {
    let newCheckedAnswerIds = [...checkedAnswer];

    if (!value) {
      newCheckedAnswerIds = newCheckedAnswerIds.filter(
        (item: any) => item != answerId
      );
      setcheckedAnswer(newCheckedAnswerIds);
      return;
    }

    let existsAnswer =
      newCheckedAnswerIds.filter((item: any) => item == answerId) || [];
    if (existsAnswer.length === 0) {
      newCheckedAnswerIds.push(answerId);
      setcheckedAnswer(newCheckedAnswerIds);
      return;
    }

    newCheckedAnswerIds = newCheckedAnswerIds.filter(
      (item: any) => item.id != answerId
    );
    setcheckedAnswer(newCheckedAnswerIds);
  };

  const handleQuizWarning = (type: any, item: any) => {
    if (!startQuiz) {
      if (type == "lesson") {
        setActiveLesson(item);
        setActiveQuiz({});
        setShowQuizResults(false);
        setQuizResults({});
      } else {
        setActiveLesson({});
        setActiveQuiz(item);
        setShowQuizResults(false);
        setQuizResults({});
      }

      return;
    }
    Swal.fire({
      title: "Do you want to Cancel?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (type == "lesson") {
          setActiveLesson(item);
          setActiveQuiz({});
        } else {
          setActiveLesson({});
          setActiveQuiz(item);
        }
        setStartQuiz(false);
        setcheckedAnswer([]);
        setPage(1);
        setViewOffset([]);
        setShowQuizResults(false);
        setQuizResults({});
      }
    });
  };

  const handleLessonChecked = async (
    isChecked: any,
    lessonId: any,
    sectionId: any
  ) => {
    try {
      let value: any = {
        course_id: Number(id),
        lession_id: Number(lessonId),
        section_id: Number(sectionId),
      };
      const response = await submitLessonCheckedApi(value);
      if (response.success) {
        let updateLesson = [...allLessons];
        updateLesson = updateLesson.map((lesson: any) => {
          if (lesson.id == lessonId) {
            return {
              ...lesson,
              is_completed: isChecked,
            };
          }
          return lesson;
        });
        setAllLessons(updateLesson);
        setTotalCompletePercentege(response?.data?.total_complete_percentage);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  const checkIsLessonComp = (lessonId: any) => {
    if (!allLessons || allLessons.length == 0) {
      return;
    }

    return allLessons.find((item: any) => item.id == lessonId)?.is_completed;
  };

  const handleActiveTabHandler = (tabNO: any) => {
    if (tabNO == 3 && totalCompletePercentege != 100) {
      errorToast("Please Complete Full Course");
      setActiveTab(activeTab);
      return;
    }
    setActiveTab(tabNO);
  };

  const handleGenerateCertificate = async () => {
    if (!id) {
      errorToast("Invalid Course ID");
      return;
    }
    try {
      const response = await generateCertificateByCourseIdApi(id);
      processResponse(response);
      if (response.success) {
        const link = document.createElement("a");

        link.href = response?.data?.file_path;

        link.download = "Certificate";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return (
    <>
      <div className="relative">
        <section>
          <div
            className={` relative  text-white ${
              isCourseContentOpen && "lg:mr-[24rem]"
            }`}
          >
            {!isCourseContentOpen && (
              <div
                className="bg-primary absolute right-0 top-[30px] z-50 inline-block cursor-pointer rounded-[8px] p-2"
                onClick={() => setIsCourseContentOpen(!isCourseContentOpen)}
              >
                <ArrowLeftFromLine className="h-6 w-6 text-white" />
              </div>
            )}

            <div className="h-[300px] w-full lg:h-[600px]">
              {activeLesson?.id && (
                <ReactPlayer
                  url={` ${
                    activeLesson?.video_url
                      ? activeLesson?.video_url
                      : "https://www.youtube.com/watch?v=HihakYi5M2I"
                  } `}
                  controls
                  width="100%"
                  height="100%"
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        showinfo: 0,
                        fs: 1,
                        rel: 0,
                        start: 3,
                      },
                    },
                    file: { attributes: { controlsList: "nodownload" } },
                  }}
                  playIcon={<PlayCircleIcon size={75} color="white" />}
                  light={
                    enrolledCourseDetails?.thumbnail_link ||
                    "/images/course_banner.avif"
                  }
                  onContextMenu={(e: any) => e.preventDefault()}
                />
              )}
              {activeQuiz?.id && (
                <div className="h-[600px] w-full text-[#000000]">
                  {showQuizResults ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="mx-auto w-2/3 max-w-2xl border  p-6">
                        <h2 className="text-3xl font-bold">
                          {quizDetails?.data?.title}
                        </h2>
                        <div className="mt-2 flex items-center gap-4 divide-x text-sm">
                          <p>Total Marks: {quizResults?.total_marks} </p>
                          <p className="pl-4">
                            Result:{" "}
                            {quizResults?.total_marks <
                            quizResults?.pass_mark ? (
                              <span className="text-red-600">Failed</span>
                            ) : (
                              <span className="text-primary">Passed</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full p-6">
                      {startQuiz ? (
                        <div className="flex h-full w-full flex-col justify-between">
                          <div className="flex h-full py-8">
                            {startedQuizQuestions?.list?.length > 0 &&
                              startedQuizQuestions?.list?.map(
                                (question: any) => (
                                  <div
                                    className=" mx-auto w-2/3 max-w-2xl"
                                    key={question.id}
                                  >
                                    <p className="mb-1 text-sm">
                                      Question{" "}
                                      {startedQuizQuestions?.meta?.currentPage}{" "}
                                      :
                                    </p>
                                    <h2 className="text-lg capitalize">
                                      {question.title}
                                    </h2>
                                    <div className="mt-4">
                                      {question?.QuizQuestionAnswer?.length >
                                      0 ? (
                                        question?.QuizQuestionAnswer?.map(
                                          (answer: any) => (
                                            <div
                                              className="hover:bg-primary/10 mb-4 flex flex-row items-start space-x-3 space-y-0 border p-4 last:mb-0"
                                              key={answer?.id}
                                            >
                                              <Checkbox
                                                id={`answer-${answer.id}`}
                                                onCheckedChange={(value) => {
                                                  handleAnswerCheckedValue(
                                                    value,
                                                    answer.id
                                                  );
                                                }}
                                              />
                                              <div className="space-y-1 leading-none">
                                                <label
                                                  htmlFor={`answer-${answer.id}`}
                                                  className="cursor-pointer"
                                                >
                                                  {answer.title}
                                                </label>
                                              </div>
                                            </div>
                                          )
                                        )
                                      ) : (
                                        <NoItem
                                          notFoundtext={`No Answer Found.`}
                                        />
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                          <div className="flex items-center justify-between border-y py-2">
                            <p>
                              Question {startedQuizQuestions?.meta?.currentPage}{" "}
                              of {startedQuizQuestions?.meta?.total}
                            </p>

                            <div className="flex items-center gap-4">
                              {!startedQuizQuestions?.meta?.next ? (
                                <Button
                                  type="button"
                                  color="gray"
                                  onClick={() =>
                                    quizNextButtonHandler(
                                      startedQuizQuestions?.meta?.next,
                                      startedQuizQuestions?.meta?.currentPage
                                    )
                                  }
                                >
                                  Submit
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  color="gray"
                                  disabled={!startedQuizQuestions?.meta?.next}
                                  onClick={() =>
                                    quizNextButtonHandler(
                                      startedQuizQuestions?.meta?.next,
                                      startedQuizQuestions?.meta?.currentPage
                                    )
                                  }
                                >
                                  Next
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-3xl font-bold">
                            {quizDetails?.data?.title}
                          </h2>
                          <div className="mt-2 flex items-center gap-4 divide-x text-sm">
                            <p>{quizDetails?.data?.total_question} Question </p>
                            <p className="pl-4">
                              {quizDetails?.data?.time} Min{" "}
                            </p>
                            <p className="pl-4">
                              Maximum Attempts {quizDetails?.data?.max_attempts}{" "}
                            </p>
                            <p className="pl-4">
                              Pass Mark {quizDetails?.data?.pass_mark}{" "}
                            </p>
                          </div>
                          <div className="mt-8 flex items-center gap-4">
                            <Button
                              type="button"
                              onClick={startQuizHandler}
                              disabled={
                                quizDetails?.data?.total_question == 0
                                  ? true
                                  : false
                              }
                            >
                              Start Quiz
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {isCourseContentOpen && (
          <div className="absolute bottom-0 top-0 z-10 w-[80vw] overflow-y-auto bg-white shadow-md lg:right-0  lg:w-[24rem]">
            <div className="sticky top-0">
              {enrolledCourseDetails?.data?.Section?.length === 0 ? (
                <NoItem notFoundtext={`No results.`} />
              ) : (
                <div>
                  <div className="flex  w-full  items-center justify-between bg-white p-4 text-sm text-gray-900 hover:text-gray-900">
                    <h3 className="font-bold text-gray-900">Course content</h3>

                    <div className="flex items-center gap-x-4">
                      <div className="max-w-[30px]">
                        <CircularProgressbar
                          value={totalCompletePercentege}
                          text={`${totalCompletePercentege}%`}
                          minValue={0}
                          maxValue={100}
                          className="stroke-primary h-[30px] w-[30px]"
                        />
                      </div>
                      <div>
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => setIsCourseContentOpen(false)}
                        />
                      </div>
                    </div>
                  </div>
                  {enrolledCourseDetails?.data?.Section.map(
                    (item: any, index: any) => (
                      <Disclosure
                        as="div"
                        className=" border-b"
                        defaultOpen={index == 0 ? true : false}
                        key={index}
                      >
                        {({ open }) => (
                          <>
                            <h3 className=" flow-root">
                              <Disclosure.Button className="w-full  bg-[#f7f9fa]  p-4 text-sm text-gray-900 hover:text-gray-900">
                                <div className="flex items-center justify-between">
                                  <span className=" font-bold text-gray-900">
                                    Section {index + 1}: {item.title}
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <Minus className="h-5 w-5" />
                                    ) : (
                                      <Plus className="h-5 w-5" />
                                    )}
                                  </span>
                                </div>
                                <div className="mt-1 text-left text-xs">
                                  <span>0-3 / 3min</span>
                                </div>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className=" bg-white ">
                              <div className="space-y-4">
                                {item?.Lesson?.length > 0 &&
                                  item?.Lesson?.map(
                                    (lessonItem: any, index: any) => (
                                      <div
                                        className={cn(
                                          "flex cursor-pointer items-center justify-between p-4 text-sm first:mt-0 last:mb-0",
                                          activeLesson?.id == lessonItem.id &&
                                            "bg-[#d1d7dc]"
                                        )}
                                        key={index}
                                        onClick={() => {
                                          handleQuizWarning(
                                            "lesson",
                                            lessonItem
                                          );
                                        }}
                                      >
                                        <div className="flex items-start gap-x-4">
                                          <div className="mt-0.5">
                                            <Checkbox
                                              checked={checkIsLessonComp(
                                                lessonItem.id
                                              )}
                                              onCheckedChange={(value) =>
                                                handleLessonChecked(
                                                  value,
                                                  lessonItem.id,
                                                  item?.id
                                                )
                                              }
                                            />
                                          </div>
                                          <div>
                                            <p>
                                              {index + 1}. {lessonItem.title}
                                            </p>
                                            <div className="mt-2 flex items-center gap-x-1 text-[#6a6f73]">
                                              <Youtube className="h-4 w-4 " />
                                              <span className="text-xs">
                                                3min
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                              <div className="space-y-4">
                                {item?.Quiz?.length > 0 &&
                                  item?.Quiz?.map(
                                    (quizItem: any, index: any) => (
                                      <div
                                        className={cn(
                                          "flex cursor-pointer items-center justify-between p-4 text-sm first:mt-0 last:mb-0",
                                          activeQuiz?.id == quizItem.id &&
                                            "bg-[#d1d7dc]"
                                        )}
                                        key={index}
                                        onClick={() => {
                                          handleQuizWarning("quiz", quizItem);
                                        }}
                                      >
                                        <div className="flex items-start gap-x-4">
                                          <div className="mt-0.5">
                                            <Checkbox
                                              checked={
                                                quizItem?.is_completed == 1
                                                  ? true
                                                  : false
                                              }
                                              disabled
                                            />
                                          </div>
                                          <div>
                                            <p>
                                              Quiz {index + 1}. {quizItem.title}
                                            </p>
                                            <div className="mt-2 flex items-center gap-x-1 text-[#6a6f73]">
                                              <File className="h-4 w-4 " />
                                              <span className="text-xs">
                                                {quizItem.time}min
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <section>
          <div className={`px-4 ${isCourseContentOpen && "lg:pr-[24rem]"}`}>
            <div className=" bg-white">
              <div className="">
                <div className="inline-block w-full">
                  <ul className="mb-3 flex flex-wrap border-b border-gray-200 text-center dark:border-gray-700 ">
                    {tabSections.map((item: any) => (
                      <li key={item.id}>
                        <button
                          className={`${
                            activeTab === item.id
                              ? "border-primary text-primary border-b-2"
                              : ""
                          }
                 dark:border-primary dark:text-primary flex cursor-pointer items-center justify-center gap-x-2  rounded-t-lg p-4 text-sm  font-medium first:ml-0 hover:border-b-2  focus:outline-none focus:!ring-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500`}
                          onClick={() => handleActiveTabHandler(item.id)}
                        >
                          <span>{t(item.name)}</span>
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        className={`${
                          activeTab === liveClass.id
                            ? "border-primary text-primary border-b-2"
                            : ""
                        }
                 dark:border-primary dark:text-primary flex cursor-pointer items-center justify-center gap-x-2  rounded-t-lg p-4 text-sm  font-medium first:ml-0 hover:border-b-2  focus:outline-none focus:!ring-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500`}
                        onClick={() => handleActiveTabHandler(liveClass.id)}
                      >
                        <span>{t(liveClass.name)}</span>
                      </button>
                    </li>
                  </ul>

                  <div>
                    <div className="mb-5">
                      {activeTab === 1 && (
                        <div className=" flex h-full flex-1 flex-col space-y-8 px-4">
                          <div className="border-b pb-5">
                            <h3 className=" mb-5 text-xl font-bold">
                              About this course
                            </h3>
                            <p className="max-w-2xl text-sm">
                              {enrolledCourseDetails?.data?.short_description}
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-4 border-b pb-5 text-sm">
                            <p>By the numbers</p>
                            <div>
                              <p>
                                Skill level:{" "}
                                {coursesLevelOptions?.find(
                                  (item: any) =>
                                    item.value ==
                                    enrolledCourseDetails?.data?.course_level
                                )?.label || ""}
                              </p>
                              <p>
                                Students:{" "}
                                {enrolledCourseDetails?.data?.total_students}
                              </p>
                            </div>
                            <div>
                              <p>
                                Lectures:{" "}
                                {enrolledCourseDetails?.data?.total_lessons}
                              </p>
                              <p>
                                Video: {enrolledCourseDetails?.data?.duration}{" "}
                                total mins
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 border-b pb-5 text-sm">
                            <p>Description</p>
                            <div className="col-span-2">
                              <p>{enrolledCourseDetails?.data?.description}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 border-b pb-5 text-sm">
                            <p>Instructor</p>
                            <div className="col-span-2">
                              <div
                                className={cn(
                                  "mb-4 flex items-center gap-x-4 text-base"
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-[50px] w-[50px] overflow-hidden rounded-full"
                                  )}
                                >
                                  <CustomImage
                                    imageUrl={
                                      enrolledCourseDetails?.data?.User?.photo
                                        ? enrolledCourseDetails?.data?.User
                                            ?.photo
                                        : "/images/profile-pic.jpeg"
                                    }
                                  />
                                </div>
                                <div>
                                  <h2 className="text-lg font-bold">
                                    {
                                      enrolledCourseDetails?.data?.User
                                        ?.first_name
                                    }{" "}
                                    {
                                      enrolledCourseDetails?.data?.User
                                        ?.last_name
                                    }
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mb-5">
                      {activeTab === 2 && (
                        <div className=" flex h-full flex-1 flex-col space-y-8 px-4">
                          <div className="pb-5">
                            <h3 className=" mb-5 text-xl font-bold">
                              Student feedback
                            </h3>
                            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                              <div className="col-span-2 2xl:col-span-1">
                                <p className="text-5xl font-bold text-[#FFA41B]">
                                  {
                                    reviewDetails?.data?.total_review_data
                                      ?.average_rating
                                  }
                                </p>
                                <div className="flex items-center gap-1 pb-2.5">
                                  {[1, 2, 3, 4, 5].map((index) => {
                                    if (
                                      index <=
                                      Math.ceil(
                                        reviewDetails?.data?.total_review_data
                                          ?.average_rating
                                      )
                                    ) {
                                      return (
                                        <IoIosStar
                                          color="#FFA41B"
                                          size={18}
                                          key={index}
                                        />
                                      );
                                    }
                                    return (
                                      <IoIosStarOutline
                                        color="#FFA41B"
                                        size={18}
                                        key={index}
                                      />
                                    );
                                  })}
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-[#FFA41B]">
                                    Tutorial rating
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-10 2xl:col-span-11">
                                {[5, 4, 3, 2, 1].map((item) => (
                                  <div
                                    className="mb-2 flex items-center gap-x-2"
                                    key={item}
                                  >
                                    <div className="h-2  w-9/12 bg-slate-200">
                                      <div
                                        className="h-full bg-slate-500"
                                        style={{
                                          width: `${ratingFilterHandler(
                                            item
                                          )}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex w-2/12 items-center justify-end gap-1">
                                      {[1, 2, 3, 4, 5].map((index) => {
                                        if (index <= item) {
                                          return (
                                            <IoIosStar
                                              color="#FFA41B"
                                              size={18}
                                              key={index}
                                            />
                                          );
                                        }
                                        return (
                                          <IoIosStarOutline
                                            color="#FFA41B"
                                            size={18}
                                            key={index}
                                          />
                                        );
                                      })}
                                    </div>
                                    <div className="w-1/12 text-right">
                                      <p className="text-primary text-sm underline">
                                        {ratingFilterHandler(item)}%
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="pb-5">
                            <div className="flex items-center justify-between">
                              <h3 className=" mb-5 text-xl font-bold">
                                Reviews
                              </h3>
                              <Button
                                type="button"
                                onClick={() => setOpenModalForReview(true)}
                              >
                                Write A Review
                              </Button>
                            </div>

                            <div className="mt-6">
                              {reviewDetails?.data?.review_list?.length ===
                              0 ? (
                                <NoItem notFoundtext={`No results.`} />
                              ) : (
                                reviewDetails?.data?.review_list?.map(
                                  (review: any, index: number) => (
                                    <div
                                      className={cn(
                                        "flex items-start gap-x-6 border-b py-4 text-base"
                                      )}
                                      key={index}
                                    >
                                      <div
                                        className={cn(
                                          "h-[50px] min-h-[50px] w-[50px] min-w-[50px] overflow-hidden rounded-full"
                                        )}
                                      >
                                        <CustomImage
                                          imageUrl={
                                            review.user.photo ||
                                            "/images/profile-pic.jpeg"
                                          }
                                        />
                                      </div>
                                      <div>
                                        <h2 className="text-lg font-bold">
                                          {review.user.first_name}{" "}
                                          {review.user.last_name}
                                        </h2>
                                        <div className="mb-2 flex items-center gap-x-2">
                                          <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((index) => {
                                              if (index <= review.rating) {
                                                return (
                                                  <IoIosStar
                                                    color="#FFA41B"
                                                    size={18}
                                                    key={index}
                                                  />
                                                );
                                              }
                                              return (
                                                <IoIosStarOutline
                                                  color="#FFA41B"
                                                  size={18}
                                                  key={index}
                                                />
                                              );
                                            })}
                                          </div>
                                          <div>
                                            <p className="text-xs">
                                              {review.created_at}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="max-w-2xl">
                                          <p className="text-xs text-[#2d2f31]">
                                            {review.content}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mb-5">
                      {activeTab === 3 && (
                        <div className="h-full w-full rounded-[8px] border p-8">
                          <div className="flex flex-col items-center justify-center gap-y-4">
                            <div>
                              <GrCertificate
                                size={100}
                                className="text-primary"
                              />
                            </div>
                            <div>
                              <Button
                                type="button"
                                onClick={handleGenerateCertificate}
                              >
                                Claim Certificate
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mb-5">
                      {activeTab === 4 && (
                        <div className="min-h-[300px] px-2 md:px-8">
                          {enrolledCourseDetails?.data?.LiveClass?.length ==
                          0 ? (
                            <NoItem notFoundtext="Live Class Not Found" />
                          ) : (
                            enrolledCourseDetails?.data?.LiveClass?.map(
                              (liveClassItem: any, index: any) => (
                                <div
                                  className="mb-4 flex items-center justify-between rounded-md border p-3 last:mb-0"
                                  key={index}
                                >
                                  <h3 className="font-medium">
                                    {liveClassItem?.title}
                                  </h3>
                                  <p className="text-sm">
                                    {moment(
                                      liveClassItem?.start_date_time
                                    ).format("DD-MM-yyyy, h:mm:ss a")}
                                  </p>
                                  <div>
                                    {liveClassItem?.status ==
                                    LIVE_CLASS_STATUS.UPCOMING ? (
                                      <Badge color={`yellow`}>Upcoming</Badge>
                                    ) : liveClassItem?.status ==
                                      LIVE_CLASS_STATUS.LIVE ? (
                                      <Badge color={`green`}>Live</Badge>
                                    ) : (
                                      <Badge color={`failure`}>End</Badge>
                                    )}
                                  </div>
                                  <div>
                                    {liveClassItem?.status ==
                                      LIVE_CLASS_STATUS.LIVE && (
                                      <Button
                                        onClick={() =>
                                          joinLiveClassHandler({
                                            class_id: Number(liveClassItem?.id),
                                            class_name:
                                              liveClassItem?.channel_name,
                                          })
                                        }
                                        className="h-min rounded-full py-0.5 text-sm"
                                      >
                                        Join
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <CustomModal
        header={`Add Review`}
        close={closeModalForReview}
        isModalOpen={openModalForReview}
        modalSize={"2xl"}
        modalPlacement={"center"}
      >
        <div className="space-y-6">
          <CreateReview
            courseId={enrolledCourseDetails?.data?.id}
            closeModal={closeModalForReview}
          />
        </div>
      </CustomModal>
    </>
  );
}
