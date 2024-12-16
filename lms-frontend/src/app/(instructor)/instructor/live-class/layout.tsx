"use client";

import SectionLoader from "@/components/SectionLoader";
import { IRootState } from "@/store";
import { useRouter } from "next-nprogress-bar";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function PanelLayout({ children }: any) {
  const { agora } =
    useSelector((state: IRootState) => state?.common?.data) || {};

  const router = useRouter();

  useEffect(() => {
    if (agora?.agora_status == "0") {
      router.push("/instructor");
    }
  }, [agora?.agora_status]);

  if (!agora?.agora_status || agora?.agora_status == "0")
    return (
      <>
        <SectionLoader />
      </>
    );

  return <>{children}</>;
}
