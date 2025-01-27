import React from "react";
import { Suspense } from "react";

import SectionLoader from "@/components/SectionLoader";
import CourseCategorySection from "@/section/user/courseCategorySection/CourseCategorySection";

export default function page() {
  return (
    <Suspense fallback={<SectionLoader />}>
      <div>
        <CourseCategorySection />
      </div>
    </Suspense>
  );
}
