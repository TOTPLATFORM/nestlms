import CustomImage from "@/components/CustomImage";
import { CalendarDays, Clock, Layers, Star, User } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { FaHouseUser } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { MdOutlineArrowRightAlt } from "react-icons/md";

export default function VerticalBlog({ details }: any) {
  return (
    <div className="h-full overflow-hidden rounded-lg bg-white">
      <div className="relative max-h-[200px]">
        <Link href={"/blogs/details/" + details?.slug}>
          <div className="h-[200px] max-h-[200px] w-full overflow-hidden rounded-t-lg">
            <CustomImage
              imageUrl={
                details.thumbnail_link
                  ? details.thumbnail_link
                  : "/images/jess-bailey-q10VITrVYUM-unsplash.jpg"
              }
            />
          </div>
        </Link>
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center gap-x-6 text-xs">
          <div className="text-primary flex items-center gap-x-2">
            <CalendarDays size={16} />
            <p>{moment(details?.created_at).format("MMM DD, YYYY")}</p>
          </div>
        </div>
        <div>
          <Link href={"/blogs/details/" + details?.slug}>
            <h2 className="hover:text-primary text-[22px] font-bold">
              {details?.title.slice(0, 50)}...
            </h2>
          </Link>
        </div>
        <div className="my-4 flex items-center gap-x-4">
          <p className="text-[#4A5355]">{details?.description.slice(0, 50)}</p>
        </div>
        <div>
          <Link
            href={"/blogs/details/" + details?.slug}
            className="hover:text-primary flex items-center gap-x-1 text-[#4A5355]"
          >
            <p className="font-bold capitalize">Details</p>
            <MdOutlineArrowRightAlt size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
