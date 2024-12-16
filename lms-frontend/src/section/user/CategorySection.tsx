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

export default function CategorySection() {
  return (
    <section className="mt-0 pb-28 lg:mt-28">
      <div className="container overflow-visible">
        <div className="relative rounded-[12px] bg-primary/10 px-[20px] py-[30px] lg:px-[50px] lg:py-[100px]">
          <img
            src="/images/category-shape-2.png"
            alt=""
            className="absolute bottom-0 right-0 z-[2]"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
              <h4 className="text-primary  relative text-lg font-bold capitalize before:left-0   min-[1200px]:text-2xl">
                Categories
              </h4>
              <h2
                className="pb-[30px] pt-2.5 text-[40px] font-bold -tracking-[0.64px] text-gray-900 min-[1200px]:text-5xl"
                style={{ lineHeight: "1.1" }}
              >
                Featured topics by Category
              </h2>

              <div className="flex items-center gap-8">
                <Link
                  href={"/courses"}
                  className="bg-primary flex items-center justify-center gap-3 rounded-[6px] px-6 py-[7px] text-white"
                >
                  <p className="font-bold capitalize">Explore</p>
                  <MdOutlineArrowRightAlt size={18} />
                </Link>
              </div>
            </div>
            <div className="relative mt-6 flex flex-col items-center gap-y-4 lg:mt-0 lg:block">
              <NegativeXAxisAnimation
                classes={`flex w-full flex-col items-center gap-y-[30px] rounded-[8px] bg-white p-[40px] custom-shadow lg:w-auto lg:max-w-[245px] xl:ml-[70px]`}
              >
                <div className="max-w-[50px]">
                  <CustomImage imageUrl="/images/icon _University.png" />
                </div>

                <div className="text-center">
                  <h3 className="pb-[5px] text-lg font-bold leading-[1.2]">
                    Computer Science
                  </h3>
                  <p>03 Courses </p>
                </div>
              </NegativeXAxisAnimation>
              <NegativeYAxisAnimation
                classes={`-top-[160px] right-0 flex w-full flex-col items-center gap-y-[30px] rounded-[8px] bg-white p-[40px] custom-shadow lg:absolute lg:w-auto lg:max-w-[245px]`}
              >
                <div className="max-w-[50px]">
                  <CustomImage imageUrl="/images/icon _University.png" />
                </div>
                <div className="text-center">
                  <h3 className="pb-[5px] text-lg font-bold leading-[1.2]">
                    Artificial Intelligence
                  </h3>
                  <p>08 Courses </p>
                </div>
              </NegativeYAxisAnimation>
              <PositiveYAxisAnimation
                classes={`-bottom-[160px] right-0 flex w-full flex-col items-center gap-y-[30px] rounded-[8px] bg-white p-[40px] custom-shadow lg:absolute lg:w-auto lg:max-w-[245px]`}
              >
                <div className="max-w-[50px]">
                  <CustomImage imageUrl="/images/icon _University.png" />
                </div>
                <div className="text-center">
                  <h3 className="pb-[5px] text-lg font-bold leading-[1.2]">
                    Business
                  </h3>
                  <p>05 Courses </p>
                </div>
              </PositiveYAxisAnimation>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-5">
          <div className="w-[165px]">
            <CustomImage imageUrl="/images/catteam.png" />
          </div>
          <p className="text-lg font-bold leading-[28px] text-[#001920]">
            We’ve 1000 Satisfied customers with our services.
          </p>
        </div>
      </div>
    </section>
  );
}
