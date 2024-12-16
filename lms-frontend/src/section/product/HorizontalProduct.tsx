import { Check, Clock, Heart, Layers, Star, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaHouseUser } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { Button } from "@/components/ui/button";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
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

export default function HorizontalProduct({ course }: any) {
  const { handleAddToCart, isLoading } = useAddCourseToCart();
  const { handleWislistAddOrRemove } = useAddCourseToWishlistOrRemove();

  return (
    <>
      <HoverCard>
        <HoverCardTrigger>
          <div className="flex flex-col gap-4 overflow-hidden rounded-lg bg-white p-6 md:flex-row md:gap-0">
            <div className="relative w-full md:w-1/3">
              <Link href={`/course/${course?.slug}`}>
                <div className="max-h-[175px] w-full overflow-hidden rounded-lg">
                  <CustomImage
                    imageUrl={
                      course?.thumbnail_link || "/images/course-product.avif"
                    }
                  />
                </div>
              </Link>
            </div>
            <div className="w-full pl-0 md:w-2/3 md:pl-6">
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
                  <h2 className="text-lg font-bold">{course?.name}</h2>
                </Link>
              </div>
              <div className="my-4 flex items-center gap-x-4 text-xs md:text-sm">
                <div className="flex items-center gap-x-2">
                  <Layers size={18} />
                  <p>{course?.lession_count} Lessons</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <Clock size={18} />
                  <p>{course?.duration} min</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <User size={18} />
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
                <div className="flex items-center gap-x-4 ">
                  <div className="h-[44px] w-[44px] overflow-hidden rounded-full">
                    <CustomImage
                      imageUrl={
                        course?.User?.photo || "/images/profile-pic.jpeg"
                      }
                    />
                  </div>

                  <h2 className="text-sm md:text-base">
                    {course?.User?.first_name} {course?.User?.last_name}
                  </h2>
                </div>

                <div className="flex items-center gap-x-4 text-sm md:text-lg">
                  {course?.discount_status && (
                    <p className="line-through">${course?.price}</p>
                  )}

                  <p className="text-primary">${course?.payable_price}</p>
                </div>
              </div>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="top" className="min-w-[350px]">
          <div className={`overflow-hidden rounded-lg bg-white p-2`}>
            <div>
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
                  <Heart className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </>
  );
}
