"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";

const CookieBanner = () => {
  const [isCookieAccepted, setIsCookieAccepted] = useState(
    Cookies.get("cookieAccepted") ? true : false
  );

  const acceptCookies = () => {
    Cookies.set("cookieAccepted", "true", { expires: 365 });
    setIsCookieAccepted(true);
  };

  const cancelCookies = () => {
    setIsCookieAccepted(true);
  };

  return !isCookieAccepted ? (
    <div>
      <div
        id="bottom-banner"
        tabIndex={-1}
        className="fixed bottom-0 start-0 z-50 flex w-full justify-between border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
      >
        <div className="mx-auto flex items-center">
          <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
            <span className="me-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 p-1 dark:bg-gray-600">
              <svg
                className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18.435 7.546A2.32 2.32 0 0 1 17.7 5.77a3.354 3.354 0 0 0-3.47-3.47 2.322 2.322 0 0 1-1.776-.736 3.357 3.357 0 0 0-4.907 0 2.281 2.281 0 0 1-1.776.736 3.414 3.414 0 0 0-2.489.981 3.372 3.372 0 0 0-.982 2.49 2.319 2.319 0 0 1-.736 1.775 3.36 3.36 0 0 0 0 4.908A2.317 2.317 0 0 1 2.3 14.23a3.356 3.356 0 0 0 3.47 3.47 2.318 2.318 0 0 1 1.777.737 3.36 3.36 0 0 0 4.907 0 2.36 2.36 0 0 1 1.776-.737 3.356 3.356 0 0 0 3.469-3.47 2.319 2.319 0 0 1 .736-1.775 3.359 3.359 0 0 0 0-4.908ZM8.5 5.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3 9.063a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm2.207-6.856-6 6a1 1 0 0 1-1.414-1.414l6-6a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span className="sr-only">Discount</span>
            </span>
            <span>
              This website uses cookies to enhance your experience. By
              continuing to use this site, you consent to our use of cookies.{" "}
              <span
                className="ms-0 flex items-center text-sm font-medium text-blue-600 hover:underline md:ms-1 md:inline-flex dark:text-blue-500"
                onClick={acceptCookies}
              >
                Accept
                <svg
                  className="ms-2 h-3 w-3 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </span>
            </span>
          </p>
        </div>
        <div className="flex items-center">
          <button
            data-dismiss-target="#bottom-banner"
            type="button"
            className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={cancelCookies}
          >
            <svg
              className="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close banner</span>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CookieBanner;
