"use client";

import ClientWrapper from "./EditCourseClient";

interface Props {
  params: { id: string };
}

export default function Wrapper({ params }: Props) {
  return <ClientWrapper params={params} />;
}
