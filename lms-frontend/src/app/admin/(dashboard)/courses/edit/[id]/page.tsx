import EditCourseComp from "./EditCoursesComp";

export default async function EditCourse(props: {
  params: Promise<{ id: any }>;
}) {
  const params = (await props.params) || {};
  return <EditCourseComp id={params.id} />;
}
