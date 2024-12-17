"use client";
import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function ProgressBarComp() {
  return (
    <ProgressBar
      height="2px"
      color="#1FAEE7"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
