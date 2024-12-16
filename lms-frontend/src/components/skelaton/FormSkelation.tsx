"use client";
import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function FormSkelation() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((item: any) => (
          <div key={item}>
            <Skeleton className="mb-2 h-4 w-1/3" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-4 h-8 w-[160px]" />
    </div>
  );
}
