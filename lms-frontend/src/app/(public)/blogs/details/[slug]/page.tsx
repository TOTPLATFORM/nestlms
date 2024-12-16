import { getblogDetails } from "@/service/common";
import moment from "moment";
import React from "react";
import Head from "next/head";
import { Calendar, CalendarDays } from "lucide-react";
import Link from "next/link";
import CommentSection from "@/section/blog/CommentSection";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import NoItem from "@/components/NoItem";
import CustomImage from "@/components/CustomImage";

const BlogPage = async (props: any) => {
  const response = await getblogDetails(props?.params?.slug);

  return (
    <>
      <Head>
        <title>{response?.meta_title || "Default Title"}</title>
        <meta
          name="description"
          content={response?.meta_description || "Default Description"}
        />
      </Head>
      <section className="bg-[#F5F5F5] py-16 dark:bg-gray-800 md:py-24">
        <div className="container px-4">
          <div className="flex flex-col gap-6 lg:flex-row">
            <NegativeXAxisAnimation
              classes={`w-full bg-white p-4 sm:p-6 lg:w-2/3`}
              isOneTime={true}
            >
              {response?.cover_image_link && (
                <div className="mb-10 h-[200px] overflow-hidden rounded-lg md:h-[400px]">
                  <div className="h-full w-full overflow-hidden rounded-lg shadow-md">
                    <CustomImage imageUrl={response.cover_image_link} />
                  </div>
                </div>
              )}

              <h2 className="mb-4 w-full text-xl font-extrabold leading-tight text-gray-800 dark:text-gray-200 sm:text-2xl md:text-4xl">
                {response?.title}
              </h2>
              <div className="mx-auto mb-7 flex flex-col gap-4 text-left text-sm sm:text-base md:flex-row">
                <div className=" bg-primary/10 text-primary inline-block w-fit rounded-full px-3 py-1 text-center text-xs uppercase leading-5 shadow-sm dark:bg-gray-700 dark:text-gray-400">
                  {response?.BlogCategory?.name}
                </div>
                <div className="flex items-center justify-start">
                  <div className="text-primary flex items-center gap-x-1 dark:text-blue-300">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm">
                      {moment(response?.created_at).format("DD MMM YYYY")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <p className="mb-4 text-justify text-sm text-gray-700 dark:text-gray-300 sm:text-base md:text-lg">
                  {response?.description}
                </p>
              </div>

              <div className="mt-8">
                <CommentSection blogID={response?.id} />
              </div>
            </NegativeXAxisAnimation>
            <div className="w-full lg:w-1/3">
              <PositiveXAxisAnimation isOneTime={true}>
                <p className="font-bold">Recent Posts</p>
                <div className="mt-4 rounded-[8px] bg-white p-4 shadow-md">
                  {response?.recentPosts?.length === 0 ? (
                    <NoItem notFoundtext={"No results."} />
                  ) : (
                    response?.recentPosts?.map((item: any, index: any) => (
                      <div
                        className="flex items-center gap-4 overflow-hidden border-b py-4 last:border-b-0 "
                        key={index}
                      >
                        <div className="w-3/12">
                          <div className="h-[60px] max-h-[60px] min-h-[60px] w-full overflow-hidden rounded-[8px]">
                            <CustomImage
                              imageUrl={
                                item?.thumbnail_link ||
                                "/images/course_banner.avif"
                              }
                            />
                          </div>
                        </div>
                        <div className="w-9/12">
                          <div className="mb-2 flex items-center gap-x-4 text-sm">
                            <div className="flex items-center gap-x-2">
                              <CalendarDays size={18} />
                              <p>
                                {" "}
                                {moment(item?.created_at).format("DD MMM YYYY")}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Link href={`/blogs/details/${item.slug}`}>
                              <h2 className="hover:text-primary text-sm font-bold sm:text-base">
                                {item?.title}
                              </h2>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PositiveXAxisAnimation>
              <PositiveXAxisAnimation isOneTime={true} classes={`mt-4`}>
                <p className="font-bold">Categories</p>
                <div className="mt-4 max-h-[260px] overflow-y-auto rounded-[8px] bg-white p-4 shadow-md">
                  {response?.categories?.length === 0 ? (
                    <NoItem notFoundtext={`No results.`} />
                  ) : (
                    response?.categories?.map((item: any, index: any) => (
                      <div
                        className="flex items-center justify-between gap-4 py-4 font-medium last:border-b-0"
                        key={index}
                      >
                        <div>
                          <Link href={`/blogs?blog_category_id=${item.id}`}>
                            <p>{item.name}</p>
                          </Link>
                        </div>
                        <p>{item?.blogsCount}</p>
                      </div>
                    ))
                  )}
                </div>
              </PositiveXAxisAnimation>
              <PositiveXAxisAnimation isOneTime={true} classes={`mt-4`}>
                <p className="font-bold">Popular Tags</p>
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-[8px] bg-white p-4 shadow-md">
                  {response?.tag?.split(",").length === 0 ? (
                    <NoItem notFoundtext={`No results.`} />
                  ) : (
                    response?.tag?.split(",").map((item: any, index: any) => (
                      <div
                        className="hover:bg-primary flex cursor-pointer items-center justify-center rounded-[8px] border p-2 hover:text-white"
                        key={index}
                      >
                        <Link href={`/blogs?tag=${item}`}>
                          <span className="text-sm">{item}</span>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </PositiveXAxisAnimation>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
