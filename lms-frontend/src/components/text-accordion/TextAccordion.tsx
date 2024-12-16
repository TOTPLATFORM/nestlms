"use client";
import React, { useState } from "react";

export default function TextAccordion({ text, limit = 150 }: any) {
  const [isTextFull, setIsTextFull] = useState<boolean>(false);
  if (text.length < limit) {
    return <p>{text}</p>;
  }
  if (!isTextFull)
    return (
      <p className="cursor-pointer" onClick={() => setIsTextFull(true)}>
        {text.substring(0, limit) + "..."}
      </p>
    );
  return (
    <p className="cursor-pointer" onClick={() => setIsTextFull(false)}>
      {text}
    </p>
  );
}
