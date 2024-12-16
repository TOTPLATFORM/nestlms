"use client";
import { Check, Clock, Heart, Layers, Star, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaHouseUser } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import dynamic from "next/dynamic";
import { COURSE_LEVEL } from "@/constant/core";
import { useAddCourseToCart } from "@/hooks/user/enrollment.hook";
import CustomImage from "@/components/CustomImage";
import { useAddCourseToWishlistOrRemove } from "@/hooks/user/public/course.category.hook";

const HoverCard = dynamic(
  () => import("@/components/ui/hover-card").then((module) => module.HoverCard),
  { ssr: false }
);
const HoverCardContent = dynamic(
  () =>
    import("@/components/ui/hover-card").then(
      (module) => module.HoverCardContent
    ),
  { ssr: false }
);
const HoverCardTrigger = dynamic(
  () =>
    import("@/components/ui/hover-card").then(
      (module) => module.HoverCardTrigger
    ),
  { ssr: false }
);

const coursesLevelOptions = [
  { value: COURSE_LEVEL.BEGINNER, label: "Beginner" },
  { value: COURSE_LEVEL.INTERMEDIATE, label: "Intermediate" },
  { value: COURSE_LEVEL.ADVANCED, label: "Advanced" },
];

export default function VerticalProduct({
  isFullPadding = true,
  course,
  isHoverCardShow = true,
}: any) {
  const { handleAddToCart, isLoading } = useAddCourseToCart();

  const { handleWislistAddOrRemove } = useAddCourseToWishlistOrRemove();

  return (
    <>
      <HoverCard>
        <HoverCardTrigger>
          <div
            className={`overflow-hidden rounded-lg border bg-white ${
              isFullPadding && "p-6"
            }`}
          >
            <div className="relative h-[180px]">
              <Link href={`/course/${course?.slug}`}>
                <div className="h-full w-full overflow-hidden rounded-t-lg">
                  <CustomImage
                    imageUrl={
                      course?.thumbnail_link || "/images/course_banner.avif"
                    }
                  />
                </div>
              </Link>
            </div>
            <div className={`${isFullPadding ? "pt-6" : "p-4"}`}>
              <div className="mb-4 flex items-center gap-x-6 text-xs">
                <Link href={"/"}>
                  <div className="bg-primary rounded px-1.5 py-0.5">
                    <p className="font-bold text-white">
                      {course?.category?.name}
                    </p>
                  </div>
                </Link>
              </div>
              <div>
                <Link href={`/course/${course?.slug}`}>
                  <h2
                    className={cn(
                      "text-base font-bold",
                      !isFullPadding && "text-base"
                    )}
                  >
                    {course?.name.length > 30
                      ? `${course?.name.slice(0, 30)}...`
                      : course?.name}
                  </h2>
                </Link>
              </div>
              <div
                className={cn(
                  "my-4 flex items-center gap-x-4 text-xs",
                  !isFullPadding && "text-xs"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-x-1",
                    !isFullPadding && "gap-x-1"
                  )}
                >
                  <Layers size={isFullPadding ? 14 : 14} />
                  <p>{course?.lession_count} Lessons</p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-x-1",
                    !isFullPadding && "gap-x-1"
                  )}
                >
                  <Clock size={isFullPadding ? 14 : 14} />
                  <p>{course?.duration} min</p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-x-1",
                    !isFullPadding && "gap-x-1"
                  )}
                >
                  <User size={isFullPadding ? 14 : 14} />
                  <p>
                    {" "}
                    {
                      coursesLevelOptions.find(
                        (item: any) => item.value == course?.course_level
                      )?.label
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <div
                  className={cn(
                    "flex items-center gap-x-2 text-sm",
                    !isFullPadding && "gap-x-2 text-sm"
                  )}
                >
                  <div
                    className={cn(
                      "h-[35px] w-[35px] overflow-hidden rounded-full",
                      !isFullPadding && "h-[35px] w-[35px]"
                    )}
                  >
                    <CustomImage
                      imageUrl={
                        course?.User?.photo || "/images/profile-pic.jpeg"
                      }
                    />
                  </div>

                  <h2>
                    {course?.User?.first_name} {course?.User?.last_name}
                  </h2>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-x-2 text-sm",
                    !isFullPadding && "gap-x-2 text-sm"
                  )}
                >
                  {course?.discount_status && (
                    <p className="line-through">${course?.price}</p>
                  )}

                  <p className="text-primary  text-sm">
                    ${course?.payable_price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </HoverCardTrigger>
        {isHoverCardShow && (
          <HoverCardContent side="right" className="min-w-[350px]">
            <div className={`overflow-hidden rounded-lg bg-white p-2`}>
              <div>
                <div>
                  <Link href={"/course/demo"}>
                    <h2 className={cn("text-lg font-bold")}>{course?.name}</h2>
                  </Link>
                </div>
                <div className={cn("my-4 flex items-center gap-x-4 text-xs")}>
                  <div className={cn("flex items-center gap-x-1")}>
                    <Layers size={14} />
                    <p>{course?.lession_count} Lessons</p>
                  </div>
                  <div className={cn("flex items-center gap-x-1")}>
                    <Clock size={14} />
                    <p>{course?.duration} min</p>
                  </div>

                  <div className={cn("flex items-center gap-x-1")}>
                    <User size={14} />
                    <p>
                      {" "}
                      {
                        coursesLevelOptions.find(
                          (item: any) => item.value == course?.course_level
                        )?.label
                      }
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm">
                    {course?.short_description?.length > 100
                      ? course?.short_description?.slice(0, 100) + "..."
                      : course?.short_description}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-y-4">
                    {course?.what_you_will_learn
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
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      handleAddToCart(course?.id);
                    }}
                    className="w-full"
                  >
                    Add To Cart
                  </Button>
                  <div
                    className="cursor-pointer rounded-full border p-2"
                    onClick={() =>
                      handleWislistAddOrRemove({
                        course_id: course?.id,
                      })
                    }
                  >
                    <Heart className={`text-primary`} />
                  </div>
                </div>
              </div>
            </div>
          </HoverCardContent>
        )}
      </HoverCard>
    </>
  );
}
