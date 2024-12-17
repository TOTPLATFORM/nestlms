"use client";
import CustomImage from "@/components/CustomImage";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { FaBookReader } from "react-icons/fa";

export default function WhyChooseUs({ landing_data }: any) {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto gap-12 overflow-hidden px-4 py-28 text-gray-600 md:px-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NegativeXAxisAnimation>
          <div>
            <h4 className="text-primary before:bg-primary relative text-lg font-bold capitalize before:absolute min-[1200px]:text-2xl">
              {t("whychooseus.header.title")}
            </h4>
            <h2 className="py-2 text-4xl font-bold lg:text-5xl">
              {t("whychooseus.header.description")}
            </h2>
          </div>
          <div className="mb-5 mt-6 p-2 lg:p-10">
            <div className="relative flex w-full justify-start">
              <div className="border-primary absolute -left-3 top-5 aspect-[11/16] h-[400px] rounded-bl-lg rounded-br-lg border-x-2 border-b-2 sm:-left-5 sm:aspect-[12/16] md:h-[500px]"></div>
              <div className="mr-[20px] aspect-[12/16] h-[400px] overflow-hidden rounded-[20px] md:h-[500px]">
                <CustomImage
                  imageUrl={
                    landing_data?.landing_choose_us_first_image_url ||
                    "/images/laptop-girl.png"
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
                {t("whychooseus.card.title")}
              </h2>
              <p className="text-sm">{t("whychooseus.card.description")} </p>
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
                {t("whychooseus.card.title")}
              </h2>
              <p className="text-sm">{t("whychooseus.card.description")} </p>
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
                {t("whychooseus.card.title")}
              </h2>
              <p className="text-sm">{t("whychooseus.card.description")} </p>
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
                {t("whychooseus.card.title")}
              </h2>
              <p className="text-sm">{t("whychooseus.card.description")} </p>
            </div>
          </div>
        </PositiveXAxisAnimation>
      </div>
    </section>
  );
}
