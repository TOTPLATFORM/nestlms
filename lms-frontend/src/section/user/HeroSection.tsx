"use client";
import Link from "next/link";
import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaPinterest } from "react-icons/fa";
import { motion } from "framer-motion";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import CustomImage from "@/components/CustomImage";

export default function HeroSection({ landing_data }: any) {
  return (
    <section
      className="relative overflow-hidden  bg-[#F5F7F8] pb-36"
      style={{ backdropFilter: "blur(14px)" }}
    >
      <div className="from-primary/50 absolute -left-[20%] aspect-square w-[600px] rounded-full bg-gradient-to-r to-[#FEFBF6] blur-[20px]"></div>
      <div className="from-primary/50 absolute -right-[100px] -top-[20%] aspect-square w-[500px] rounded-full bg-gradient-to-l to-[#FEFBF6] blur-[20px]"></div>

      <div className="container overflow-visible">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:gap-3">
          <NegativeXAxisAnimation classes={`w-full lg:w-1/2`}>
            <h2
              className="pb-[30px] pt-2.5 text-[40px] font-medium -tracking-[0.64px] text-[#212529] min-[1200px]:text-[64px]"
              style={{ lineHeight: "1.1" }}
            >
              {landing_data?.landing_main_banner_first_title
                ? landing_data?.landing_main_banner_first_title
                : "Perfect Place For Your Education Next Level"}
            </h2>
            <p className="pb-[40px] text-lg text-[#4A5355]">
              {landing_data.landing_main_banner_first_description?.description
                ? landing_data.landing_main_banner_first_description.description
                : "Architect client-centered total linkage for intuitive benefits.restore convergence before real-time partnerships."}
            </p>
            <div className="flex items-center gap-8">
              <Link
                href={"/courses"}
                className="bg-primary shadow-primary/50 flex h-[54px] items-center  justify-center gap-3 rounded-full px-8 py-[15px] text-white shadow-lg"
              >
                <p>View Course </p>
                <MdOutlineArrowRightAlt size={18} />
              </Link>
            </div>
          </NegativeXAxisAnimation>
          <PositiveXAxisAnimation classes={`relative mt-5 w-full lg:w-1/2`}>
            <div className="relative flex w-full lg:justify-end">
              <div className="border-primary absolute left-5 top-5 aspect-[12/16] h-[400px] rounded-bl-lg rounded-br-lg border-x-2 border-b-2 sm:aspect-[12/16] md:h-[600px] lg:left-auto"></div>
              <div className="mr-[20px] aspect-[12/16] h-[400px] overflow-hidden rounded-[20px] md:h-[600px]">
                <CustomImage
                  imageUrl={
                    landing_data?.landing_main_banner_image_url
                      ? landing_data?.landing_main_banner_image_url
                      : "/images/banner-image.png"
                  }
                />
              </div>
            </div>
          </PositiveXAxisAnimation>
        </div>
      </div>
    </section>
  );
}
