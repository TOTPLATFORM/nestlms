"use client";
import React, { Fragment, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { GoDash } from "react-icons/go";
import AnimateHeight from "react-animate-height";
import Link from "next/link";
import { IoDocumentTextOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import moment from "moment";
import CustomImage from "@/components/CustomImage";

export default function DesktopSidebar({
  navigation,
  classNames,
  teams,
  handleNavmenu,
  activeMenuItem,
  handleSubmenu,
  pathName,
}: any) {
  const { user } = useSelector(
    (state: IRootState) => state.userSlice?.user || {}
  );
  const { settings } =
    useSelector((state: IRootState) => state?.common?.data) || {};
  const { t } = useTranslation();
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="custom-scrollbar bg-sidebar flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6 pb-4">
        <div className="flex h-8 w-full items-center justify-center px-4 pb-10 pt-14">
          <img
            className="h-[56px] w-auto"
            src={settings?.site_footer_logo || "/images/logo-white.png"}
            alt="Your Company"
          />
        </div>
        <div>
          <div className="flex w-full flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="border-primary aspect-square w-[100px] overflow-hidden rounded-full border-4">
                <CustomImage
                  imageUrl={`${user?.photo || "/images/profile-pic.jpeg"}`}
                />
              </div>

              <span className="bg-primary absolute bottom-0  right-2 me-2 rounded-full px-2.5 py-0.5 text-xs font-medium text-[#F5EEE6] dark:bg-white dark:text-purple-300">
                Admin
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#F5EEE6]">
              {user?.first_name} {user?.last_name}
            </h3>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item: any) => (
                  <li key={item.name}>
                    <Menu as="div" className="block w-full text-left">
                      <div className="w-full">
                        <Menu.Button
                          className={classNames(
                            item.id == activeMenuItem
                              ? "bg-gray-50 text-gray-600"
                              : "text-[#F5EEE6] hover:bg-gray-50 hover:text-gray-600",
                            "group flex w-full items-center gap-x-3 rounded-md p-2 py-3  text-sm leading-6"
                          )}
                          onClick={() => handleNavmenu(item)}
                        >
                          <item.icon size={20} />
                          {t(item.name)}
                        </Menu.Button>
                      </div>
                      {item?.submenu?.length > 0 && (
                        <AnimateHeight
                          height={item.id == activeMenuItem ? "auto" : 0}
                        >
                          <div className="px-1 py-1 ">
                            {item?.submenu.map(
                              (subMenuItem: any, index: any) => (
                                <Menu.Button
                                  key={index}
                                  className={`${
                                    pathName == subMenuItem.href
                                      ? "bg-primary text-[#F5EEE6]"
                                      : "text-[#F5EEE6]"
                                  } group flex w-full items-center gap-x-2 rounded-md px-6 py-3 text-sm`}
                                  onClick={() => handleSubmenu(subMenuItem)}
                                >
                                  <subMenuItem.icon size={20} />
                                  {t(subMenuItem.name)}
                                </Menu.Button>
                              )
                            )}
                          </div>
                        </AnimateHeight>
                      )}
                    </Menu>
                  </li>
                ))}
              </ul>
            </li>

            <li className="mt-auto">
              <Link
                href={`/admin/logs`}
                className="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-[#F5EEE6] hover:bg-gray-50 hover:text-gray-600"
              >
                <IoDocumentTextOutline size={18} />
                {t(`Logs`)}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
