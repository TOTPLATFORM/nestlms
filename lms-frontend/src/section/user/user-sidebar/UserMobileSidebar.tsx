"use client";
import React, { Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { MdClose } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import AnimateHeight from "react-animate-height";
import { GoDash } from "react-icons/go";
import Link from "next/link";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import moment from "moment";
import CustomImage from "@/components/CustomImage";
import { Video } from "lucide-react";

export default function UserMobileSidebar({
  navigation,
  classNames,
  teams,
  sidebarOpen,
  setSidebarOpen,
  activeMenuItem,
  handleSubmenu,
  handleNavmenu,
  pathName,
}: any) {
  const { t } = useTranslation();
  const { user } = useSelector(
    (state: IRootState) => state.userSlice?.user || {}
  );
  const { agora } =
    useSelector((state: IRootState) => state?.common?.data) || {};

  const liveClass = {
    name: "Live Class",
    href: "/instructor/live-class",
    icon: Video,
    current: false,
    id: 6,
  };
  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 lg:hidden"
        onClose={setSidebarOpen}
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
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>

                    <MdClose size={22} />
                  </button>
                </div>
              </Transition.Child>
              <div className="bg-sidebar flex grow flex-col gap-y-5 border-r border-gray-200 p-6 pb-4">
                <div>
                  <div className="flex w-full flex-col items-center justify-center gap-3">
                    <div className="relative">
                      <div className="border-primary aspect-square w-[100px] overflow-hidden rounded-full border-4">
                        <CustomImage
                          imageUrl={`${
                            user?.photo || "/images/profile-pic.jpeg"
                          }`}
                        />
                      </div>
                      <span className="bg-primary absolute bottom-0  right-2 me-2 rounded-full px-2.5 py-0.5 text-xs font-medium text-white dark:bg-gray-900 dark:text-purple-300">
                        Instructor
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#F5EEE6]">
                      {user?.first_name} {user?.last_name}
                    </h3>
                  </div>

                  <div className="mt-3 grid grid-cols-2 divide-x rounded-md border border-gray-800  p-2 text-[#F5EEE6]">
                    <div className="text-center">
                      <div>
                        <h3 className="font-bold">
                          {user?.Course?.length ? user?.Course?.length : 0}
                        </h3>
                        <p className="text-xs">Course</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div>
                        <h3 className="font-bold">Joined At</h3>
                        <p className="text-xs">
                          {moment(user?.created_at).format("ll")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <nav className="flex max-h-[50vh] flex-1 flex-col overflow-y-auto overflow-x-hidden">
                  <ul role="list" className="space-y-1">
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
                                          ? "bg-primary text-white"
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
                    {agora?.agora_status == 1 && (
                      <li>
                        <Menu as="div" className="block w-full text-left">
                          <div className="w-full">
                            <Menu.Button
                              className={classNames(
                                liveClass.id == activeMenuItem
                                  ? "bg-gray-50 text-gray-600"
                                  : "text-[#F5EEE6] hover:bg-gray-50 hover:text-gray-600",
                                "group flex w-full items-center gap-x-3 rounded-md p-2 py-3  text-sm leading-6"
                              )}
                              onClick={() => handleNavmenu(liveClass)}
                            >
                              <liveClass.icon size={20} />
                              {t(liveClass.name)}
                            </Menu.Button>
                          </div>
                        </Menu>
                      </li>
                    )}
                  </ul>
                </nav>
                <div className="bg-sidebar fixed bottom-0 mb-2 mt-auto w-[240px]">
                  <Link
                    href={`/admin/logs`}
                    className="group flex w-full items-center gap-x-3 rounded-md px-2 py-3 text-sm font-semibold leading-6 text-[#F5EEE6] hover:bg-gray-50 hover:text-gray-600"
                  >
                    <IoDocumentTextOutline size={18} />
                    {t(`Logout`)}
                  </Link>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
