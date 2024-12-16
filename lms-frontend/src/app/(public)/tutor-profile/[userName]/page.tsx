"use client";
import CustomImage from "@/components/CustomImage";
import NoItem from "@/components/NoItem";
import PositiveYAxisAnimation from "@/components/animation/PositiveYAxisAnimation";
import VerticalProductLoading from "@/components/skelaton/verticalcard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommonSettings } from "@/hooks/common.hook";
import { useInstructorProfile } from "@/hooks/user/instructorprofile.hook";
import VerticalProduct from "@/section/product/VerticalProduct";
import { AtSign } from "lucide-react";
import React from "react";

const Page = ({
  params: { userName },
}: {
  params: {
    userName: string;
  };
}) => {
  const { data, isLoading } = useInstructorProfile(userName);
  return (
    <div className="profile-page">
      <section className="relative block h-[500px]">
        <div
          className=" absolute top-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/bg-instructor.avif')`,
          }}
        >
          <span
            id="blackOverlay"
            className="absolute h-full w-full bg-black opacity-50"
          ></span>
        </div>
      </section>
      <section className="bg-blueGray-200 relative py-16">
        <PositiveYAxisAnimation
          classes={`container mx-auto overflow-visible px-4`}
          isOneTime={true}
        >
          <div className="relative -mt-64 mb-6 flex w-full min-w-0 flex-col break-words rounded-2xl bg-white shadow">
            <div className="sm:px-6">
              <div className="flex flex-wrap justify-center">
                <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                  <div className="relative">
                    {isLoading ? (
                      <Skeleton className="absolute -m-16 -ml-20 h-[150px] w-[150px] max-w-[150px] rounded-full  align-middle  shadow-lg lg:-ml-16" />
                    ) : (
                      <div className="absolute -m-16 -ml-20 h-[150px] w-[150px] max-w-[150px] overflow-hidden rounded-full bg-white p-2 align-middle shadow-lg lg:-ml-16">
                        <CustomImage
                          imageUrl={data?.data?.profile_details?.photo || "/images/profile-pic.jpeg"}
                          customClassName="rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-20 text-center md:mt-28">
                <div className="lg:w-12/12 w-full px-4 lg:order-1">
                  <div className="flex justify-center  py-4 pt-8 lg:pt-4">
                    <div className="mr-4 rounded-xl border p-3 text-center">
                      {isLoading ? (
                        <Skeleton className="h-6 w-20" />
                      ) : (
                        <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                          {data?.data?.review_count
                            ? data?.data?.review_count
                            : 0}
                        </span>
                      )}
                      <span className="text-blueGray-400 text-sm">Reviews</span>
                    </div>
                    <div className="mr-4 rounded-xl border p-3 text-center">
                      {isLoading ? (
                        <Skeleton className="h-6 w-20" />
                      ) : (
                        <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                          {data?.data?.enrolled_students
                            ? data?.data?.enrolled_students
                            : 0}
                        </span>
                      )}
                      <span className="text-blueGray-400 text-sm">
                        Students
                      </span>
                    </div>
                    <div className="mr-4 rounded-xl border p-3 text-center">
                      {isLoading ? (
                        <Skeleton className="h-6 w-20" />
                      ) : (
                        <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                          {data?.data?.courses?.length
                            ? data?.data?.courses?.length
                            : 0}
                        </span>
                      )}

                      <span className="text-blueGray-400 text-sm">Courses</span>
                    </div>
                  </div>
                </div>
                {isLoading ? (
                  <div className="text-blueGray-700 mb-6 mt-3 flex w-full items-center justify-center text-center text-3xl font-semibold leading-normal">
                    <Skeleton className="h-12 w-36 rounded-md" />
                  </div>
                ) : (
                  <h3 className="text-blueGray-700 mb-2  text-4xl font-semibold leading-normal">
                    {data?.data?.profile_details?.first_name}{" "}
                    {data?.data?.profile_details?.last_name}
                  </h3>
                )}
                {isLoading ? (
                  <div className="text-blueGray-700 mb-6 mt-3 flex w-full items-center justify-center text-center text-3xl font-semibold leading-normal">
                    <i className="fas fa-map text-blueGray-400 mr-2 text-lg"></i>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ) : (
                  <div className="text-blueGray-400 mb-2 mt-0 text-sm font-bold uppercase leading-normal">
                    <i className="fas fa-map text-blueGray-400 mr-2 text-lg"></i>
                    {data?.data?.profile_details?.country
                      ? data?.data?.profile_details?.country
                      : "N/A"}
                  </div>
                )}
                {isLoading ? (
                  <div className="text-blueGray-700 mb-6 mt-3 flex w-full items-center justify-center text-center text-3xl font-semibold leading-normal">
                    <i className="fas fa-briefcase text-blueGray-400 mr-2 text-lg"></i>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ) : (
                  <div className="text-blueGray-600 mb-2 mt-10">
                    <i className="fas fa-briefcase text-blueGray-400 mr-2 text-lg"></i>
                    {data?.data?.profile_details?.email
                      ? data?.data?.profile_details?.email
                      : "N/A"}
                  </div>
                )}
                {isLoading ? (
                  <div className="text-blueGray-700 mb-6 mt-3 flex w-full items-center justify-center text-center text-3xl font-semibold leading-normal">
                    <i className="fas fa-at text-blueGray-400 mr-2 text-lg"></i>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ) : (
                  <div className="text-blueGray-600 mb-2">
                    <i className="fas fa-at text-blueGray-400 mr-2 text-lg"></i>

                    {data?.data?.profile_details?.user_name
                      ? data?.data?.profile_details?.user_name
                      : "N/A"}
                  </div>
                )}
              </div>
              {isLoading ? (
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((item: any, index: number) => (
                    <VerticalProductLoading key={index} />
                  ))}
                </div>
              ) : (
                <div className="mb-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data?.data?.courses?.map((item: any, index: number) => (
                    <VerticalProduct
                      isFullPadding={true}
                      titleClass="text-base"
                      key={index}
                      course={item}
                    />
                  ))}
                  {data?.data?.courses?.length === 0 && (
                    <div className="col-span-3">
                      <NoItem notFoundtext={`No courses found`} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </PositiveYAxisAnimation>
      </section>
    </div>
  );
};

export default Page;
