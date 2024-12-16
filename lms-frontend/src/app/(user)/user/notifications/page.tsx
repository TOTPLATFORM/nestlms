"use client";
import CustomImage from "@/components/CustomImage";
import NoItem from "@/components/NoItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetNotification } from "@/hooks/notification";
import moment from "moment";
import React from "react";
import {
  MdKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

const page: React.FC = () => {
  const { data, isLoading, refetch, limit, setLimit, setPage } =
    useGetNotification(10, 1);

  return (
    <section className="container mx-auto mt-12 max-w-screen-lg px-4 md:px-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">Notifications</h1>
      </div>
      {isLoading && (
        <ul className="mb-10 mt-12 space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((item: any, idx: any) => (
            <li
              key={idx}
              className={`rounded-md border-b  ${"bg-white "}  p-5 shadow-sm`}
            >
              <div>
                <div>
                  <div className="justify-between sm:flex">
                    <Skeleton className="mx-1 mr-2 h-8 w-8 flex-shrink-0 rounded-full object-cover" />
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-cyan-600">
                        <Skeleton className="h-4 w-40" />
                      </h3>
                      <div className="mt-2 pr-2 text-gray-500">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                    <div className="mt-5 space-y-4 text-sm sm:mt-0 sm:space-y-2">
                      <span className="flex items-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <Skeleton className="h-4 w-40" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {data?.list?.length === 0 ? (
        <NoItem notFoundtext="No Notification Found" />
      ) : (
        <>
          <ul className="mb-10 mt-12 space-y-6">
            {data?.list?.map((item: any, idx: any) => (
              <li
                key={idx}
                className={`rounded-md border-b  ${
                  item?.is_seen === 0 ? "bg-white" : "bg-white "
                }  p-5 shadow-sm`}
              >
                <a href={item.href}>
                  <div>
                    <div className="justify-between sm:flex">
                      <div className="mx-1 mr-2 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                        <CustomImage imageUrl="/images/bell_icon.png" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-slate-700">
                          {item.title}
                        </h3>
                        <p className="mt-2 pr-2 text-gray-500">{item?.body}</p>
                      </div>
                      <div className="mt-5 space-y-4 text-sm sm:mt-0 sm:space-y-2">
                        <span className="flex items-center text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {moment(item?.created_at).startOf("hour").fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <div className="mb-10 flex items-center space-x-2">
            <div className="flex w-[100px] text-sm font-medium sm:items-center sm:justify-center">
              Page {data?.meta?.currentPage} of {data?.meta?.lastPage}
            </div>
            <div className="flex items-center sm:space-x-2">
              <Button
                variant="outline"
                className="flex h-8 w-8 p-0"
                onClick={() => setPage(1)}
                disabled={!data?.meta?.prev}
              >
                <span className="sr-only">Go to first page</span>
                <MdOutlineKeyboardDoubleArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage(data?.meta?.prev)}
                disabled={!data?.meta?.prev}
              >
                <span className="sr-only">Go to previous page</span>
                <MdOutlineKeyboardArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage(data?.meta?.next)}
                disabled={!data?.meta?.next}
              >
                <span className="sr-only">Go to next page</span>
                <MdKeyboardArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className=" flex h-8 w-8 p-0"
                onClick={() => setPage(data?.meta?.lastPage)}
                disabled={!data?.meta?.next}
              >
                <span className="sr-only">Go to last page</span>
                <MdOutlineKeyboardDoubleArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default page;
