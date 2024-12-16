import request from "@/lib/request";

export const getAllActiveCategoriesForUserApi = async () => {
  const { data } = await request.get(`/category/get-all-category`);
  return data;
};

export const getUserDetailsApi = async () => {
  const { data } = await request.get(`/user/profile`);
  return data;
};

export const updateUserSettingsApi = async (value: any) => {
  const { data } = await request.post("/user/update-profile", value);
  return data;
};

export const getKycVerificationListsForUserApi = async () => {
  const { data } = await request.get(`/user/kyc-verification-list`);
  return data;
};

export const verifyKycFromUserApi = async (value: any) => {
  const { data } = await request.post("/user/submit-kyc", value);
  return data;
};

export const checkKycVerificationForUserApi = async () => {
  const { data } = await request.get(`/user/check-kyc-validation`);
  return data;
};

export const getCourseListsForInstructorLiveClassApi = async () => {
  const { data } = await request.get(`/instructor/get-course-for-live-classes`);
  return data;
};

export const createLiveClassForInstructorApi = async (value: any) => {
  const { data } = await request.post("/instructor/create-live-class", value);
  return data;
};

export const getLiveClassListsForInstructorApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/instructor/get-live-class?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const deleteLiveClassItemForInstructorApi = async (id: any) => {
  const { data } = await request.delete(`/instructor/delete-live-class/${id}`);
  return data;
};

export const getliveClassDetailsForInstructorApi = async (id: any) => {
  const { data } = await request.get(`/instructor/get-live-class/${id}`);
  return data;
};

export const updateLiveClassForInstructorApi = async (value: any) => {
  const { data } = await request.patch("/instructor/update-live-class", value);
  return data;
};

export const startLiveClassForInstructorApi = async (value: any) => {
  const { data } = await request.post("/instructor/start-live-class", value);
  return data;
};

export const joinLiveClassForStudentApi = async (value: any) => {
  const { data } = await request.post("/student/join-live-class", value);
  return data;
};

export const endLiveClassForInstructorApi = async (value: any) => {
  const { data } = await request.post("/instructor/leave-live-class", value);
  return data;
};
