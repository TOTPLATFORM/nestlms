"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { motion } from "framer-motion";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import NegativeYAxisAnimation from "@/components/animation/NegativeYAxisAnimation";
import PositiveYAxisAnimation from "@/components/animation/PositiveYAxisAnimation";
import CustomImage from "@/components/CustomImage";
import { MdCategory } from "react-icons/md";

export default function NewCategorySection() {
  return (
    <section className="mt-0 overflow-hidden pb-28">
      <div className="container relative overflow-visible">
        <div className="bg-primary absolute -right-1/2 left-0 ml-4 h-full rounded-bl-[50px] rounded-tl-[50px]"></div>
        <div className="bg-primary relative rounded-[20px] p-[20px] lg:rounded-[50px] lg:p-[70px]">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div className="relative grid gap-4 gap-y-4  md:grid-cols-2 md:gap-8">
              <div
                className={`custom-shadow flex w-full flex-col items-center gap-y-[30px] rounded-[8px] bg-white p-[40px] lg:w-auto`}
              >
                <div className="max-w-[50px]">
                  <MdCategory className="text-primary" size={50} />
                </div>

                <div className="text-center">
                  <h3 className="pb-[5px] text-lg font-bold leading-[1.2]">
                    Computer Science
                  </h3>
                  <p>03 Courses </p>
                </div>
              </div>
              <div
                className={` custom-shadow flex w-full flex-col items-center gap-y-[30px] rounded-[8px] bg-white p-[40px]  lg:w-auto`}
              >
                <div className="max-w-[50px]">
                  <MdCategory className="text-primary" size={50} />
                </div>
                <div className="text-center">
                  <h3 className="pb-[5px] text-lg font-bold leading-[1.2]">
                    Artificial Intelligence
                  </h3>
                  <p>08 Courses </p>
                </div>
              </div>
              <div
                className={` custom-shadow flex w-full flex-col items-center gap-y-[30px] rounded-[8px] bg-white p-[40px]  lg:w-auto`}
              >
                <div className="max-w-[50px]">
                  <MdCategory className="text-primary" size={50} />
                </div>
                <div className="text-center">
                  <h3 className="pb-[5px] text-lg font-bold leading-[1.2]">
                    Business
                  </h3>
                  <p>05 Courses </p>
                </div>
              </div>
              <div
                className={` custom-shadow flex w-full flex-col items-center gap-y-[30px] rounded-[8px] bg-white p-[40px]  lg:w-auto`}
              >
                <div className="max-w-[50px]">
                  <MdCategory className="text-primary" size={50} />
                </div>
                <div className="text-center">
                  <h3 className="pb-[5px] text-lg font-bold leading-[1.2]">
                    Marketing
                  </h3>
                  <p>01 Courses </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="relative  text-lg font-bold capitalize text-white before:left-0   min-[1200px]:text-2xl">
                Categories
              </h4>
              <h2
                className="pb-[30px] pt-2.5 text-[40px] font-bold -tracking-[0.64px] text-white min-[1200px]:text-5xl"
                style={{ lineHeight: "1.1" }}
              >
                Featured topics by Category
              </h2>

              <div className="flex items-center gap-8">
                <Link
                  href={"/courses"}
                  className="text-primary flex items-center justify-center gap-3 rounded-[6px] bg-white px-6 py-[7px]"
                >
                  <p className="font-bold capitalize">Explore</p>
                  <MdOutlineArrowRightAlt size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
