import request from "@/lib/request";

export const getInstructorProfile = async (userName: string) => {
  const { data } = await request.get(
    `/public-api/instructor-profile-details-${userName}`
  );
  return data;
};
