"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkaleton() {
  return (
    <div className="rounded-md border p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
          (item: any) => (
            <Skeleton className="h-8 w-full" key={item} />
          )
        )}
      </div>
    </div>
  );
}
