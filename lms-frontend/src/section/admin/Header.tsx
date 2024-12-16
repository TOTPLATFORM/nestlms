"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { IRootState } from "@/store";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { useLogout } from "@/hooks/auth.hook";
import NotificationDropdown from "@/components/dropdown/notification";

export default function NavbarUi({ setSidebarOpen, sidebarOpen }: any) {
  const { isLoading, logout } = useLogout();
  const { user, isLoggedIn } = useSelector(
    (state: IRootState) => state.userSlice
  );
  const { cartInfo } = useSelector((state: IRootState) => state.cartSlice);
  const { settings } =
    useSelector((state: IRootState) => state?.common?.data) || {};
  return (
    <header className="bg-white">
      <nav
        className={`custom-shadow  left-0 top-0 z-50 mx-auto grid h-[80px] w-full grid-cols-12 items-center gap-x-4 overflow-visible border-b bg-white px-4 lg:px-6`}
      >
        <div className="col-span-6 flex w-full items-center gap-x-4 lg:hidden">
          <Link href="/" className=" p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-[30px] w-auto md:h-[52px]"
              src={settings?.site_logo || "/images/logo.png"}
              alt=""
            />
          </Link>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
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

        <div className="col-span-9 hidden w-full items-center justify-end lg:flex xl:col-span-10 2xl:col-span-11">
          <Link
            href="/admin/courses/create"
            className=" mr-2 rounded-md  border px-3  py-2 text-base font-normal text-gray-600"
          >
            <i className="fa-regular fa-plus mr-2"></i>
            Create Course
          </Link>
          <Link
            href="/admin/user/create"
            className=" mr-2 rounded-md  border px-3  py-2 text-base font-normal text-gray-600"
          >
            <i className="fa-regular fa-plus mr-2"></i>
            Create User
          </Link>
          <Link
            href="/admin/coupon/create"
            className=" mr-2 rounded-md  border px-3  py-2 text-base font-normal text-gray-600"
          >
            <i className="fa-regular fa-plus mr-2"></i>
            Add Coupon
          </Link>
        </div>

        <div className="col-span-6 flex flex-1 items-center justify-end gap-x-4 lg:col-span-3 xl:col-span-2  2xl:col-span-1">
          {isLoggedIn && <NotificationDropdown />}

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
                        src={user?.user.photo || "/images/profile-pic.jpeg"}
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
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link href="/admin/payouts/withdraw-request-lists">
                      <DropdownMenuItem>Payouts</DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
