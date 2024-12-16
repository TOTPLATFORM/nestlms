"use client";
import BreadcrumbComp from "@/components/breadcrumb/BreadcrumbComp";
import Link from "next/link";
import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { TbInfoOctagonFilled } from "react-icons/tb";
import { MdOutlineLanguage } from "react-icons/md";
import { SiAudioboom } from "react-icons/si";
import { MdOutlineQuiz } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { GrCertificate } from "react-icons/gr";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  FileVideo,
  Heart,
  Languages,
  Layers,
  Play,
  PlayCircleIcon,
  TimerIcon,
  User,
  Wrench,
} from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";
import AnimateHeight from "react-animate-height";
import { cn, formatDate } from "@/lib/utils";
import { FaHouseUser, FaPlayCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useGetPublicCourseDetails } from "@/hooks/user/course.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { COURSE_LEVEL } from "@/constant/core";
import { useAddCourseToCart } from "@/hooks/user/enrollment.hook";
import LoaderButton from "@/components/button/LoaderButton";
import { useRouter } from "next-nprogress-bar";
import { toast } from "react-toastify";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import { useAddCourseToWishlistOrRemove } from "@/hooks/user/public/course.category.hook";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function CourseSinglePage({ params: { slug } }: any) {
  const { data, isLoading, course_enrolled } = useGetPublicCourseDetails(slug);
  const { handleAddToCart, isLoading: CartAdding } = useAddCourseToCart();
  const [openSections, setOpenSections] = useState<number[]>([0]);
  const [expandAllSections, setExpandAllSections] = useState(false);
  const router = useRouter();

  const { handleWislistAddOrRemove } = useAddCourseToWishlistOrRemove();

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const collapseAllSections = () => {
    setOpenSections([]);
    setExpandAllSections(false);
  };
  return (
    <div className="relative">
      <section
        className="bg-secondary"
        style={{
          backgroundImage: `url("${data?.cover_image_link}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className=" relative overflow-visible py-12 text-white">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <NegativeXAxisAnimation isOneTime={true} classes={`container`}>
            <div className="relative z-10 max-w-lg xl:max-w-2xl 2xl:max-w-3xl">
              {isLoading ? (
                <Skeleton className="h-4 w-2/3" />
              ) : (
                <BreadcrumbComp
                  levelone="Home"
                  leveltwo={data?.category?.name}
                  levelthree={data?.sub_category?.name}
                />
              )}

              <div className="my-3">
                {isLoading ? (
                  <Skeleton className="w-3/3 mb-2 h-4" />
                ) : (
                  <h2 className="text-3xl font-bold">{data?.name}</h2>
                )}
              </div>
              <div className="my-3">
                {isLoading ? (
                  <Skeleton className="mb-2 h-4 w-1/3" />
                ) : (
                  <p>{data?.short_description}</p>
                )}
              </div>
              <div>
                <div className="flex items-center gap-x-2 text-sm">
                  {isLoading ? (
                    <>
                      <Skeleton className="mr-2 h-4 w-8" />
                      <Skeleton className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <p className=" text-[#FFA41B]">{data?.average_rating}</p>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <IoIosStar color="#FFA41B" size={13} key={item} />
                        ))}
                      </div>
                      <p className="underline">
                        ({data?.totalReviews} ratings)
                      </p>
                      <p>
                        {data?.total_students}{" "}
                        {data?.total_students > 1 ? "students" : "student"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="my-2">
                <div className="flex items-center gap-x-2 text-sm">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <p>Created by</p>
                      <Link
                        href={"/tutor-profile/" + data?.User?.user_name}
                        className="underline"
                      >
                        {" "}
                        {data?.User?.first_name} {data?.User?.last_name}
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-x-4 text-sm">
                  <div className="flex items-center gap-x-2">
                    <TbInfoOctagonFilled size={15} />
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      <p>Last updated {formatDate(data?.updated_at)}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-x-2">
                    <TimerIcon size={16} />
                    {isLoading ? (
                      <Skeleton className="h-4 w-10" />
                    ) : (
                      <p>{data?.duration} Min</p>
                    )}
                  </div>

                  <div className="flex items-center gap-x-2">
                    <SiAudioboom size={14} />
                    {isLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      <p>English [Auto]</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </NegativeXAxisAnimation>
        </div>
      </section>
      <PositiveXAxisAnimation
        classes={`top-0 z-10 mt-12 h-full w-full lg:absolute lg:right-[7%]  lg:w-[24rem] 2xl:right-[16%]`}
      >
        <div className="sticky top-0 rounded-[8px] bg-white shadow-md ">
          <div>
            <div className="relative overflow-hidden rounded-t-[8px]">
              {isLoading ? (
                <Skeleton className="h-[12rem] w-full" />
              ) : (
                <ReactPlayer
                  url={data?.demo_video}
                  controls
                  width="100%"
                  height={"200px"}
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
                  }}
                  playIcon={<FaPlayCircle size={75} color="white" />}
                  light={data?.thumbnail_link || "/images/course_banner.avif"}
                />
              )}
            </div>
            <div className={`p-4`}>
              <div className="pb-4">
                <div className="mb-2 flex items-center justify-start gap-x-4">
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    <p className="text-primary text-5xl font-bold">
                      ${data?.payable_price}
                    </p>
                  )}
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    <>
                      {data?.discount_status && (
                        <p className="text-3xl line-through">${data?.price}</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <div className="w-full">
                  {isLoading ? (
                    <Skeleton className="w-3/3 mb-8 h-8" />
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (course_enrolled) {
                          toast.warning("Already Enrolled");
                        } else {
                          handleAddToCart(data.id);
                        }
                      }}
                    >
                      <div>
                        {course_enrolled ? (
                          <Button type="button" className=" w-full">
                            View Play List
                          </Button>
                        ) : (
                          <LoaderButton
                            type="button"
                            isLoading={CartAdding}
                            loaderText="Adding To Cart"
                            buttonText="Add To Cart"
                            classNames="w-full"
                          />
                        )}
                      </div>
                    </form>
                  )}
                </div>
                <div
                  className="cursor-pointer rounded-full border p-2"
                  onClick={() =>
                    handleWislistAddOrRemove({
                      course_id: data?.id,
                    })
                  }
                >
                  <Heart className={`text-primary`} />
                </div>
              </div>

              <div className="mb-4 text-center">
                <p className="text-xs">30-Day Money-Back Guarantee</p>
              </div>
              <div>
                <h3 className=" mb-2 text-base font-bold">
                  This course includes:
                </h3>
                <div className="grid grid-cols-1">
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="flex items-center gap-x-2 ">
                      <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                        <FileVideo className="text-primary h-4 w-4" />
                      </div>
                      <p>Sections</p>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      <p>{data?.total_section}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="flex items-center gap-x-2 ">
                      <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                        <FileVideo className="text-primary h-4 w-4" />
                      </div>
                      <p>Lessons</p>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      <p>{data?.total_lessons}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="flex items-center gap-x-2 ">
                      <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                        <MdOutlineQuiz className="text-primary h-4 w-4" />
                      </div>
                      <p>Quizzes</p>
                    </div>

                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      <p>{data?.total_quiz}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="flex items-center gap-x-2 ">
                      <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                        <Clock className="text-primary h-4 w-4" />
                      </div>
                      <p>Duration</p>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      <p>
                        {data?.duration}
                        mins
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="flex items-center gap-x-2 ">
                      <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                        <GiSkills className="text-primary h-4 w-4" />
                      </div>
                      <p>Skill level</p>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      <p>
                        {data?.course_level === COURSE_LEVEL.BEGINNER
                          ? "Beginner"
                          : data?.duration === COURSE_LEVEL.INTERMEDIATE
                          ? "Intermediate"
                          : "Advanced"}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-b py-2 text-sm">
                    <div className="flex items-center gap-x-2 ">
                      <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                        <GrCertificate className="text-primary h-4 w-4" />
                      </div>
                      <p>Certificate</p>
                    </div>
                    {isLoading ? <Skeleton className="h-4 w-16" /> : <p>Yes</p>}
                  </div>
                  <div className="flex items-center justify-between  py-2 text-sm">
                    <div className="flex items-center gap-x-2 ">
                      <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                        <Wrench className="text-primary h-4 w-4" />
                      </div>
                      <p>Full lifetime access</p>
                    </div>
                    {isLoading ? <Skeleton className="h-4 w-16" /> : <p>Yes</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PositiveXAxisAnimation>
      <section className="min-h-[60vh]">
        <NegativeXAxisAnimation isOneTime={true} classes={`container`}>
          <div className="max-w-lg py-12 xl:max-w-2xl 2xl:max-w-3xl">
            <div className="mb-6 rounded-[8px] border p-6">
              <h3 className="mb-5 text-xl font-bold">What you'll learn</h3>
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                      className="flex items-center gap-x-2 text-sm"
                      key={item}
                    >
                      <Skeleton className="h-6 w-4" />
                      <Skeleton className="h-6 w-4/5" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {data?.what_you_will_learn
                    ?.split(",,,")
                    ?.map((item: string, index: number) => (
                      <div
                        className="flex items-center gap-x-2 text-sm"
                        key={index}
                      >
                        <Check className="h-4 w-4" />
                        <p>{item}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="mx-1 mb-5 text-xl font-bold">Course content</h3>
              <div>
                <div className="mx-2 flex items-center justify-between border-b py-2 text-sm">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </>
                  ) : (
                    <>
                      <p>
                        {data?.total_section} sections • {data?.total_lessons}{" "}
                        lectures
                      </p>
                      <p
                        className="text-primary cursor-pointer underline"
                        onClick={() =>
                          expandAllSections
                            ? collapseAllSections()
                            : setExpandAllSections((prev) => !prev)
                        }
                      >
                        {expandAllSections ? "Collapse" : "Expand all sections"}
                      </p>
                    </>
                  )}
                </div>

                <div>
                  {isLoading || !data?.Section
                    ? Array.from({ length: 5 }).map((_, sectionIndex) => (
                        <div
                          className="mb-2 rounded-[8px] border bg-white px-[20px] py-[30px] last:mb-0"
                          key={sectionIndex}
                        >
                          <div
                            className={`flex items-center justify-between text-sm  ${
                              sectionIndex === 0 && "mb-4 border-b pb-[20px] "
                            }`}
                          >
                            <div className="flex items-center gap-x-3 ">
                              {sectionIndex === 0 ? (
                                <Skeleton className="h-4 w-4" />
                              ) : (
                                <>
                                  <Skeleton className="h-4 w-7" />
                                </>
                              )}

                              <div>
                                <>
                                  <Skeleton className="mb-2 h-4 w-32" />
                                </>
                              </div>
                            </div>
                          </div>
                          <AnimateHeight
                            height={sectionIndex === 0 ? "auto" : 0}
                          >
                            <div>
                              {Array.from({ length: 5 }).map(
                                (_, lessonIndex) => (
                                  <div
                                    className="mb-4 flex items-center justify-between text-sm last:mb-0"
                                    key={lessonIndex}
                                  >
                                    <div className="flex items-center gap-x-4">
                                      <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                                        {isLoading ? (
                                          <Skeleton className="h-4 w-4" />
                                        ) : (
                                          <Play className="text-primary h-4 w-4" />
                                        )}
                                      </div>
                                      {isLoading ? (
                                        <Skeleton className="h-4 w-32" />
                                      ) : (
                                        <p>Lesson {lessonIndex + 1}</p>
                                      )}
                                    </div>
                                    <Skeleton className="h-4 w-24" />
                                  </div>
                                )
                              )}
                            </div>
                          </AnimateHeight>
                        </div>
                      ))
                    : data.Section.map((details: any, index: number) => (
                        <div
                          className="mb-2 rounded-[8px] border bg-white px-[20px] py-[30px] last:mb-0"
                          key={index}
                        >
                          <div
                            className={` ${
                              openSections.includes(index) &&
                              "border-b pb-[20px]"
                            } flex items-center justify-between  text-sm `}
                          >
                            <div className="flex items-center gap-x-3">
                              <button
                                onClick={() => toggleSection(index)}
                                className="focus:outline-none"
                              >
                                {openSections.includes(index) ? (
                                  <ChevronUp size={20} color="#818894" />
                                ) : (
                                  <ChevronDown size={20} color="#818894" />
                                )}
                              </button>

                              <div>
                                <h2 className="font-bold">{details?.title}</h2>
                              </div>
                            </div>
                            <div className="flex items-center gap-x-4">
                              {isLoading ? (
                                <Skeleton className="h-4 w-24" />
                              ) : (
                                <p>
                                  {details?.Lesson.length
                                    ? details?.Lesson.length
                                    : 0}{" "}
                                  Lessons
                                </p>
                              )}
                            </div>
                          </div>
                          <AnimateHeight
                            height={
                              expandAllSections || openSections.includes(index)
                                ? "auto"
                                : 0
                            }
                          >
                            <div>
                              {details?.Lesson?.map((item: any) => (
                                <div
                                  className="mb-4 mt-4 flex items-center justify-between text-sm last:mb-0"
                                  key={item}
                                >
                                  <div className="flex items-center gap-x-4">
                                    <div className="bg-primary/10 flex items-center justify-center rounded-full p-1.5">
                                      {isLoading ? (
                                        <Skeleton className="h-4 w-4" />
                                      ) : (
                                        <Play className="text-primary h-4 w-4" />
                                      )}
                                    </div>
                                    {isLoading ? (
                                      <Skeleton className="h-4 w-32" />
                                    ) : (
                                      <p>{item?.title}</p>
                                    )}
                                  </div>
                                  <p className="text-primary underline">
                                    Preview
                                  </p>
                                </div>
                              ))}
                            </div>
                          </AnimateHeight>
                        </div>
                      ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className=" mb-5 text-xl font-bold">Requirements</h3>
              <p className="text-justify text-xs text-gray-500">
                {data?.requirments}
              </p>
            </div>

            <div className="mb-6">
              <h3 className=" mb-5 text-xl font-bold">Description</h3>
              <p className="text-justify text-xs text-gray-500">
                {data?.description}
              </p>
            </div>
          </div>
        </NegativeXAxisAnimation>
      </section>
    </div>
  );
}
