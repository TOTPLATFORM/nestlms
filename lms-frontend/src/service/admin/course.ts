import request from "@/lib/request";

export const getCourseListsForAdminApi = async (
  page: any,
  limit: any,
  search: any,
  type: any
) => {
  let query = `limit=${limit}&offset=${page}&search=${search}`;
  if (type) {
    query += `&type=${type}`;
  }
  const { data } = await request.get(`/admin/course-list?${query}`);
  return data;
};

export const getAllActiveCategoriesForAdminApi = async () => {
  const { data } = await request.get(`/category/get-all-category`);
  return data;
};

export const getAllInstructorForAdminApi = async () => {
  const { data } = await request.get(
    `/admin/get-instructor-list-no-pagination`
  );
  return data;
};

export const courseDeleteForAdminApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-course/${id}`);
  return data;
};

export const getCourseDetailsForAdminApi = async (id: any) => {
  const { data } = await request.get(`/admin/course-details/${id}`);
  return data;
};

export const addEditCourseForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/create-edit-course", value);
  return data;
};

export const getSectionForAdminByIdApi = async (id: any) => {
  const { data } = await request.get(
    `/admin/get-course-details-sections/${id}`
  );
  return data;
};

export const addSectionForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/create-section", value);
  return data;
};

export const updateSectionForAdminApi = async (value: any) => {
  const { data } = await request.patch("/admin/edit-section", value);
  return data;
};

export const sectionDeleteForAdminApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-course-section/${id}`);
  return data;
};

export const getSectionDetailsApi = async (id: any) => {
  const { data } = await request.get(
    `/course/get-course-details-sections/${id}`
  );
  return data;
};

export const addLessonForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/create-lesson", value);
  return data;
};

export const getLessonsBySectionForAdminIdApi = async (id: any) => {
  const { data } = await request.get(`/admin/get-lesson-by-section-id/${id}`);
  return data;
};

export const updateLessonForAdminApi = async (value: any) => {
  const { data } = await request.patch("/admin/edit-lesson", value);
  return data;
};

export const lessonDeleteForAdminApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-lesson/${id}`);
  return data;
};

export const changePendingCourseStatusForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/change-course-status", value);
  return data;
};

export const getCourseEnrollmentListsForReportsApi = async (
  page: any,
  limit: any,
  search: any
) => {
  let query = `limit=${limit}&offset=${page}&search=${search}`;

  const { data } = await request.get(`/admin/course-report?${query}`);
  return data;
};

export const getTransactionListsForReportsApi = async (
  page: any,
  limit: any,
  search: any
) => {
  let query = `limit=${limit}&offset=${page}&search=${search}`;

  const { data } = await request.get(
    `/admin/course-transaction-report?${query}`
  );
  return data;
};

export const getAllInstructorWalletListsForAdminApi = async (
  page: any,
  limit: any,
  search: any
) => {
  let query = `limit=${limit}&offset=${page}&search=${search}`;

  const { data } = await request.get(`/admin/instructor-wallet-list?${query}`);
  return data;
};
