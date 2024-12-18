"use client";
import CustomImage from "@/components/CustomImage";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveYAxisAnimation from "@/components/animation/PositiveYAxisAnimation";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstructors } from "@/hooks/common.hook";
import { Link, Mail, Phone } from "lucide-react";
import React from "react";

const page: React.FC = () => {
  const { data, isLoading } = useInstructors();

  return (
    <section className="py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <NegativeXAxisAnimation
          classes={`mx-auto max-w-xl sm:text-center`}
          isOneTime={true}
        >
          <h3 className="text-3xl font-semibold text-gray-800 sm:text-4xl">
            Our Instructors
          </h3>
          <p className="mt-3 text-gray-600">
            Here are some of our instructors. Who are ready to teach you.
          </p>
        </NegativeXAxisAnimation>
        <div className="mt-12">
          {isLoading && (
            <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item: any, idx: any) => (
                <a
                  key={idx}
                  rel="noopener noreferrer"
                  className="rounded-xl p-4 shadow-md"
                >
                  <li>
                    <div className="h-60 w-full sm:h-52 md:h-56">
                      <Skeleton className="h-full w-full rounded-xl object-cover object-center " />
                    </div>
                    <div className="mt-4">
                      <h4 className="mt-3 text-lg font-semibold text-gray-700">
                        <Skeleton className="h-4 w-28 " />
                      </h4>
                      <div className="mt-3 text-indigo-600">
                        <Skeleton className="h-4 w-40 " />
                      </div>
                    </div>
                  </li>
                </a>
              ))}
            </ul>
          )}
          <PositiveYAxisAnimation
            isOneTime={true}
            classes={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3`}
          >
            {data?.data?.map((item: any, idx: any) => (
              <a
                key={idx}
                href={`/tutor-profile/${item?.user_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-4 shadow-md"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="h-[200px] w-[200px] overflow-hidden rounded-full">
                    <CustomImage
                      imageUrl={item?.photo || "/images/profile-pic.jpeg"}
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <h4 className="text-lg font-semibold text-gray-700">
                      {item?.first_name} {item?.last_name}
                    </h4>
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <span> {item?.email}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span> {item?.phone}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </PositiveYAxisAnimation>
        </div>
      </div>
    </section>
  );
};

export default page;
