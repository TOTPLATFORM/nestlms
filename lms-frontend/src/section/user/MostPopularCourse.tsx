"use client";
import React from "react";
import VerticalProduct from "../product/VerticalProduct";
import HorizontalProduct from "../product/HorizontalProduct";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function MostPopularCourse({ courses }: any) {
  return (
    <section className="mt-0 overflow-hidden lg:mt-28">
      <div className="container relative mx-auto overflow-visible ">
        <div className="bg-primary absolute -left-1/2 right-0 -z-10 h-full rounded-br-[50px] rounded-tr-[50px]"></div>
        <div className="px-4 py-28 md:px-8">
          <div className="mx-auto max-w-3xl  pb-10 text-center">
            <span className="relative pl-[55px] pr-[105px] text-lg font-bold capitalize text-white before:absolute before:left-0 before:top-1/2 before:h-[3px] before:w-[41px] before:bg-white after:absolute after:right-0 after:top-1/2 after:h-[3px] after:w-[90px] after:bg-white min-[1200px]:text-2xl">
              Courses
            </span>
            <h2 className="mb-2 text-4xl font-bold text-white lg:text-5xl">
              Most Popular Course
            </h2>
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {courses.map((course: any, index: any) => (
                <CarouselItem key={index} className="md:basis-1/2 xl:basis-1/3">
                  <VerticalProduct course={course} isHoverCardShow={false} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-primary left-0 h-12 w-12 md:-left-[25px]" />
            <CarouselNext className="text-primary right-0 h-12 w-12 md:-right-[25px]" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
