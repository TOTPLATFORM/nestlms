"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import AnimateHeight from "react-animate-height";
import NegativeXAxisAnimation from "@/components/animation/NegativeXAxisAnimation";
import PositiveXAxisAnimation from "@/components/animation/PositiveXAxisAnimation";
import CustomImage from "@/components/CustomImage";
export default function FaqSection({ faq_list }: any) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-white pb-28 lg:py-28">
      <div className="container overflow-visible">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <NegativeXAxisAnimation classes={`relative  lg:mr-10`}>
            <img
              src="/images/shape.png"
              alt=""
              className="absolute -top-[25px] right-0 hidden lg:block"
            />
            <div className="relative">
              <div className="relative mb-10 lg:my-10">
                <div className="bg-primary/30 absolute bottom-0 left-0 hidden h-[400px] w-full rounded-[8px] lg:block lg:w-[250px]"></div>

                <div className="w-full overflow-hidden rounded-[8px] lg:-translate-y-[30px] lg:translate-x-[30px] ">
                  <CustomImage imageUrl="/images/learning-img.png" />
                </div>
              </div>
              <div className="bg-primary -bottom-[80px] right-0 z-[3] max-w-[410px] rounded-[8px] px-[25px] py-10 shadow-md lg:absolute">
                <p className="text-[22px] font-bold text-white">
                  Contact Us For a{" "}
                  <span className="text-white">Free Learning</span> Consulting
                  Evaluation
                </p>
              </div>
            </div>
          </NegativeXAxisAnimation>
          <PositiveXAxisAnimation>
            <div>
              <h4 className="text-primary before:bg-primary relative pl-[160px] text-lg font-bold capitalize before:absolute before:left-0 before:top-1/2 before:h-[3px] before:w-[140px] min-[1200px]:text-2xl">
                FAQ
              </h4>
              <h2
                className="pb-[30px] pt-2.5 text-4xl  font-bold -tracking-[0.64px] text-[#212529] lg:text-[40px] lg:min-[1200px]:text-5xl"
                style={{ lineHeight: "1.1" }}
              >
                Frequently Asked Questions
              </h2>
            </div>
            <div>
              {faq_list?.map((faq: any, index: number) => (
                <div
                  key={index}
                  className="mb-4 rounded-[8px] bg-white shadow-lg"
                >
                  <button
                    className="flex w-full items-center justify-between px-5 py-4"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>
                      {index + 1}. {faq?.question}
                    </span>
                    <div>
                      {openIndex === index ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </div>
                  </button>
                  <AnimateHeight
                    animateOpacity={true}
                    duration={500}
                    height={openIndex === index ? "auto" : 0}
                  >
                    <div className="px-5 py-4">
                      <p>{faq?.answer}</p>
                    </div>
                  </AnimateHeight>
                </div>
              ))}
            </div>
          </PositiveXAxisAnimation>
        </div>
      </div>
    </section>
  );
}
