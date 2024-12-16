import React from "react";
import ReactPaginate from "react-paginate";

export default function CustomPagination({
  handlePageClick,
  totalItems,
  perPageItems,
  activePage = 1,
}: any) {
  return (
    <ReactPaginate
      breakLabel="..."
      className={`m-auto mb-4 inline-flex items-center space-x-1 rtl:space-x-reverse`}
      pageLinkClassName={`w-[36px] h-[36px] flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary`}
      previousLinkClassName={`w-[36px] h-[36px] flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary`}
      activeLinkClassName={`w-[36px] h-[36px] flex justify-center rounded-full !bg-primary !text-white px-3.5 py-2 font-semibold text-white transition dark:bg-primary dark:text-white-light`}
      nextLabel={
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 rtl:rotate-180"
        >
          <path
            d="M11 19L17 12L11 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            opacity="0.5"
            d="M6.99976 19L12.9998 12L6.99976 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      }
      marginPagesDisplayed={2}
      nextLinkClassName={`w-[36px] h-[36px] flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary`}
      onPageChange={handlePageClick}
      pageRangeDisplayed={2}
      pageCount={totalItems / perPageItems}
      forcePage={activePage - 1}
      disabledLinkClassName={`cursor-not-allowed  dark:hover:bg-[#191e3a] hover:bg-white-light`}
      previousLabel={
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 rtl:rotate-180"
        >
          <path
            d="M13 19L7 12L13 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            opacity="0.5"
            d="M16.9998 19L10.9998 12L16.9998 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      }
      renderOnZeroPageCount={null}
    />
  );
}
