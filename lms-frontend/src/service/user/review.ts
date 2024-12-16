import request from "@/lib/request";

export const InstructorReviewListWithCourseId = async (
  page: any,
  limit: any,
  search: any,
  course_id: any
) => {
  const { data } = await request.get(
    `/review/course-review-list-${course_id}?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};
