import React from "react";
import { Suspense } from "react";

import SectionLoader from "@/components/SectionLoader";

import VerifyEmailComp from "./verify-email";


export default function VerifyEmail() {

  return (
    <Suspense fallback={<SectionLoader />}>
      <VerifyEmailComp/>
    </Suspense>
  );
}
