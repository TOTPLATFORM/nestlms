import React from "react";
import { Suspense } from "react";

import SectionLoader from "@/components/SectionLoader";
import ResetPasswordComp from "./reset-password";

export default function ResetPasswordCompPage() {
  return (
    <Suspense fallback={<SectionLoader />}>
      <ResetPasswordComp />
    </Suspense>
  );
}
