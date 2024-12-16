import { IRootState } from "@/store";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CustomImage from "@/components/CustomImage";

export default function InstructorSection({ instructor_list }: any) {
  return (
    <section className=" overflow-hidden">
      <div className="container relative overflow-visible">
        <div className="bg-primary absolute -right-1/2 left-0 -z-10 h-full rounded-bl-[50px] rounded-tl-[50px]"></div>

        <div className="px-4  py-28 md:px-8">
          <div className="grid grid-cols-1 pb-6 md:grid-cols-5">
            <div className="col-span-3">
              <h4 className="relative text-lg font-bold capitalize text-white before:bg-white min-[1200px]:text-2xl">
                Instructor's
              </h4>
              <div>
                <h2 className="py-2 text-4xl font-bold text-white lg:text-5xl">
                  Our Expert <span className="text-white"> Instructors</span>{" "}
                </h2>
              </div>
            </div>
            <div className="col-span-2 flex items-center md:justify-end">
              <Link className="text-white" href={"/tutors"}>
                View All
              </Link>
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="pt-10">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {instructor_list.map((item: any, index: any) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 xl:basis-1/3"
                  >
                    <Link href={"/tutor-profile/" + item?.user_name} key={item}>
                      <div className="hover:border-primary relative flex flex-col items-center rounded-[8px] border-b-[6px] border-white bg-white px-[30px] py-10 shadow-md">
                        <div>
                          <div className="h-[215px] w-[215px] overflow-hidden rounded-full">
                            <CustomImage
                              imageUrl={
                                item.photo || "/images/profile-pic.jpeg"
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="hover:text-primary mt-5 overflow-hidden text-[22px] font-bold leading-[1.3]">
                            <span style={{ whiteSpace: "nowrap" }}>
                              {item?.first_name}{" "}
                              {item?.last_name ? item?.last_name : " "}
                            </span>
                          </h3>
                        </div>
                        <p className="pt-[10px] text-sm">{item?.email}</p>
                        <div className="bg-primary absolute right-[25px] top-[25px] flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[12px]">
                          <Plus size={30} color="#fff" />
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-primary left-0 h-12 w-12 md:-left-[25px]" />
              <CarouselNext className="text-primary right-0 h-12 w-12 md:-right-[25px]" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
