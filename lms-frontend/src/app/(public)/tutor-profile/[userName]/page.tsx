import TutorProfile from "./tutor-profile";

type PageProps = {
  params: Promise<any>;
  searchParams: Promise<any>;
};
export default async function Page(props: PageProps) {
  const { userName } = await props.params;
  return <TutorProfile userName={userName} />;
}
