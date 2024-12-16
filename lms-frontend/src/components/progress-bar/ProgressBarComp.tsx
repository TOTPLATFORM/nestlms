"use client";
import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function ProgressBarComp() {
  return (
    <ProgressBar
      height="2px"
      color="#2ed573"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
