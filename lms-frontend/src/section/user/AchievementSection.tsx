"use client";
import Link from "next/link";
import React from "react";
import { FaSearch, FaTrophy } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { motion } from "framer-motion";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveYAxisAnimation from "@/components/animation/PositiveYAxisAnimation";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import CustomImage from "@/components/CustomImage";
import { useTranslation } from "@/hooks/useTranslation";

export default function AchievementSection({ landing_data }: any) {
  const { t } = useTranslation();
  return (
    <section className="relative -mt-14 pb-28">
      <div className="container overflow-visible text-gray-600">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <NegativeXAxisAnimation
            classes={`flex w-full items-center gap-x-3 rounded-xl bg-white px-3 py-4 custom-shadow lg:px-6 lg:py-7`}
          >
            <div className="bg-primary/10 flex h-[56px] w-[56px] min-w-[56px] items-center justify-center rounded lg:h-[72px] lg:w-[72px] lg:min-w-[72px]">
              <FaSearch size={28} />
            </div>
            <div>
              <h2 className="mb-3 text-lg font-bold 2xl:text-2xl">
                {t("achievement.description.track")}
              </h2>
            </div>
          </NegativeXAxisAnimation>

          <PositiveYAxisAnimation
            classes={`flex w-full items-center gap-x-3 rounded-xl bg-white px-3 py-4 custom-shadow lg:px-6 lg:py-7`}
          >
            <div className="bg-primary/10 flex h-[56px] w-[56px] min-w-[56px] items-center justify-center rounded lg:h-[72px] lg:w-[72px] lg:min-w-[72px]">
              <FaBookOpenReader size={28} />
            </div>
            <div>
              <h2 className="mb-3 text-lg font-bold 2xl:text-2xl">
                {t("achievement.description.explore")}
              </h2>
            </div>
          </PositiveYAxisAnimation>

          <PositiveXAxisAnimation
            classes={`flex w-full items-center gap-x-3 rounded-xl bg-white px-3 py-4 custom-shadow lg:px-6 lg:py-7`}
          >
            <div className="bg-primary/10 flex h-[56px] w-[56px] min-w-[56px] items-center justify-center rounded lg:h-[72px] lg:w-[72px] lg:min-w-[72px]">
              <FaTrophy size={28} />
            </div>
            <div>
              <h2 className="mb-3 text-lg font-bold 2xl:text-2xl">
                {t("achievement.description.celebrate")}
              </h2>
            </div>
          </PositiveXAxisAnimation>
        </div>
      </div>
    </section>
  );
}
