"use client";
import CustomImage from "@/components/CustomImage";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import React from "react";
import { FaBookReader } from "react-icons/fa";

export default function WhyChooseUs({ landing_data }: any) {
  return (
    <section className="container mx-auto gap-12 overflow-hidden px-4 py-28 text-gray-600 md:px-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NegativeXAxisAnimation>
          <div>
            <h4 className="text-primary before:bg-primary relative text-lg font-bold capitalize before:absolute min-[1200px]:text-2xl">
              Why Choose Us
            </h4>
            <h2 className="py-2 text-4xl font-bold lg:text-5xl">
              {landing_data?.landing_choose_us_first_title
                ? landing_data?.landing_choose_us_first_title
                : "Find More About Us E-Learning Experience"}
            </h2>
          </div>
          <div className="mb-5 mt-6 p-2 lg:p-10">
            <div className="relative flex w-full justify-start">
              <div className="border-primary absolute -left-3 sm:-left-5 top-5 aspect-[11/16] sm:aspect-[12/16] h-[400px] md:h-[500px] rounded-bl-lg rounded-br-lg border-x-2 border-b-2"></div>
              <div className="mr-[20px] aspect-[12/16] h-[400px] md:h-[500px] overflow-hidden rounded-[20px]">
                <CustomImage
                  imageUrl={
                    landing_data?.landing_choose_us_first_image_url
                      ? landing_data?.landing_choose_us_first_image_url
                      : "/images/laptop-girl.png"
                  }
                />
              </div>
            </div>
          </div>
        </NegativeXAxisAnimation>
        <PositiveXAxisAnimation
          classes={`grid grid-cols-1 gap-4 md:grid-cols-2`}
        >
          <div className="custom-shadow rounded-md bg-white p-5">
            <div className="mb-4">
              <div className="h-[50px] w-[50px]">
                <FaBookReader className="text-primary" size={50} />
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-[20px] font-bold">
                {landing_data?.landing_choose_us_first_title
                  ? landing_data?.landing_choose_us_first_title
                  : "Flexible Learning"}
              </h2>
              <p className="text-sm">
                {landing_data?.landing_choose_us_list_first_description
                  ? landing_data?.landing_choose_us_list_first_description
                  : "Providing multiple means of engage representation, and expression for all students to learn."}
              </p>
            </div>
          </div>
          <div className="custom-shadow rounded-md bg-white p-5">
            <div className="mb-4">
              <div className="h-[50px] w-[50px]">
                <FaBookReader className="text-primary" size={50} />
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-[20px] font-bold">
                {landing_data?.landing_choose_us_list_second_title
                  ? landing_data?.landing_choose_us_list_second_title
                  : "Flexible Learning"}
              </h2>
              <p className="text-sm">
                {landing_data?.landing_choose_us_list_second_description
                  ? landing_data?.landing_choose_us_list_second_description
                  : "Providing multiple means of engage representation, and expression for all students to learn."}
              </p>
            </div>
          </div>
          <div className="custom-shadow rounded-md bg-white p-5">
            <div className="mb-4">
              <div className="h-[50px] w-[50px]">
                <FaBookReader className="text-primary" size={50} />
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-[20px] font-bold">
                {landing_data?.landing_choose_us_list_third_title
                  ? landing_data?.landing_choose_us_list_third_title
                  : "Flexible Learning"}
              </h2>
              <p className="text-sm">
                {landing_data.landing_choose_us_list_third_description
                  ? landing_data.landing_choose_us_list_third_description
                  : "Providing multiple means of engage representation, and expression for all students to learn."}
              </p>
            </div>
          </div>
          <div className="custom-shadow rounded-md bg-white p-5">
            <div className="mb-4">
              <div className="h-[50px] w-[50px]">
                <FaBookReader className="text-primary" size={50} />
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-[20px] font-bold">
                {landing_data?.landing_choose_us_list_fourth_title
                  ? landing_data?.landing_choose_us_list_fourth_title
                  : "Flexible Learning"}
              </h2>
              <p className="text-sm">
                {landing_data?.landing_choose_us_list_fourth_description
                  ? landing_data?.landing_choose_us_list_fourth_description
                  : "Providing multiple means of engage representation, and expression for all students to learn."}
              </p>
            </div>
          </div>
        </PositiveXAxisAnimation>
      </div>
    </section>
  );
}
