"use client";
import CustomImage from "@/components/CustomImage";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";

export default function HowItWork({ landing_data }: any) {
  const { t } = useTranslation();
  return (
    <section className="relative bg-white py-28">
      <div className="container overflow-visible">
        <div className="mx-auto max-w-lg  pb-10 text-center">
          <span className="text-primary before:bg-primary after:bg-primary relative pl-[55px] pr-[105px] text-lg font-bold capitalize before:absolute before:left-0 before:top-1/2 before:h-[3px] before:w-[41px] after:absolute after:right-0 after:top-1/2 after:h-[3px] after:w-[90px] min-[1200px]:text-2xl">
            {t("howitwork.header.title")}
          </span>
          <h2 className="mb-2 text-4xl font-bold lg:text-5xl">
            {t("howitwork.header.description")}
          </h2>
        </div>
        <div className="before:bg-primary after:bg-primary relative before:absolute before:left-0 before:top-[95px] before:h-[12px] before:w-[12px] before:-translate-y-[50%] before:rounded-full after:absolute after:right-0 after:top-[95px] after:h-[12px] after:w-[12px] after:-translate-y-[50%] after:rounded-full">
          <div className="relative mt-[50px] grid grid-cols-1 gap-[50px] md:grid-cols-3">
            <NegativeXAxisAnimation classes={`relative text-center`}>
              <hr className="border-primary absolute left-0 right-0 top-[95px] w-full border border-dashed px-[12px] before:z-[2] " />
              <div className="relative mx-auto inline-block rotate-45">
                <div className="outline-primary m-2 aspect-square max-w-[180px] overflow-hidden rounded-[8px] outline-dashed outline-1 outline-offset-4">
                  <div className="h-full w-full -rotate-45 scale-150 overflow-hidden rounded-[6px]">
                    <CustomImage
                      imageUrl={
                        landing_data?.landing_how_it_work_list_first_image_url
                          ? landing_data?.landing_how_it_work_list_first_image_url
                          : "/images/how-this-works.png"
                      }
                    />
                  </div>
                </div>
                <p className="bg-primary outline-primary absolute -top-[15px] right-[80px] flex h-[42px] w-[42px] -rotate-45 items-center justify-center rounded-full text-xl font-bold text-white outline-dashed outline-1 outline-offset-4 ">
                  01
                </p>
              </div>
              <div className="mt-10">
                <h3 className="pb-2 text-xl font-bold text-black">
                  {t("howitwork.firstcard.title")}
                </h3>
                <p className="text-[#4A5355]">
                  {t("howitwork.firstcard.description")}
                </p>
              </div>
            </NegativeXAxisAnimation>
            <div className="relative text-center">
              <hr className="border-primary absolute left-0 right-0 top-[95px] w-full border border-dashed px-[12px] before:z-[2] " />
              <div className="relative mx-auto inline-block rotate-45">
                <div className="outline-primary m-2 aspect-square max-w-[180px] overflow-hidden rounded-[8px] outline-dashed outline-1 outline-offset-4">
                  <div className="h-full w-full -rotate-45 scale-150 overflow-hidden rounded-[6px]">
                    <CustomImage
                      imageUrl={
                        landing_data?.landing_how_it_work_list_second_image_url
                          ? landing_data?.landing_how_it_work_list_second_image_url
                          : "/images/how-this-works.png"
                      }
                    />
                  </div>
                </div>
                <p className="bg-primary outline-primary absolute -top-[15px] right-[80px] flex h-[42px] w-[42px] -rotate-45 items-center justify-center rounded-full text-xl font-bold text-white outline-dashed outline-1 outline-offset-4 ">
                  02
                </p>
              </div>
              <div className="mt-10">
                <h3 className="pb-2 text-xl font-bold text-black">
                  {t("howitwork.secondcard.title")}
                </h3>
                <p className="text-[#4A5355]">
                  {t("howitwork.secondcard.description")}
                </p>
              </div>
            </div>
            <PositiveXAxisAnimation classes={`relative text-center`}>
              <hr className="border-primary absolute left-0 right-0 top-[95px] w-full border border-dashed px-[12px] before:z-[2] " />
              <div className="relative mx-auto inline-block rotate-45">
                <div className="outline-primary m-2 aspect-square max-w-[180px] overflow-hidden rounded-[8px] outline-dashed outline-1 outline-offset-4">
                  <div className="h-full w-full -rotate-45 scale-150 overflow-hidden rounded-[6px]">
                    <CustomImage
                      imageUrl={
                        landing_data?.landing_how_it_work_list_third_image_url
                          ? landing_data?.landing_how_it_work_list_third_image_url
                          : "/images/how-this-works.png"
                      }
                    />
                  </div>
                </div>
                <p className="bg-primary outline-primary absolute -top-[15px] right-[80px] flex h-[42px] w-[42px] -rotate-45 items-center justify-center rounded-full text-xl font-bold text-white outline-dashed outline-1 outline-offset-4 ">
                  03
                </p>
              </div>
              <div className="mt-10">
                <h3 className="pb-2 text-xl font-bold text-black">
                  {t("howitwork.thirdcard.title")}
                </h3>
                <p className="text-[#4A5355]">
                  {t("howitwork.thirdcard.description")}
                </p>
              </div>
            </PositiveXAxisAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
