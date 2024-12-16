"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";

export default function DemoHomePage() {
  return (
    <div className="relative min-h-screen w-full bg-[#F5F7F8]">
      <header className="relative bg-transparent">
        <nav
          className={`left-0 top-0 z-50 mx-auto flex w-full grid-cols-12 items-center justify-between gap-x-2 overflow-visible bg-transparent  px-4 lg:gap-x-4  lg:px-6`}
        >
          <div className="col-span-6 flex gap-x-2 lg:col-span-2 lg:flex-1">
            <a
              href="https://tutorlab.tradexpro.org/"
              className="-m-1.5 p-1.5 py-5"
              target="_blank"
            >
              <span className="sr-only">Your Company</span>
              <img
                className="h-[30px] w-auto md:h-[45px] "
                src={"/images/logo.png"}
                alt=""
              />
            </a>
          </div>

          <div className="col-span-6 flex flex-1 items-center  justify-end gap-x-2 lg:col-span-2 2xl:col-span-1">
            <a
              href={`https://codecanyon.net/item/tutorlab-learning-management-system-saas-platform/50396294`}
              className="text-sm font-semibold leading-6 text-gray-900"
              target="_blank"
            >
              <Button className="text-primary flex items-center gap-2 rounded-full bg-white font-bold hover:text-white">
                <span>
                  {" "}
                  <ShoppingCart className="h-4 w-4" />
                </span>
                <span>Purchase Now </span>{" "}
              </Button>
            </a>
            <a
              href={`https://tutorlab.tradexpro.org/`}
              className="hidden text-sm font-semibold leading-6 text-gray-900 sm:block"
              target="_blank"
            >
              <Button className="rounded-full ">View Demo</Button>
            </a>
          </div>
        </nav>
      </header>
      <div className="min-h-[100vh - 80px] container">
        <div className="grid grid-cols-1 items-center gap-10 py-16 lg:mt-10 lg:grid-cols-2">
          <div>
            <h2
              className="pb-[30px] pt-2.5 text-4xl font-medium -tracking-[0.64px] text-[#212529] md:text-[40px] min-[1200px]:text-[56px]"
              style={{ lineHeight: "1.1" }}
            >
              TutorLab - Learning Management System Saas Platform
            </h2>
            <p className="pb-[40px] text-lg text-[#4A5355]">
              Architect client-centered total linkage for intuitive
              benefits.restore convergence before real-time partnerships.
            </p>
            <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center">
              <a
                href={"https://tutorlab.tradexpro.org/"}
                className="bg-primary shadow-primary/50 flex h-[54px] items-center  justify-center gap-3 rounded-full px-8 py-[15px] text-white shadow-lg"
                target="_blank"
              >
                <p>View Demo </p>
                <MdOutlineArrowRightAlt size={18} />
              </a>
              <a
                href={
                  "https://codecanyon.net/item/tutorlab-learning-management-system-saas-platform/50396294"
                }
                className="shadow-primary/50 text-primary flex h-[54px] items-center  justify-center gap-3 rounded-full bg-white px-8 py-[15px] font-bold shadow-lg"
                target="_blank"
              >
                <ShoppingCart className="h-5 w-5" />
                <p>Purchase Now </p>
              </a>
            </div>
          </div>
          <div className="relative z-10">
            <img src="/images/right_image.png" alt="" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full opacity-30">
        <img src="/images/bottom_bg.png" alt="" className="w-full" />
      </div>
    </div>
  );
}
