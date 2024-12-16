"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Cross, Delete } from "lucide-react";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import { useRemoveFromCart } from "@/hooks/user/enrollment.hook";
import CustomImage from "@/components/CustomImage";

export default function CartSection({ open, setOpen }: any) {
  const { cartInfo } = useSelector((state: IRootState) => state.cartSlice);
  const { handleRemoveFromCart, isLoading } = useRemoveFromCart();
  const [removingCourseId, setRemovingCourseId] = useState<number | null>(null);

  const handleRemoveCourse = async (courseId: number) => {
    setRemovingCourseId(courseId);
    await handleRemoveFromCart(courseId);
    setRemovingCourseId(null);
  };

  const router = useRouter();
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Items
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <IoMdClose className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {cartInfo?.productsList?.map((product: any) => (
                              <li key={product?.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <CustomImage
                                    imageUrl={product?.thumbnail_link || "/images/course_banner.avif"}
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={product?.href}>
                                          {product?.name}
                                        </a>
                                      </h3>
                                      <p className="ml-4">
                                        ${product?.payable_price}
                                      </p>
                                    </div>
                                    <p>{product?.duration} total mins</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="text-primary font-medium"
                                        onClick={() =>
                                          handleRemoveCourse(product?.id)
                                        }
                                        disabled={
                                          isLoading &&
                                          removingCourseId === product?.id
                                        }
                                      >
                                        {isLoading &&
                                        removingCourseId === product?.id ? (
                                          "Removing..."
                                        ) : (
                                          <Delete className="h-6 w-6" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>
                          {cartInfo?.totalPrice ? cartInfo?.totalPrice : 0} USD
                        </p>
                      </div>

                      <div className="mt-6">
                        <Link href={"/checkout"}>
                          <Button
                            type="button"
                            className="w-full"
                            onClick={() => setOpen(false)}
                          >
                            Checkout
                          </Button>
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or
                          <button
                            type="button"
                            className="text-primary ml-2 font-medium"
                            onClick={() => {
                              setOpen(false);
                              router.push("/cart");
                            }}
                          >
                            Go Cart
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
