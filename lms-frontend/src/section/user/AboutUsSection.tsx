"use client";
import Link from "next/link";
import React from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { motion } from "framer-motion";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import CustomImage from "@/components/CustomImage";

export default function AboutUsSection({ landing_data }: any) {
  return (
    <section className="relative pb-28">
      <div className="container overflow-visible">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-5">
          <div className="relative col-span-3">
            <NegativeXAxisAnimation>
              <div className="relative">
                <div className=" overflow-hidden rounded-[8px] lg:max-w-[450px]">
                  <CustomImage
                    imageUrl={
                      landing_data?.landing_about_us_first_image_url
                        ? landing_data?.landing_about_us_first_image_url
                        : "/images/image-1.jpeg"
                    }
                  />
                </div>
                <div className="flex max-w-[200px] -translate-y-[50px] gap-[30px] rounded-bl-[8px] rounded-br-[8px] rounded-tr-[8px] bg-white p-3 shadow-lg lg:max-w-[312px] lg:p-[15px]">
                  <div>
                    <div className="w-[60px]">
                      <CustomImage
                        imageUrl={
                          landing_data?.landing_about_us_third_image_url
                            ? landing_data?.landing_about_us_third_image_url
                            : "/images/icon _Award_.png"
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold leading-[1.2] text-gray-900 lg:text-5xl">
                      5+
                    </h3>
                    <p className="text-sm font-bold leading-[1.2] text-gray-900 lg:text-lg">
                      Years of Education
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-[100px] right-0  hidden max-w-[450px] lg:block">
                <CustomImage
                  imageUrl={
                    landing_data?.landing_about_us_second_image_url
                      ? landing_data?.landing_about_us_second_image_url
                      : "/images/image-2.jpeg"
                  }
                />
              </div>
            </NegativeXAxisAnimation>
          </div>
          <div className="col-span-2">
            <PositiveXAxisAnimation>
              <h4 className="text-primary  relative  text-lg font-bold capitalize   min-[1200px]:text-2xl">
                about us
              </h4>
              <h2
                className="pb-[30px] pt-2.5 text-[40px] font-medium -tracking-[0.64px] text-[#212529] min-[1200px]:text-[50px]"
                style={{ lineHeight: "1.1" }}
              >
                {landing_data?.landing_about_us_first_title
                  ? landing_data?.landing_about_us_first_title
                  : "Our Mission is to Provide a World‑Class Education"}
              </h2>
              <p className="pb-[40px] text-lg text-[#4A5355]">
                {landing_data?.landing_about_us_first_description
                  ? landing_data?.landing_about_us_first_description
                  : "A captain of the Navy ought to be a man of strong and sense education, a gentleman, as well as a seaman both in"}
              </p>
              <div className="pb-[40px]">
                <ul>
                  <li className="before:bg-primary relative mb-2.5 pl-[30px] text-lg font-bold leading-[1.5] text-black before:absolute before:left-0 before:top-1/2 before:h-[12px] before:w-[12px] before:-translate-y-[50%] before:rounded-full">
                    {landing_data?.landing_about_us_bullet_point
                      ? landing_data?.landing_about_us_bullet_point
                      : "Access more then 100K online courses"}
                  </li>
                </ul>
              </div>
              <div className="flex items-center gap-8">
                <Link
                  href={"/courses"}
                  className="bg-primary flex items-center justify-center gap-3 rounded-[6px] px-12 py-[15px] text-white"
                >
                  <p className="font-bold capitalize">Discover Our Courses</p>
                  <MdOutlineArrowRightAlt size={18} />
                </Link>
              </div>
            </PositiveXAxisAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
