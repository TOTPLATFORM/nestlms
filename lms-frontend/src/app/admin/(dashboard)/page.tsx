"use client";
import CustomImage from "@/components/CustomImage";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminDashboard } from "@/hooks/admin/admin.hook";
import { Book, CircleDollarSign, Star, User, UserCheck } from "lucide-react";
import React, { useState } from "react";
import { Chart } from "react-google-charts";

export default function Page() {
  const { data, isLoading } = useGetAdminDashboard();

  return (
    <main>
      <div className="flex flex-col">
        <h2 className="mb-4 text-2xl font-bold">Admin Dashboard</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
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
              <h2 className="font-semibold">{data?.totalCourses} Courses</h2>
              <p className="mt-2 text-sm text-gray-500">Total courses</p>
            </div>
          </div>

          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-100 bg-cyan-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <UserCheck />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold">
                {data?.totalEnrollments} Enrollments
              </h2>
              <p className="mt-2 text-sm text-gray-500">Total enrollments</p>
            </div>
          </div>
          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <User />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold">{data?.totalUsers} Users </h2>
              <p className="mt-2 text-sm text-gray-500">Total users</p>
            </div>
          </div>
          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
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
                {data?.totalInstructors} Instructors{" "}
              </h2>
              <p className="mt-2 text-sm text-gray-500">Total instructors</p>
            </div>
          </div>
          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
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
              <h2 className="font-semibold">{data?.totalStudents} Students </h2>
              <p className="mt-2 text-sm text-gray-500">Total students</p>
            </div>
          </div>
          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-100 bg-green-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <CircleDollarSign />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold">{data?.admin_earning} USD</h2>
              <p className="mt-2 text-sm text-gray-500">All time earnings</p>
            </div>
          </div>
          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-100 bg-green-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <CircleDollarSign />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold">{data?.balance} USD</h2>
              <p className="mt-2 text-sm text-gray-500">
                Current balance holding
              </p>
            </div>
          </div>
          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-100 bg-green-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <CircleDollarSign />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold">
                {data?.total_pending_withdraw} USD
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Total pending withdraw
              </p>
            </div>
          </div>
          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-100 bg-green-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <CircleDollarSign />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold">
                {data?.total_withdrawn_amount} USD
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Total withdrawn amount
              </p>
            </div>
          </div>
          <div className="flex items-start rounded-sm bg-white p-4 custom-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-100 bg-green-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <CircleDollarSign />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="font-semibold">{data?.totalTransactions} USD</h2>
              <p className="mt-2 text-sm text-gray-500">Total transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex w-full flex-col items-start gap-8 lg:flex-row">
        <div className="w-full rounded-md p-4  custom-shadow lg:w-1/2 2xl:w-1/3">
          <h2 className="mb-5 text-xl font-semibold">
            User Verification and Activity
          </h2>
          {data?.userDataChartData && (
            <Chart
              width={"100%"}
              height={"300px"}
              chartType="Bar"
              loader={
                <div className="text-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
              data={[
                ["Category", "Counts"],
                [
                  data?.userDataChartData?.labels[0],
                  data?.userDataChartData?.datasets[0]?.values[0],
                ],
                [
                  data?.userDataChartData?.labels[1],
                  data?.userDataChartData?.datasets[0]?.values[1],
                ],
                [
                  data?.userDataChartData?.labels[2],
                  data?.userDataChartData?.datasets[0]?.values[2],
                ],
              ]}
              options={{
                title: "",
                chartArea: { width: "50%" },
                hAxis: {
                  title: "Category",
                },
                vAxis: {
                  title: "Counts",
                  minValue: 0,
                },
              }}
            />
          )}
        </div>
        <div className="w-full rounded-md p-4  custom-shadow lg:w-1/2 2xl:w-2/3">
          <h1 className="mb-7 text-xl font-bold">
            New Users Joined (Last 12 Months)
          </h1>
          {data?.newUserDataChartData && (
            <Chart
              width={"100%"}
              height={"300px"}
              chartType="Line"
              loader={
                <div className="text-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
              data={[
                ["Month", "New Users"],
                ...data?.newUserDataChartData?.labels.map(
                  (month: any, index: number) => [
                    month,
                    data?.newUserDataChartData?.datasets[0]?.values[index],
                  ]
                ),
              ]}
              options={{
                title: "New Users Joined (Last 12 Months)",
                chartArea: { width: "50%" },
                hAxis: {
                  title: "Month",
                },
                vAxis: {
                  title: "New Users",
                  minValue: 0,
                },
              }}
            />
          )}
        </div>
      </div>
      <div className="mt-12 flex w-full items-start gap-8 ">
        <div className="w-full rounded-md p-4  custom-shadow md:p-8">
          <div className="items-start justify-between sm:flex">
            <div>
              <h4 className="text-xl font-semibold text-gray-800">
                Latest Courses
              </h4>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto rounded-lg border shadow-sm">
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
              ) : data?.latestCourses?.length ? (
                <tbody className="divide-y text-gray-600">
                  {data?.latestCourses?.map((item: any, idx: number) => (
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
          </div>
        </div>
      </div>
    </main>
  );
}
