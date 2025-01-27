import React from "react";
import { Suspense } from "react";

import SectionLoader from "@/components/SectionLoader";
import VideoCallComp from "./video-call";

const VideoCallPage = () => {
  return (
    <Suspense fallback={<SectionLoader />}>
      <VideoCallComp />
    </Suspense>
  );
};

export default VideoCallPage;
