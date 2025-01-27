import CourseLecture from "./CourseLecture";

export default async function Page({ params }: { params: Promise<{ id: any }> }) {
  const param=await params;
  return <CourseLecture id={param.id} />;
}
