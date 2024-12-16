"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  Minus,
  Plus,
  X,
} from "lucide-react";
import VerticalProduct from "@/section/product/VerticalProduct";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import HorizontalProduct from "@/section/product/HorizontalProduct";
import { cn } from "@/lib/utils";
import {
  useGetCourseFilterData,
  useGetCourseListsForAll,
} from "@/hooks/user/public/course.category.hook";
import { IoIosStarOutline } from "react-icons/io";

import { useRouter, useSearchParams } from "next/navigation";
import { IoIosStar } from "react-icons/io";
import { COURSE_LEVEL } from "@/constant/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VerticalProductLoading from "@/components/skelaton/verticalcard";
import CustomPagination from "@/components/CustomPaginaion";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveYAxisAnimation from "@/components/animation/PositiveYAxisAnimation";
import NoItem from "@/components/NoItem";

const sortOptions = [
  { name: "Newest", value: "latest" },
  { name: "Price High to Low", value: "price_high_to_low" },
  { name: "Price Low to High", value: "price_low_to_high" },
];
const ratingFilter = [
  { name: "5", value: 5 },
  { name: "4 & up", value: 4 },
  { name: "3 & up", value: 3 },
  { name: "2 & up", value: 2 },
  { name: "1 & up", value: 1 },
];

const videoDurationFilter = [
  {
    name: "0-1 Hour",
    value: {
      minDuration: 0,
      maxDuration: 60,
    },
    id: 1,
  },
  {
    name: "1-3 Hour",
    value: {
      minDuration: 60,
      maxDuration: 180,
    },
    id: 2,
  },
  {
    name: "3-6 Hour",
    value: {
      minDuration: 180,
      maxDuration: 360,
    },
    id: 3,
  },
  {
    name: "6-15 Hour",
    value: {
      minDuration: 360,
      maxDuration: 900,
    },
    id: 4,
  },
  {
    name: "15+ Hour",
    value: {
      minDuration: 900,
      maxDuration: -1,
    },
    id: 5,
  },
];
const coursesLevelOptions = [
  { value: COURSE_LEVEL.BEGINNER, name: "Beginner" },
  { value: COURSE_LEVEL.INTERMEDIATE, name: "Intermediate" },
  { value: COURSE_LEVEL.ADVANCED, name: "Advanced" },
];
const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: true },
      { value: "brown", label: "Brown", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: true },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "2l", label: "2L", checked: false },
      { value: "6l", label: "6L", checked: false },
      { value: "12l", label: "12L", checked: false },
      { value: "18l", label: "18L", checked: false },
      { value: "20l", label: "20L", checked: false },
      { value: "40l", label: "40L", checked: true },
    ],
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function CourseCategorySection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFreeParams = searchParams.get("is_free");
  const discountStatusParams = searchParams.get("discount_status");
  const sortByParams = searchParams.get("sort_by");
  const courseLevelParams = searchParams.getAll("course_level");
  const categorIdParams = searchParams.get("category_id") || 0;
  const subCategoryIdParams = searchParams.getAll("sub_category_id");
  const minPriceParams = searchParams.get("min_price") || "";
  const maxPriceParams = searchParams.get("max_price") || "";
  const minDurationParams = searchParams.get("min_duration") || -1;
  const maxDurationParams = searchParams.get("max_duration") || -1;
  const minAverageRatingParams = searchParams.get("min_average_rating") || 0;
  const searchAllParams = searchParams.get("search") || "";

  const {
    data: courseLists,
    isLoading,
    setLimit,
    setPage,
    limit,
    setQueryParams,
  } = useGetCourseListsForAll();

  const { data: filterCategory, isLoading: isFilterLoading } =
    useGetCourseFilterData();

  useEffect(() => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams);
    if (courseLevelParams.length > 1) {
      params.set("course_level", courseLevelParams.join(","));
    }
    if (subCategoryIdParams.length > 1) {
      params.set("course_level", subCategoryIdParams.join(","));
    }
    setPage(1);
    setQueryParams(params.toString());
  }, [searchParams]);

  const [activeDurationId, setActiveDurationId] = useState<any>(0);

  const [searchItems, setSearchItems] = useState<any>("");

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [subCategoryOptions, setSubCategoryOptions] = useState<any>([]);

  const [priceFilter, setPriceFilter] = useState<any>({
    minPrice: "",
    maxPrice: "",
  });

  const [itemView, setItemView] = useState<any>("grid");

  const handleItemView = (view: any) => {
    setItemView(view);
  };

  const handleQueryParams = (type: string, value: any) => {
    const params: any = new URLSearchParams(searchParams);
    if (type == "delete_all") {
      let newParams: any = new URLSearchParams();
      setActiveDurationId(0);
      router.replace(`?${newParams.toString()}`);
      return;
    }
    if (type == "category_id") {
      params.delete("sub_category_id");
    }
    if (type == "course_level") {
      if (courseLevelParams.map(Number).includes(value)) {
        params.delete(type, value);
      } else {
        params.append(type, value);
      }
    } else if (type == "sub_category_id") {
      if (subCategoryIdParams.map(Number).includes(value)) {
        params.delete(type, value);
      } else {
        params.append(type, value);
      }
    } else if (type == "price_filter") {
      if (priceFilter.minPrice) {
        params.set("min_price", value.minPrice);
      } else {
        params.delete("min_price");
      }
      if (priceFilter.maxPrice) {
        params.set("max_price", value.maxPrice);
      } else {
        params.delete("max_price");
      }
    } else if (type == "video_duration") {
      params.set("min_duration", value.minDuration);
      if (value?.maxDuration != -1) {
        params.set("max_duration", value.maxDuration);
      } else {
        params.delete("max_duration");
      }
    } else if (type == "search") {
      if (!value) {
        params.delete(type);
      } else {
        params.set(type, value);
      }
    } else {
      params.set(type, value);
    }

    router.replace(`?${params.toString()}`);
  };

  useEffect(() => {
    if (Number(maxDurationParams) == -1 && Number(minDurationParams) == -1) {
      setActiveDurationId(0);
      return;
    }
    if (Number(maxDurationParams) == -1) {
      setActiveDurationId(5);
      return;
    }
    if (Number(minDurationParams) >= 0 && Number(maxDurationParams) <= 60) {
      setActiveDurationId(1);
      return;
    }
    if (Number(minDurationParams) >= 60 && Number(maxDurationParams) <= 180) {
      setActiveDurationId(2);
      return;
    }
    if (Number(minDurationParams) >= 180 && Number(maxDurationParams) <= 360) {
      setActiveDurationId(3);
      return;
    }
    if (Number(minDurationParams) >= 360 && Number(maxDurationParams) <= 900) {
      setActiveDurationId(4);
      return;
    }
    if (Number(minDurationParams) >= 900) {
      setActiveDurationId(5);
      return;
    }
  }, []);

  useEffect(() => {
    if (
      !categorIdParams ||
      !filterCategory?.data ||
      filterCategory?.data?.category_list?.length === 0
    ) {
      return;
    }
    let newOptions = filterCategory?.data?.category_list.find(
      (item: any) => item.id == categorIdParams
    );

    if (!newOptions?.id) return;
    setSubCategoryOptions(newOptions.SubCategory);
  }, [categorIdParams, filterCategory?.data]);

  useEffect(() => {
    setPriceFilter({
      minPrice: minPriceParams,
      maxPrice: maxPriceParams,
    });
  }, [minPriceParams, maxPriceParams]);

  useEffect(() => {
    if (!searchAllParams) return;
    setSearchItems(searchAllParams);
  }, []);

  const handlePageClick = (event: any) => {
    setPage(event?.selected + 1);
  };

  return (
    <div className="mt-7">
      <div className="container">
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <Disclosure
                    as="div"
                    className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <div className="mb-10 w-full">
                          <label
                            htmlFor="default-search"
                            className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Search
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                              <svg
                                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                              </svg>
                            </div>
                            <input
                              type="search"
                              id="default-search"
                              className="block w-full rounded-lg border border-gray-300  p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                              placeholder="Search Courses..."
                              required
                              onChange={(e) =>
                                handleQueryParams("search", e.target.value)
                              }
                              value={searchAllParams}
                            />
                          </div>
                        </div>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className=" font-bold text-gray-900">
                              Ratings
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <Minus className="h-5 w-5" />
                              ) : (
                                <Plus className="h-5 w-5" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {ratingFilter.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`rating-${option.value}-${optionIdx}`}
                                  name={`rating`}
                                  defaultValue={option.value}
                                  type="radio"
                                  className="accent-primary h-4 w-4 rounded border-gray-300 "
                                  onChange={() =>
                                    handleQueryParams(
                                      "min_average_rating",
                                      option.value
                                    )
                                  }
                                  checked={
                                    minAverageRatingParams == option.value
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  htmlFor={`rating-${option.value}-${optionIdx}`}
                                  className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                                >
                                  {[1, 2, 3, 4, 5].map((index) => {
                                    if (index <= option.value) {
                                      return (
                                        <IoIosStar
                                          color="#34495e"
                                          size={13}
                                          key={index}
                                        />
                                      );
                                    }
                                    return (
                                      <IoIosStarOutline
                                        color="#34495e"
                                        size={13}
                                        key={index}
                                      />
                                    );
                                  })}

                                  <p className="pl-2 text-sm">{option.name}</p>
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  <Disclosure
                    as="div"
                    className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className=" font-bold text-gray-900">
                              Video Duration
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <Minus className="h-5 w-5" />
                              ) : (
                                <Plus className="h-5 w-5" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {videoDurationFilter.map((option, optionIdx) => (
                              <div
                                key={optionIdx}
                                className="flex items-center"
                              >
                                <input
                                  id={`duration-${option.id}`}
                                  name={`duration`}
                                  type="radio"
                                  className="accent-primary h-4 w-4 rounded border-gray-300 "
                                  onChange={() => {
                                    handleQueryParams(
                                      "video_duration",
                                      option.value
                                    );
                                    setActiveDurationId(option.id);
                                  }}
                                  checked={
                                    activeDurationId == option.id ? true : false
                                  }
                                />
                                <label
                                  htmlFor={`duration-${option.id}`}
                                  className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                                >
                                  <p className="pl-2 text-sm">{option.name}</p>
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  {isFilterLoading ? (
                    <p>Loading..</p>
                  ) : (
                    <Disclosure
                      as="div"
                      className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                      defaultOpen={false}
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className=" font-bold text-gray-900">
                                Categories
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <Minus className="h-5 w-5" />
                                ) : (
                                  <Plus className="h-5 w-5" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-4">
                              {filterCategory?.data?.category_list?.length ===
                              0 ? (
                                <NoItem notFoundtext={`No Data Found.`} />
                              ) : (
                                filterCategory?.data?.category_list.map(
                                  (option: any, optionIdx: any) => (
                                    <div
                                      key={option.id}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`category-${option.id}-${optionIdx}`}
                                        name={`category`}
                                        defaultValue={option.id}
                                        type="radio"
                                        className="accent-primary h-4 w-4 rounded border-gray-300 "
                                        onChange={() => {
                                          handleQueryParams(
                                            "category_id",
                                            option.id
                                          );
                                          setSubCategoryOptions(
                                            option.SubCategory
                                          );
                                        }}
                                        checked={
                                          categorIdParams == option.id
                                            ? true
                                            : false
                                        }
                                      />
                                      <label
                                        htmlFor={`category-${option.id}-${optionIdx}`}
                                        className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                                      >
                                        <p className="pl-2 text-sm">
                                          {option.name}
                                        </p>
                                      </label>
                                    </div>
                                  )
                                )
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}

                  <Disclosure
                    as="div"
                    className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                    defaultOpen={false}
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className=" font-bold text-gray-900">
                              SubCategories
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <Minus className="h-5 w-5" />
                              ) : (
                                <Plus className="h-5 w-5" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {subCategoryOptions?.length === 0 ? (
                              <NoItem notFoundtext={`No Data Found.`} />
                            ) : (
                              subCategoryOptions.map(
                                (option: any, optionIdx: any) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`sub-category-${option.id}-${optionIdx}`}
                                      name={`${option.id}[]`}
                                      defaultValue={option.id}
                                      type="checkbox"
                                      className="accent-primary h-4 w-4 rounded border-gray-300 "
                                      onChange={() => {
                                        handleQueryParams(
                                          "sub_category_id",
                                          option.id
                                        );
                                      }}
                                      checked={subCategoryIdParams
                                        .map(Number)
                                        .includes(option.id)}
                                    />
                                    <label
                                      htmlFor={`sub-category-${option.id}-${optionIdx}`}
                                      className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                                    >
                                      <p className="pl-2 text-sm">
                                        {option.name}
                                      </p>
                                    </label>
                                  </div>
                                )
                              )
                            )}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  <Disclosure
                    as="div"
                    className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                    defaultOpen={false}
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className=" font-bold text-gray-900">
                              Level
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <Minus className="h-5 w-5" />
                              ) : (
                                <Plus className="h-5 w-5" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {coursesLevelOptions.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`level-${option.value}-${optionIdx}`}
                                  name={`${option.value}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  className="accent-primary h-4 w-4 rounded border-gray-300 "
                                  onChange={() =>
                                    handleQueryParams(
                                      "course_level",
                                      option.value
                                    )
                                  }
                                  checked={courseLevelParams
                                    .map(Number)
                                    .includes(option.value)}
                                />
                                <label
                                  htmlFor={`level-${option.value}-${optionIdx}`}
                                  className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                                >
                                  <p className="pl-2 text-sm">{option.name}</p>
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  <Disclosure
                    as="div"
                    className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                    defaultOpen={false}
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className=" font-bold text-gray-900">
                              Price
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <Minus className="h-5 w-5" />
                              ) : (
                                <Plus className="h-5 w-5" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            <label htmlFor="" className="text-xs">
                              Min Price
                            </label>
                            <Input
                              type="number"
                              className="!mt-1"
                              value={priceFilter.minPrice}
                              onChange={(e) =>
                                setPriceFilter((prev: any) => ({
                                  ...prev,
                                  minPrice: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-4">
                            <label htmlFor="" className="text-xs">
                              Max Price
                            </label>
                            <Input
                              type="number"
                              className="!mt-1"
                              value={priceFilter.maxPrice}
                              onChange={(e) =>
                                setPriceFilter((prev: any) => ({
                                  ...prev,
                                  maxPrice: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() =>
                              handleQueryParams("price_filter", priceFilter)
                            }
                            className="mt-4 w-full"
                          >
                            Price Filter
                          </Button>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main>
          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <NegativeXAxisAnimation
                isOneTime={true}
                classes={`hidden lg:block`}
              >
                <h3 className="sr-only">Categories</h3>

                <Disclosure
                  as="div"
                  className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                  defaultOpen={true}
                >
                  {({ open }) => (
                    <>
                      <div className="mb-10 w-full">
                        <label
                          htmlFor="default-search"
                          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Search
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                              />
                            </svg>
                          </div>
                          <input
                            type="search"
                            id="default-search"
                            className="block w-full rounded-lg border border-gray-300  p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            placeholder="Search Courses..."
                            required
                            onChange={(e) =>
                              handleQueryParams("search", e.target.value)
                            }
                            value={searchAllParams}
                          />
                        </div>
                      </div>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className=" font-bold text-gray-900">
                            Ratings
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <Minus className="h-5 w-5" />
                            ) : (
                              <Plus className="h-5 w-5" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {ratingFilter.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`rating-${option.value}-${optionIdx}`}
                                name={`rating`}
                                defaultValue={option.value}
                                type="radio"
                                className="accent-primary h-4 w-4 rounded border-gray-300 "
                                onChange={() =>
                                  handleQueryParams(
                                    "min_average_rating",
                                    option.value
                                  )
                                }
                                checked={
                                  minAverageRatingParams == option.value
                                    ? true
                                    : false
                                }
                              />
                              <label
                                htmlFor={`rating-${option.value}-${optionIdx}`}
                                className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                              >
                                {[1, 2, 3, 4, 5].map((index) => {
                                  if (index <= option.value) {
                                    return (
                                      <IoIosStar
                                        color="#34495e"
                                        size={13}
                                        key={index}
                                      />
                                    );
                                  }
                                  return (
                                    <IoIosStarOutline
                                      color="#34495e"
                                      size={13}
                                      key={index}
                                    />
                                  );
                                })}

                                <p className="pl-2 text-sm">{option.name}</p>
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure
                  as="div"
                  className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                  defaultOpen={true}
                >
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className=" font-bold text-gray-900">
                            Video Duration
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <Minus className="h-5 w-5" />
                            ) : (
                              <Plus className="h-5 w-5" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {videoDurationFilter.map((option, optionIdx) => (
                            <div key={optionIdx} className="flex items-center">
                              <input
                                id={`duration-${option.id}`}
                                name={`duration`}
                                type="radio"
                                className="accent-primary h-4 w-4 rounded border-gray-300 "
                                onChange={() => {
                                  handleQueryParams(
                                    "video_duration",
                                    option.value
                                  );
                                  setActiveDurationId(option.id);
                                }}
                                checked={
                                  activeDurationId == option.id ? true : false
                                }
                              />
                              <label
                                htmlFor={`duration-${option.id}`}
                                className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                              >
                                <p className="pl-2 text-sm">{option.name}</p>
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                {isFilterLoading ? (
                  <p>Loading..</p>
                ) : (
                  <Disclosure
                    as="div"
                    className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                    defaultOpen={false}
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className=" font-bold text-gray-900">
                              Categories
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <Minus className="h-5 w-5" />
                              ) : (
                                <Plus className="h-5 w-5" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {filterCategory?.data?.category_list?.length ===
                            0 ? (
                              <NoItem notFoundtext={`No Data Found.`} />
                            ) : (
                              filterCategory?.data?.category_list.map(
                                (option: any, optionIdx: any) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`category-${option.id}-${optionIdx}`}
                                      name={`category`}
                                      defaultValue={option.id}
                                      type="radio"
                                      className="accent-primary h-4 w-4 rounded border-gray-300 "
                                      onChange={() => {
                                        handleQueryParams(
                                          "category_id",
                                          option.id
                                        );
                                        setSubCategoryOptions(
                                          option.SubCategory
                                        );
                                      }}
                                      checked={
                                        categorIdParams == option.id
                                          ? true
                                          : false
                                      }
                                    />
                                    <label
                                      htmlFor={`category-${option.id}-${optionIdx}`}
                                      className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                                    >
                                      <p className="pl-2 text-sm">
                                        {option.name}
                                      </p>
                                    </label>
                                  </div>
                                )
                              )
                            )}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )}

                <Disclosure
                  as="div"
                  className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                  defaultOpen={false}
                >
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className=" font-bold text-gray-900">
                            SubCategories
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <Minus className="h-5 w-5" />
                            ) : (
                              <Plus className="h-5 w-5" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {subCategoryOptions?.length === 0 ? (
                            <NoItem notFoundtext={`No Data Found.`} />
                          ) : (
                            subCategoryOptions.map(
                              (option: any, optionIdx: any) => (
                                <div
                                  key={option.id}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`sub-category-${option.id}-${optionIdx}`}
                                    name={`${option.id}[]`}
                                    defaultValue={option.id}
                                    type="checkbox"
                                    className="accent-primary h-4 w-4 rounded border-gray-300 "
                                    onChange={() => {
                                      handleQueryParams(
                                        "sub_category_id",
                                        option.id
                                      );
                                    }}
                                    checked={subCategoryIdParams
                                      .map(Number)
                                      .includes(option.id)}
                                  />
                                  <label
                                    htmlFor={`sub-category-${option.id}-${optionIdx}`}
                                    className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                                  >
                                    <p className="pl-2 text-sm">
                                      {option.name}
                                    </p>
                                  </label>
                                </div>
                              )
                            )
                          )}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure
                  as="div"
                  className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                  defaultOpen={false}
                >
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className=" font-bold text-gray-900">
                            Level
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <Minus className="h-5 w-5" />
                            ) : (
                              <Plus className="h-5 w-5" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {coursesLevelOptions.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`level-${option.value}-${optionIdx}`}
                                name={`${option.value}[]`}
                                defaultValue={option.value}
                                type="checkbox"
                                className="accent-primary h-4 w-4 rounded border-gray-300 "
                                onChange={() =>
                                  handleQueryParams(
                                    "course_level",
                                    option.value
                                  )
                                }
                                checked={courseLevelParams
                                  .map(Number)
                                  .includes(option.value)}
                              />
                              <label
                                htmlFor={`level-${option.value}-${optionIdx}`}
                                className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                              >
                                <p className="pl-2 text-sm">{option.name}</p>
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure
                  as="div"
                  className="mb-4 rounded-[8px] bg-white p-4 shadow-sm"
                  defaultOpen={false}
                >
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className=" font-bold text-gray-900">
                            Price
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <Minus className="h-5 w-5" />
                            ) : (
                              <Plus className="h-5 w-5" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          <label htmlFor="" className="text-xs">
                            Min Price
                          </label>
                          <Input
                            type="number"
                            className="!mt-1"
                            value={priceFilter.minPrice}
                            onChange={(e) =>
                              setPriceFilter((prev: any) => ({
                                ...prev,
                                minPrice: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-4">
                          <label htmlFor="" className="text-xs">
                            Max Price
                          </label>
                          <Input
                            type="number"
                            className="!mt-1"
                            value={priceFilter.maxPrice}
                            onChange={(e) =>
                              setPriceFilter((prev: any) => ({
                                ...prev,
                                maxPrice: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() =>
                            handleQueryParams("price_filter", priceFilter)
                          }
                          className="mt-4 w-full"
                        >
                          Price Filter
                        </Button>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </NegativeXAxisAnimation>

              <div className="lg:col-span-3">
                <div className="mb-6 flex flex-col justify-between gap-4 rounded-[8px] bg-white p-4 lg:flex-row lg:items-center">
                  <div className="flex items-center gap-x-4">
                    {searchParams.size > 0 ? (
                      <span
                        className="text-primary cursor-pointer text-sm"
                        onClick={() => handleQueryParams("delete_all", "")}
                      >
                        Clear All
                      </span>
                    ) : null}

                    <div className="flex items-center space-x-2">
                      <Label htmlFor="is-free">Free</Label>
                      <Switch
                        id="is-free"
                        checked={isFreeParams == "true" ? true : false}
                        onCheckedChange={(value) =>
                          handleQueryParams("is_free", value)
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="discount">Discount</Label>
                      <Switch
                        id="discount"
                        checked={discountStatusParams == "true" ? true : false}
                        onCheckedChange={(value) =>
                          handleQueryParams("discount_status", value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                          {!sortByParams
                            ? "Sort By"
                            : sortOptions.find(
                                (item) => item.value == sortByParams
                              )?.name}
                          <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none md:right-0">
                          <div className="py-1">
                            {sortOptions.map((option) => (
                              <Menu.Item key={option.name}>
                                {({ active }) => (
                                  <div
                                    className={classNames(
                                      option.value == sortByParams
                                        ? "font-medium text-gray-900"
                                        : "text-gray-500",
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm",
                                      "cursor-pointer"
                                    )}
                                    onClick={() =>
                                      handleQueryParams("sort_by", option.value)
                                    }
                                  >
                                    {option.name}
                                  </div>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    <button
                      type="button"
                      className={cn(
                        "-m-2 ml-5 p-2 text-gray-400  sm:ml-7",
                        itemView == "grid" && "text-primary"
                      )}
                      onClick={() => handleItemView("grid")}
                    >
                      <span className="sr-only">View grid</span>
                      <LayoutGrid className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "-m-2 ml-2 p-2 text-gray-400  sm:ml-3",
                        itemView == "list" && "text-primary"
                      )}
                      onClick={() => handleItemView("list")}
                    >
                      <span className="sr-only">List View</span>
                      <List className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                      onClick={() => setMobileFiltersOpen(true)}
                    >
                      <span className="sr-only">Filters</span>
                      <Filter className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                      (item: any, index: number) => (
                        <VerticalProductLoading key={index} />
                      )
                    )}
                  </div>
                ) : (
                  <>
                    {courseLists?.data?.list?.length === 0 ? (
                      <div className="m-4 ">
                        <NoItem notFoundtext={`No Data Found.`} />
                      </div>
                    ) : (
                      <div>
                        {itemView == "grid" ? (
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
                                  course={item.course}
                                />
                              )
                            )}
                          </PositiveYAxisAnimation>
                        ) : (
                          <PositiveYAxisAnimation
                            isOneTime={true}
                            classes={`grid grid-cols-1 gap-4`}
                          >
                            {courseLists?.data?.list?.map(
                              (item: any, index: number) => (
                                <HorizontalProduct
                                  key={index}
                                  course={item.course}
                                />
                              )
                            )}
                          </PositiveYAxisAnimation>
                        )}
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
        </main>
      </div>
    </div>
  );
}
