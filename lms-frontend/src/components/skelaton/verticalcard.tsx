"use client";
import { Check, Clock, Layers, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaHouseUser } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerticalProductLoading({ isFullPadding = true }: any) {
  return (
    <>
      <div className={`overflow-hidden rounded-lg border bg-white px-4 py-3`}>
        <div className="relative ">
          <Link href={`course`}>
            <Skeleton className="max-h-[215px] w-full overflow-hidden rounded-t-lg" />
          </Link>
        </div>
        <div className={`${isFullPadding ? "pt-6" : "p-4"}`}>
          <div className="mb-4 flex items-center gap-x-6 text-xs">
            <div
              className={cn(
                "flex items-center gap-x-2",
                !isFullPadding && "gap-x-1"
              )}
            >
              <FaHouseUser size={isFullPadding ? 16 : 14} />
              <div>
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>

          <div>
            <Skeleton className="h-44 w-full" />
          </div>
          <div
            className={cn(
              "my-4 flex items-center gap-x-4 text-base",
              !isFullPadding && "text-xs"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-x-2",
                !isFullPadding && "gap-x-1"
              )}
            >
              <Layers size={isFullPadding ? 18 : 14} />
              <div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-x-2",
                !isFullPadding && "gap-x-1"
              )}
            >
              <Clock size={isFullPadding ? 18 : 14} />
              <div>
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-x-2",
                !isFullPadding && "gap-x-1"
              )}
            >
              <User size={isFullPadding ? 18 : 14} />
              <div>
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className={cn("flex items-center gap-x-4 text-base")}>
              <div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-x-4 text-lg",
                !isFullPadding && "gap-x-2 text-sm"
              )}
            >
              <Skeleton className="h-4 w-16" />

              <div className="text-primary text-lg">
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between  pt-4">
            <div className={cn("flex items-center gap-x-4 text-base")}>
              <div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-x-4 text-lg",
                !isFullPadding && "gap-x-2 text-sm"
              )}
            >
              <Skeleton className="h-4 w-16" />

              <div className="text-primary text-lg">
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
