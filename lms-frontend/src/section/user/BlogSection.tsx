import React from "react";
import VerticalBlog from "../blog/VerticalBlog";
import HorizontalBlog from "../blog/HorizontalBlog";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function BlogSection({ blogs }: any) {
  return (
    <section className="overflow-hidden">
      <div className="container relative overflow-visible">
        <div className="bg-primary absolute -left-1/2 right-0 -z-10 h-full rounded-br-[50px] rounded-tr-[50px]"></div>
        <div className="px-4 py-28 md:px-8">
          <div className="grid grid-cols-1 pb-10 md:grid-cols-5">
            <div className="col-span-3">
              <h4 className="mb-2.5 text-lg   font-bold capitalize text-white before:absolute before:left-0 before:top-1/2 before:h-[3px] before:w-[140px] min-[1200px]:text-2xl">
                Blog
              </h4>
              <h2 className="mb-2.5 text-5xl font-bold text-white">
                Latest from the Blog
              </h2>
            </div>
            <div className="col-span-2 flex items-center md:justify-end">
              <Link className="text-white" href={"/blogs"}>
                View All
              </Link>
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {blogs.map((blog: any, index: any) => (
                <CarouselItem key={index} className="md:basis-1/2 xl:basis-1/3">
                  <VerticalBlog key={blog.id} details={blog} />
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
