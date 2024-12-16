"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LessonSkelaton() {
  return (
    <div className="rounded-md border p-4">
      <div>
        {[1].map((item: any) => (
          <div
            className="mb-4 rounded-[8px] border bg-white px-[20px] py-[30px]"
            key={item}
          >
            <div className={`flex items-center  justify-between`}>
              <div className="flex items-center gap-x-3">
                <div className="rounded-full bg-[#f1f1f1] p-2">
                  <Skeleton className="h-[24px] w-[24px] rounded-full" />
                </div>
                <div>
                  <Skeleton className="h-[10px] w-[240px]" />
                  <Skeleton className="mt-2 h-[8px] w-[80px]" />
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <Skeleton className="h-[30px] w-[30px] rounded-full" />

                <Skeleton className="h-[30px] w-[30px] rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
