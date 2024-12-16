"use client";
import CustomImage from "@/components/CustomImage";
import CustomPagination from "@/components/CustomPaginaion";
import NoItem from "@/components/NoItem";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveYAxisAnimation from "@/components/animation/PositiveYAxisAnimation";
import VerticalProductLoading from "@/components/skelaton/verticalcard";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstructors } from "@/hooks/common.hook";
import { useGetMyWishlistCourseLists } from "@/hooks/user/course.hook";
import { useGetCourseListsForAll } from "@/hooks/user/public/course.category.hook";
import VerticalProduct from "@/section/product/VerticalProduct";
import { Link, Mail, Phone } from "lucide-react";
import React from "react";

const page: React.FC = () => {
  const {
    data: courseLists,
    isLoading,
    setLimit,
    setPage,
    limit,
  } = useGetMyWishlistCourseLists();

  const handlePageClick = (event: any) => {
    setPage(event?.selected + 1);
  };

  return (
    <section className="pb-14">
      <div className="mx-5 mb-4 mt-8">
        <div className="overflow-visible">
          <div className="relative rounded-[12px] bg-[url('/images/wishlist_banner.jpg')] bg-cover bg-center bg-no-repeat ">
            <div className="rounded-[12px] px-[50px] py-[90px] ">
              <NegativeXAxisAnimation
                classes={`flex flex-col items-center justify-center`}
                isOneTime={true}
              >
                <h2 className="relative  text-xl font-bold capitalize text-white min-[1200px]:text-4xl">
                  Wishlists Courses
                </h2>
                <h4
                  className="pb-[30px] pt-2.5 text-sm font-bold -tracking-[0.64px] text-white min-[1200px]:text-base"
                  style={{ lineHeight: "1.1" }}
                >
                  Here you will get your wishlists courses
                </h4>
              </NegativeXAxisAnimation>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item: any, index: number) => (
                <VerticalProductLoading key={index} />
              ))}
            </div>
          ) : (
            <>
              {courseLists?.data?.list?.length === 0 ? (
                <div className="m-4 ">
                  <NoItem notFoundtext={`No Data Found.`} />
                </div>
              ) : (
                <div>
                  <PositiveYAxisAnimation
                    isOneTime={true}
                    classes={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3`}
                  >
                    {courseLists?.data?.list?.map(
                      (item: any, index: number) => (
                        <VerticalProduct
                          isFullPadding={false}
                          titleClass="text-base"
                          key={index}
                          course={item.Course}
                          isHoverCardShow={false}
                        />
                      )
                    )}
                  </PositiveYAxisAnimation>
                </div>
              )}
            </>
          )}
          {courseLists?.data?.list?.length !== 0 && (
            <div className="mt-5">
              <div className="flex w-full flex-col justify-center">
                <CustomPagination
                  totalItems={courseLists?.data?.meta?.total}
                  perPageItems={limit}
                  handlePageClick={handlePageClick}
                  activePage={courseLists?.data?.meta?.currentPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default page;
