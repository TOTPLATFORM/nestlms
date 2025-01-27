import React from "react";
import { Suspense } from "react";

import SectionLoader from "@/components/SectionLoader";
import BlogDetailsComp from "./blog-details";

const BlogDetailsPage: React.FC = () => {
  return (
    <Suspense fallback={<SectionLoader />}>
      <BlogDetailsComp />
    </Suspense>
  );
};

export default BlogDetailsPage;
