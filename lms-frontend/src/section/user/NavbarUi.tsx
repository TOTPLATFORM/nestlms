"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { IRootState } from "@/store";
import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLogout } from "@/hooks/auth.hook";
import NotificationDropdown from "@/components/dropdown/notification";
import { useGetSearchCourseListsForNavbar } from "@/hooks/user/public/course.category.hook";
import NoItem from "@/components/NoItem";
import CustomImage from "@/components/CustomImage";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import LanguageSelector from "@/components/language-selector/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

interface NavbarUiProps {
  setOpenCart: (value: boolean | ((prev: boolean) => boolean)) => void;
}

interface SearchCourse {
  id: string;
  name: string;
  slug: string;
  thumbnail_link: string;
}

interface UserRoles {
  is_instructor: boolean;
  is_admin: boolean;
}

interface User {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    photo: string;
  };
  user_roles: UserRoles;
}

export default function NavbarUi({ setOpenCart }: NavbarUiProps) {
  const { isLoading, logout } = useLogout();
  const { user, isLoggedIn } = useSelector(
    (state: IRootState) => state.userSlice
  );
  const { cartInfo } =
    useSelector((state: IRootState) => state.cartSlice) || {};
  const { settings } =
    useSelector((state: IRootState) => state?.common?.data) || {};

  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  const {
    data: searchCourseLists,
    setIsSearchEnable,
    isSearchEnable,
    setSearch,
    isLoading: isSearchLoading,
  } = useGetSearchCourseListsForNavbar();

  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchEnable(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSearchEnable]);

  return (
    <header className="sticky top-0 z-50 bg-[#F5F7F8]">
      <nav
        className={`left-0 top-0 z-50 mx-auto grid w-full grid-cols-12 items-center gap-x-2 overflow-visible bg-[#F5F7F8] px-4 lg:gap-x-4 lg:px-6`}
      >
        {/* Logo and Mobile Menu Button */}
        <div className="col-span-6 flex gap-x-2 lg:col-span-2 lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 py-5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-[60px] w-auto md:h-[75px]"
              src={settings?.site_logo || "/images/logo.webp"}
              alt=""
            />
          </Link>
          <div className="flex justify-start lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="col-span-4 hidden lg:flex 2xl:col-span-5">
          <label
            htmlFor="search-dropdown"
            className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {t("menu.search")}
          </label>

          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              className="focus:border-primary focus:ring-primary dark:focus:border-primary z-20 block w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 dark:border-gray-600 dark:border-s-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Search Courses ..."
              required
              onChange={(e) => {
                setSearch(e.target.value);
                setIsSearchEnable(true);
              }}
            />
            <button
              type="button"
              onClick={() => setIsSearchEnable(true)}
              className="border-primary bg-primary hover:bg-primary focus:ring-primary dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary absolute end-0 top-0 h-full rounded-e-lg border p-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              <svg
                className="h-4 w-4"
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
              <span className="sr-only">Search</span>
            </button>
            {isSearchEnable && (
              <div
                ref={searchDropdownRef}
                className="absolute left-0 top-full z-[101] max-h-[40vh] min-w-full max-w-4xl overflow-y-auto rounded-[8px] bg-white p-6 shadow-lg"
              >
                <div className="flex w-full justify-end text-right">
                  <X
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => setIsSearchEnable(false)}
                  />
                </div>

                {searchCourseLists?.data?.length === 0 || !searchCourseLists ? (
                  <NoItem notFoundtext={`No Comments.`} />
                ) : (
                  <div className="w-full">
                    {searchCourseLists?.data?.map((item: SearchCourse) => (
                      <div className="mb-4 w-full py-4 last:mb-0" key={item.id}>
                        <Link
                          href={`/course/${item.slug}`}
                          onClick={() => setIsSearchEnable(false)}
                        >
                          <div className="flex w-full items-center gap-6">
                            <div className="h-[50px] max-h-[50px] min-h-[50px] min-w-[50px] max-w-[50px] overflow-hidden rounded-[8px]">
                              <CustomImage
                                imageUrl={
                                  item.thumbnail_link ||
                                  "/images/course_banner.avif"
                                }
                              />
                            </div>
                            <h2 className="text-base font-bold">{item.name}</h2>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="col-span-4 hidden w-full items-center justify-end lg:flex 2xl:col-span-3">
          <Link
            href="/"
            className="px-2 text-base font-normal whitespace-nowrap text-gray-900"
          >
            {t(`menu.links.home`)}
          </Link>
          <Link
            href="/tutors"
            className="px-2 text-base font-normal whitespace-nowrap text-gray-900"
          >
            {t(`menu.links.instructors`)}
          </Link>
          <Link
            href="/courses"
            className="px-2 text-base font-normal whitespace-nowrap text-gray-900"
          >
            {t(`menu.links.courses`)}
          </Link>
          <Link
            href="/blogs"
            className="px-2 text-base font-normal whitespace-nowrap text-gray-900"
          >
            {t(`menu.links.blogs`)}
          </Link>
          {isLoggedIn && user?.user_roles?.is_instructor ? (
            <Link href="/instructor">
              <div className="group relative ml-3">
                <button
                  type="button"
                  className="flex items-center gap-x-1 rounded-md border px-3 py-2 text-sm font-normal leading-6 text-gray-500"
                >
                  {t(`menu.links.instructordashboard`)}
                </button>
              </div>
            </Link>
          ) : isLoggedIn && !user?.user_roles?.is_admin ? (
            <Link href="/user/become-an-instructor">
              <div className="group relative ml-3">
                <button
                  type="button"
                  className="flex items-center gap-x-1 rounded-md border px-3 py-2 text-sm font-normal leading-6 text-gray-500"
                >
                  {t(`menu.links.becomeaninstructor`)}
                </button>
              </div>
            </Link>
          ) : null}
        </div>

        {/* Right Side Menu */}
        <div className="col-span-6 flex flex-1 items-center justify-end gap-x-3 lg:col-span-2 2xl:col-span-2">
          <LanguageSelector />

          <div
            className="relative mr-2 cursor-pointer"
            onClick={() => setOpenCart((prev: boolean) => !prev)}
          >
            <ShoppingCart className="h-6 w-6" />
            <div className="bg-primary absolute -top-1/2 left-1/2 flex h-6 w-6 items-center justify-center rounded-full text-xs text-white">
              <p>
                {cartInfo?.productsList ? cartInfo?.productsList?.length : 0}
              </p>
            </div>
          </div>
          {isLoggedIn && <NotificationDropdown />}

          {!isLoggedIn && (
            <Link
              href={`/login`}
              className="flex items-center gap-1 text-sm font-semibold leading-6 text-gray-900"
            >
              {t(`menu.links.login`)}
              <MdOutlineArrowRightAlt size={18} className="arrow-icon" />
            </Link>
          )}
          {isLoggedIn && (
            <div className="group relative ml-3 py-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.user.photo || "/images/avatar.svg"}
                        alt={user?.user?.first_name}
                      />
                      <AvatarFallback>
                        {user?.user?.first_name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.user?.first_name} {user?.user?.last_name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/user/profile">
                      <DropdownMenuItem>
                        {t(`menu.links.profile`)}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/user/my-courses">
                      <DropdownMenuItem>
                        {t(`menu.links.mycourses`)}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/user/wishlists">
                      <DropdownMenuItem>
                        {t(`menu.links.wishlists`)}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/cart">
                      <DropdownMenuItem>
                        {t(`menu.links.mycart`)}
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    {t(`menu.links.logout`)}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileNavOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-[100]"></div>
          <div className="fixed inset-y-0 right-0 z-[100] w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-[45px] w-auto"
                  src={settings?.site_logo || "/images/logo.webp"}
                  alt=""
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="">
                <div className="space-y-2 py-6">
                  <div className="flex w-full flex-col items-start gap-y-4">
                    <Link
                      href="/"
                      className="px-2 text-base font-normal text-gray-900"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      {t(`menu.links.home`)}
                    </Link>
                    <Link
                      href="/tutors"
                      className="px-2 text-base font-normal text-gray-900"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      {t(`menu.links.instructors`)}
                    </Link>
                    <Link
                      href="/courses"
                      className="px-2 text-base font-normal text-gray-900"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      {t(`menu.links.courses`)}
                    </Link>
                    <Link
                      href="/blogs"
                      className="px-2 text-base font-normal text-gray-900"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      {t(`menu.links.blogs`)}
                    </Link>
                    {isLoggedIn && user?.user_roles?.is_instructor ? (
                      <Link href="/instructor">
                        <div className="group relative ml-3">
                          <button
                            type="button"
                            className="flex items-center gap-x-1 rounded-md border px-3 py-2 text-sm font-normal leading-6 text-gray-500"
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            {t(`menu.links.instructordashboard`)}
                          </button>
                        </div>
                      </Link>
                    ) : isLoggedIn && !user?.user_roles?.is_admin ? (
                      <Link href="/user/become-an-instructor">
                        <div className="group relative ml-3">
                          <button
                            type="button"
                            className="flex items-center gap-x-1 rounded-md border px-3 py-2 text-sm font-normal leading-6 text-gray-500"
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            {t(`menu.links.becomeaninstructor`)}
                          </button>
                        </div>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
