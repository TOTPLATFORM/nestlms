"use client";

import CustomImage from "@/components/CustomImage";
import NoItem from "@/components/NoItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstructorDashboardInfo } from "@/hooks/admin/instructors.hook";
import { Book, Star } from "lucide-react";
import moment from "moment";
import Chart from "react-google-charts";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function instructor() {
  const { data, isLoading } = useInstructorDashboardInfo();
  return (
    <>
      <main>
        <div className="flex flex-col">
          <h2 className="mb-4 text-2xl font-bold">Instructor Dashboard</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="custom-shadow flex items-start rounded-sm bg-white p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <Book />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold">
                  {data?.courses ? data?.courses : 0} Courses
                </h2>
                <p className="mt-2 text-sm text-gray-500">All your courses</p>
              </div>
            </div>
            <div className="custom-shadow flex items-start rounded-sm bg-white p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold">
                  {data?.students ? data?.students : 0}{" "}
                  {data?.students > 1 ? "Student's" : "Student"}
                </h2>
                <p className="mt-2 text-sm text-gray-500">All your students</p>
              </div>
            </div>
            <div className="custom-shadow flex items-start rounded-sm bg-white p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-100 bg-red-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold">
                  {data?.instructor_wallet?.total_withdrawn_amount
                    ? data?.instructor_wallet?.total_withdrawn_amount
                    : 0}{" "}
                  USD
                </h2>
                <p className="mt-2 text-sm text-gray-500">Total earnings</p>
              </div>
            </div>
            <div className="custom-shadow flex items-start rounded-sm bg-white p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-100 bg-yellow-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <Star />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold">
                  {data?.review_count ? data?.review_count : 0} Reviews
                </h2>
                <p className="mt-2 text-sm text-gray-500">All your reviews</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 flex w-full items-start gap-8">
          <div className="w-full ">
            <div className="items-start justify-between sm:flex">
              <div>
                <h4 className="text-xl font-semibold text-gray-800">
                  Last 30 Days Enrollments
                </h4>
              </div>
            </div>
            <div className="custom-shadow mt-5 rounded-md">
              {isLoading ? (
                <div className="text-center">
                  <Skeleton className="h-48 w-full" />
                </div>
              ) : data?.enrollmentChart?.datasets[0]?.values?.length ? (
                <Chart
                  width={"100%"}
                  height={"300px"}
                  chartType="LineChart"
                  loader={
                    <div className="text-center">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        ></svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                  data={[
                    ["Month", "Enrollments"],
                    ...data?.enrollmentChart?.labels.map(
                      (label: any, index: any) => [
                        moment(label).format("LL"),
                        data?.enrollmentChart?.datasets[0]?.values[index],
                      ]
                    ),
                  ]}
                  options={{
                    title: "Last 30Days Enrollment",
                    chartArea: { width: "80%" },
                    hAxis: {
                      title: "Month",
                    },
                    vAxis: {
                      title: "Enrollments",
                      minValue: 0,
                    },
                  }}
                />
              ) : (
                <>
                  <NoItem notFoundtext={`No data found.`} />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 w-full items-start gap-8 xl:flex ">
          <div className="w-full xl:w-4/12 ">
            <div className="items-start justify-between sm:flex">
              <div>
                <h4 className="text-xl font-semibold text-gray-800">
                  Students
                </h4>
              </div>
            </div>
            {isLoading ? (
              <ul className="custom-shadow mt-5 divide-y rounded-md p-2 md:p-4">
                {[1, 2, 3, 4, 5].map((item: any, idx: any) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between py-2 "
                  >
                    <div className="flex gap-3">
                      <Skeleton className="h-12 w-12 flex-none rounded-full" />
                      <div>
                        <Skeleton className="h-3 w-20 " />

                        <Skeleton className="mt-3 h-3 w-40 " />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : data?.students_data.length > 0 ? (
              <ul className="custom-shadow mt-5 divide-y rounded-md p-2 md:p-4">
                {data?.students_data?.map((item: any, idx: any) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between py-2 "
                  >
                    <div className="flex gap-3">
                      <div className="h-12 w-12 flex-none overflow-hidden rounded-full">
                        <CustomImage
                          imageUrl={
                            item?.user?.photo || "/images/profile-pic.jpeg"
                          }
                        />
                      </div>
                      <div>
                        <span className="block text-sm font-semibold text-gray-700">
                          {item?.user?.first_name} {item?.user?.last_name}
                        </span>
                        <span className="block text-sm text-gray-600">
                          {item?.user?.email}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <NoItem notFoundtext={`No Student Found`} />
            )}
          </div>

          <div className="mt-6 w-full xl:mt-0 xl:w-8/12">
            <div className="items-start justify-between sm:flex">
              <div>
                <h4 className="text-xl font-semibold text-gray-800">
                  Latest Courses
                </h4>
              </div>
            </div>
            <div className="custom-shadow mt-5 overflow-x-auto rounded-md p-2 md:p-4">
              <table className="w-full table-auto text-left text-sm">
                <thead className="border-b font-medium text-gray-600">
                  <tr>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Payable price</th>
                  </tr>
                </thead>
                {isLoading ? (
                  <tbody className="divide-y text-gray-600">
                    {[1, 2, 3, 4, 5].map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="flex items-center gap-x-3 whitespace-nowrap px-6 py-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Skeleton className="h-3 w-20 " />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Skeleton className="h-3 w-20 " />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Skeleton className="h-3 w-20 " />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : data?.last_courses?.length ? (
                  <tbody className="divide-y text-gray-600">
                    {data?.last_courses?.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="flex items-center gap-x-3 whitespace-nowrap px-6 py-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full">
                            <CustomImage
                              imageUrl={
                                item.thumbnail_link ||
                                "/images/course_banner.avif"
                              }
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item?.name.slice(0, 20)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item?.price}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item?.payable_price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  ""
                )}
              </table>
              {data?.last_courses?.length <= 0 && (
                <NoItem notFoundtext={`No Data Found`} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
