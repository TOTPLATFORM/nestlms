import React from "react";
import CustomImage from "./CustomImage";

export default function NoItem({ notFoundtext = "No Item Found." }: any) {
  return (
    <div className="my-8 flex w-full flex-col items-center justify-center rounded-[8px] border p-6">
      <div className="h-28">
        <CustomImage imageUrl={`/noItem.gif`} />
      </div>
      <p className="text-lg">{notFoundtext}</p>
    </div>
  );
}
