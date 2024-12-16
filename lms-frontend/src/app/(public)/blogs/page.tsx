"use client";
import CustomPagination from "@/components/CustomPaginaion";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveYAxisAnimation from "@/components/animation/PositiveYAxisAnimation";
import VerticalBlogLoading from "@/components/skelaton/VerticalBlogLoading";
import { useGetblogCategoryList, useGetblogList } from "@/hooks/common.hook";
import VerticalBlog from "@/section/blog/VerticalBlog";
import { getblogList } from "@/service/common";
import moment from "moment";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NoItem from "@/components/NoItem";

const page: React.FC = () => {
  const { data, isLoading, limit, setLimit, setPage, setQueryParams } =
    useGetblogList();
  const { data: categoryLists, isLoading: isCategoryLoading } =
    useGetblogCategoryList();

  const router = useRouter();

  const searchParams = useSearchParams();
  const blogCategoryId = searchParams.get("blog_category_id");
  const tags = searchParams.get("tag");

  const handlePageClick = (event: any) => {
    setPage(event?.selected + 1);
  };

  useEffect(() => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams);
    setPage(1);
    setQueryParams(params.toString());
  }, [searchParams]);

  const handleQueryParams = (type: string, value: any) => {
    const params: any = new URLSearchParams(searchParams);
    if (!value) {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    router.replace(`?${params.toString()}`);
  };
  return (
    <section className="flex items-center bg-white dark:bg-gray-800 ">
      <div className="container p-4">
        <motion.h1
          className="my-8 text-3xl font-bold leading-tight text-gray-900 dark:text-white"
          initial={{ x: "0px", visibility: "hidden" }}
          animate={{ visibility: "visible", x: ["-50px", "0px"] }}
          transition={{
            type: "spring",
            bounce: 0.4,
            duration: 1,
          }}
        >
          <span className="text-gray-900 dark:text-white">Blogs</span>
        </motion.h1>

        <NegativeXAxisAnimation classes={`my-4 overflow-x-auto pb-2`}>
          <div className="flex flex-nowrap gap-4">
            <p
              className={`${
                !blogCategoryId && "bg-primary border-primary text-white"
              } w-fit cursor-pointer rounded-[8px] border px-4 py-2 text-sm`}
              onClick={() => handleQueryParams("blog_category_id", "")}
            >
              All
            </p>

            {categoryLists &&
              categoryLists?.data?.length > 0 &&
              categoryLists?.data?.map((item: any, index: any) => (
                <p
                  className={`${
                    item.id == blogCategoryId &&
                    "bg-primary border-primary text-white"
                  } w-fit cursor-pointer rounded-[8px] border px-4 py-2 text-sm`}
                  key={index}
                  onClick={() => handleQueryParams("blog_category_id", item.id)}
                >
                  {item?.name}
                </p>
              ))}
          </div>
        </NegativeXAxisAnimation>
        {isLoading || isCategoryLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item: any) => (
              <div key={item} className="w-full">
                <VerticalBlogLoading />
              </div>
            ))}
          </div>
        ) : (
          <>
            {data?.list?.length === 0 ? (
              <NoItem notFoundtext={`No Item Found.`} />
            ) : (
              <>
                <PositiveYAxisAnimation
                  classes={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-8`}
                  isOneTime={true}
                >
                  {data?.list?.map((blog: any) => (
                    <VerticalBlog details={blog} key={blog?.id} />
                  ))}
                </PositiveYAxisAnimation>

                <div className="mt-5">
                  <div className="flex w-full flex-col justify-center">
                    <CustomPagination
                      totalItems={data?.meta?.total}
                      perPageItems={limit}
                      handlePageClick={handlePageClick}
                      activePage={data?.meta?.currentPage}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default page;
