import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Layers,
  MoveUpRight,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaHouseUser } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { GoArrowUpRight } from "react-icons/go";

export default function HorizontalBlog() {
  return (
    <div className="flex items-center gap-[20px] overflow-hidden rounded-lg bg-white p-6">
      <div>
        <div>
          <h4 className="relative pl-[40px] text-sm font-bold capitalize text-primary before:absolute before:left-0 before:top-1/2 before:h-[2px] before:w-[32px] before:bg-primary">
            Technology
          </h4>
        </div>
        <div>
          <Link href={"/"}>
            <h2 className="text-lg font-bold hover:text-primary">
              Advance Beginner's Goal & Managing Online Course
            </h2>
          </Link>
        </div>
        <div className="my-4 flex items-center gap-x-4 text-sm">
          <div className="flex items-center gap-x-2">
            <CalendarDays size={18} />
            <p> Feb 18, 20223</p>
          </div>
        </div>
      </div>
      <div>
        <Link
          href={"/"}
          className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-primary/30 text-primary"
        >
          <GoArrowUpRight size={20} />
        </Link>
      </div>
    </div>
  );
}
