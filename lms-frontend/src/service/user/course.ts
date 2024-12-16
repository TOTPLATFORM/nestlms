import request from "@/lib/request";

export const getCourseListsForInstructorApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/course/get-instructor-courses?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const getEnrolledCourses = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/course/get-my-enrolled-courses?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const getAllActiveCategoriesForUserApi = async () => {
  const { data } = await request.get(`/category/get-all-category`);
  return data;
};

export const addCourseApi = async (value: any) => {
  const { data } = await request.post(
    "/course/create-instructor-course",
    value
  );
  return data;
};
export const getInstructroStudentsApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/course/get-instructor-students??limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};
export const courseDeleteApi = async (id: any) => {
  const { data } = await request.delete(
    `/course/delete-instructor-course/${id}`
  );
  return data;
};

export const getCourseDetailsApi = async (id: any) => {
  const { data } = await request.get(
    `/course/get-instructor-course-details/${id}`
  );
  return data;
};

export const updateCourseApi = async (value: any) => {
  const { data } = await request.patch("/course/edit-instructor-course", value);
  return data;
};

export const addEditCourseApi = async (value: any) => {
  const { data } = await request.post(
    "/course/create-edit-instructor-course",
    value
  );
  return data;
};

export const getSectionByIdApi = async (id: any) => {
  const { data } = await request.get(
    `/course/get-course-details-sections/${id}`
  );
  return data;
};

export const addSectionApi = async (value: any) => {
  const { data } = await request.post("/course/create-section", value);
  return data;
};

export const updateSectionApi = async (value: any) => {
  const { data } = await request.patch("/course/edit-section", value);
  return data;
};

export const sectionDeleteApi = async (id: any) => {
  const { data } = await request.delete(
    `/course/delete-instructor-course-section/${id}`
  );
  return data;
};

export const getSectionDetailsApi = async (id: any) => {
  const { data } = await request.get(
    `/course/get-course-details-sections/${id}`
  );
  return data;
};

export const addLessonApi = async (value: any) => {
  const { data } = await request.post("/course/create-lesson", value);
  return data;
};

export const getLessonsBySectionIdApi = async (id: any) => {
  const { data } = await request.get(`/course/get-lesson-by-section-id/${id}`);
  return data;
};

export const updateLessonApi = async (value: any) => {
  const { data } = await request.patch("/course/edit-lesson", value);
  return data;
};

export const lessonDeleteApi = async (id: any) => {
  const { data } = await request.delete(`/course/delete-lesson/${id}`);
  return data;
};
export const getCourseDetailsPublic = async (slug: string) => {
  const { data } = await request.get(`/course/course-details/${slug}`);
  return data;
};
export const checkCourseEnrollment = async (course_id: number) => {
  const { data } = await request.get(
    `/course/check-course-enrollment/${course_id}`
  );
  return data;
};

export const getQuizByCourseIdApi = async (id: any) => {
  const { data } = await request.get(`/instructor/quiz-list-${id}`);
  return data;
};

export const addQuizApi = async (value: any) => {
  const { data } = await request.post("/instructor/create-quiz", value);
  return data;
};

export const quizDeleteApi = async (id: any) => {
  const { data } = await request.delete(
    `/instructor/delete-quiz-details-${id}`
  );
  return data;
};

export const updateQuizApi = async (quizDetails: any) => {
  const { data } = await request.put(
    `/instructor/update-quiz-${quizDetails.id}`,
    quizDetails.data
  );
  return data;
};

export const getQuestionsByQuizIdApi = async (id: any) => {
  const { data } = await request.get(`/instructor/quiz-question-list-${id}`);
  return data;
};

export const addQuestionApi = async (value: any) => {
  const { data } = await request.post(
    "/instructor/create-quiz-question",
    value
  );
  return data;
};

export const questionDeleteApi = async (id: any) => {
  const { data } = await request.delete(
    `/instructor/delete-quiz-question-${id}`
  );
  return data;
};

export const updateQuestionApi = async (questionDetails: any) => {
  const { data } = await request.put(
    `/instructor/update-question-${questionDetails.id}`,
    questionDetails.data
  );
  return data;
};

export const getAnswersByQuestionIdApi = async (id: any) => {
  const { data } = await request.get(
    `/instructor/quiz-question-answer-list-${id}`
  );
  return data;
};

export const addAnswerApi = async (value: any) => {
  const { data } = await request.post(
    "/instructor/create-question-answer",
    value
  );
  return data;
};

export const answerDeleteApi = async (id: any) => {
  const { data } = await request.delete(`/instructor/delete-answer-${id}`);
  return data;
};

export const updateAnswerApi = async (answerDetails: any) => {
  const { data } = await request.put(
    `/instructor/update-answer-${answerDetails.id}`,
    answerDetails.data
  );
  return data;
};

export const getEnrolledCourseDetailsApi = async (id: any) => {
  const { data } = await request.get(`/course/enrolled-course-details-${id}`);
  return data;
};

export const addUserReviewApi = async (value: any) => {
  const { data } = await request.post("/review/submit-review", value);
  return data;
};

export const getUserReviewDetailsByCourseIdApi = async (id: any) => {
  const { data } = await request.get(`/course/get-course-review-data-${id}`);
  return data;
};

export const getUserQuizDetailsByQuizIdApi = async (id: any) => {
  const { data } = await request.get(`/user/quiz-details-${id}`);
  return data;
};

export const startQuizByQuizIdApi = async (id: any, queryStr: any) => {
  const { data } = await request.get(`/user/start-quiz-${id}?${queryStr}`);
  return data;
};

export const submitQuizAnswerApi = async (value: any) => {
  const { data } = await request.post("/user/save-quiz-question-ans", value);
  return data;
};

export const showQuizResultByQuizIdApi = async (id: any) => {
  const { data } = await request.get(`/user/quiz-result-details-${id}`);
  return data;
};

export const submitLessonCheckedApi = async (value: any) => {
  const { data } = await request.post("/course/check-lession", value);
  return data;
};

export const generateCertificateByCourseIdApi = async (id: any) => {
  const { data } = await request.get(`/certificate/generate-certificate-${id}`);
  return data;
};

export const getMyWishlistCourseListsApi = async (page: any, limit: any) => {
  const { data } = await request.get(
    `/user/my-wishlist?limit=${limit}&offset=${page}`
  );
  return data;
};
