import Link from "next/link";
import React from "react";
import { MdOutlineArrowBack } from "react-icons/md";
export default function BackButton({ title, slug }: any) {
  return (
    <div>
      <Link
        href={`${slug}`}
        className="text-muted-foreground mb-3 flex items-center gap-x-1 text-sm"
      >
        <MdOutlineArrowBack />
        <p>{title}</p>
      </Link>
    </div>
  );
}
