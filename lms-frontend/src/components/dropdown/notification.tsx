import React, { useState, useEffect } from "react";
import moment from "moment";
import { useGetNotification } from "@/hooks/notification";
import Link from "next/link";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, refetch } = useGetNotification(5, 1);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (isOpen && !event.target.closest(".dropdown-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 block rounded-md border border-transparent bg-white p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400 dark:focus:ring-opacity-40"
      >
        <svg
          className="h-5 w-5 text-gray-800 dark:text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C10.8954 22 10 21.1046 10 20H14C14 21.1046 13.1046 22 12 22ZM20 19H4V17L6 16V10.5C6 7.038 7.421 4.793 10 4.18V2H13C12.3479 2.86394 11.9967 3.91762 12 5C12 5.25138 12.0187 5.50241 12.056 5.751H12C10.7799 5.67197 9.60301 6.21765 8.875 7.2C8.25255 8.18456 7.94714 9.33638 8 10.5V17H16V10.5C16 10.289 15.993 10.086 15.979 9.9C16.6405 10.0366 17.3226 10.039 17.985 9.907C17.996 10.118 18 10.319 18 10.507V16L20 17V19ZM17 8C16.3958 8.00073 15.8055 7.81839 15.307 7.477C14.1288 6.67158 13.6811 5.14761 14.2365 3.8329C14.7919 2.5182 16.1966 1.77678 17.5954 2.06004C18.9942 2.34329 19.9998 3.5728 20 5C20 6.65685 18.6569 8 17 8Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-64 origin-top-right overflow-hidden rounded-md bg-white shadow-lg dark:bg-gray-800 sm:w-80">
          <div className="py-2">
            {data?.list.length === 0 && (
              <div className="mx-2 flex w-full items-center justify-center border-b border-gray-100 px-4 py-24">
                <p className="mx-2 text-sm text-gray-400 dark:text-white">
                  No notifications
                </p>
              </div>
            )}
            {data?.list.map((item: any) => (
              <a
                href="#"
                className="-mx-2 flex transform items-center border-b border-gray-100 px-4 py-3 transition-colors duration-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <img
                  className="mx-1 h-8 w-8 flex-shrink-0 rounded-full object-cover"
                  src="/images/bell_icon.png"
                  alt="avatar"
                />
                <p className="mx-2 text-sm text-gray-600 dark:text-white">
                  <span className="font-bold">{item?.title}</span>
                </p>
                <br />
                <p className="mx-2 text-sm text-gray-400 dark:text-white">
                  {moment(item?.created_at).startOf("hour").fromNow()}
                </p>
              </a>
            ))}
          </div>
          <Link
            href="/user/notifications"
            className="bg-primary dark:bg-primary block py-2 text-center font-bold text-white hover:underline"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
