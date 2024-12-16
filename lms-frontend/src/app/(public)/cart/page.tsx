"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dot } from "lucide-react";
import { IoMdClose } from "react-icons/io";
import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import { COURSE_LEVEL } from "@/constant/core";
import {
  useMyCartDetails,
  useRemoveFromCart,
} from "@/hooks/user/enrollment.hook";
import { Skeleton } from "@/components/ui/skeleton";
import CustomImage from "@/components/CustomImage";
import NoItem from "@/components/NoItem";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Cart() {
  const { cartInfo } = useSelector((state: IRootState) => state.cartSlice);
  const {
    isLoading: CartLoading,
    productsList,
    totalPrice,
  } = useMyCartDetails();
  const { handleRemoveFromCart, isLoading } = useRemoveFromCart();
  const [removingCourseId, setRemovingCourseId] = useState<number | null>(null);
  const handleRemoveCourse = async (courseId: number) => {
    setRemovingCourseId(courseId);
    await handleRemoveFromCart(courseId);
    setRemovingCourseId(null);
  };
  return (
    <div className="container">
      <main className="py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Cart Items
        </h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            {CartLoading && (
              <li className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  <Skeleton className="h-24 w-24 rounded-md object-cover object-center sm:h-16" />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:pr-0">
                    <div className="col-span-2">
                      <div className="mb-4 flex justify-between">
                        <h3 className="text-sm">
                          <Skeleton className="h-5 w-28" />
                        </h3>
                      </div>
                      <div>
                        <div className="flex items-center gap-x-2 text-xs">
                          <p>Created by</p>

                          <Skeleton className="h-5 w-28" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Skeleton className="h-10 w-10" />
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="absolute right-0 top-0">
                        <button
                          type="button"
                          className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Remove</span>

                          <IoMdClose className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}
            {productsList?.length ? (
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {productsList?.map((product: any, productIdx: any) => (
                  <li key={product?.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="h-11 overflow-hidden rounded-md sm:h-16 ">
                        <CustomImage
                          imageUrl={
                            product?.thumbnail_link ||
                            "/images/course_banner.avif"
                          }
                        />
                      </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:pr-0">
                        <div className="col-span-2">
                          <div className="mb-4 flex justify-between">
                            <h3 className="text-sm">
                              <a
                                href={product?.href}
                                className="font-bold   text-gray-700 hover:text-gray-800"
                              >
                                {product?.name}
                              </a>
                            </h3>
                          </div>
                          <div>
                            <div className="flex items-center gap-x-2 text-xs">
                              <p>Created by</p>

                              <Link href={"#"} className="underline">
                                {" "}
                                {product?.User.first_name}{" "}
                                {product?.User?.last_name}
                              </Link>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-x-4 text-xs">
                              <div className="flex items-center gap-x-1">
                                <p>{product?.duration} total mins</p>
                              </div>
                              <div className="flex items-center gap-x-1">
                                <Dot />
                                <p>
                                  {product.course_level == COURSE_LEVEL.ADVANCED
                                    ? "Advanced"
                                    : product.course_level ==
                                      COURSE_LEVEL.INTERMEDIATE
                                    ? "Intermediate"
                                    : "Beginner"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-primary  text-lg font-medium">
                            {product.payable_price} $
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                              disabled={
                                isLoading && removingCourseId === product?.id
                              }
                              onClick={() => handleRemoveCourse(product?.id)}
                            >
                              <span className="sr-only">Remove</span>

                              <IoMdClose className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : !productsList && !CartLoading ? (
              <NoItem notFoundtext="No items found" />
            ) : (
              ""
            )}
          </section>

          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-white px-4 py-6 shadow-md sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {cartInfo?.totalPrice || 0}$
                </dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {cartInfo?.totalPrice || 0}$
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link href={"/checkout"}>
                <Button type="button" className="w-full">
                  Checkout
                </Button>
              </Link>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
