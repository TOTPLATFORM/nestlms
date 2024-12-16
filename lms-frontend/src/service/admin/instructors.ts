import request from "@/lib/request";

export const getPendingInstructorApplications = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/user/get-pending-instructor-applications?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const assignAnInstructor = async (value: any) => {
  const { data } = await request.post("/user/assign-an-instructor", value);
  return data;
};
export const instructorDashboardInfo = async () => {
  const { data } = await request.get("/user/instructor-dashboard-info");
  return data;
};

export const getInstructorListsForAdmin = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-instructor-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const instructorEarningsDashboardInfoApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/instructor/instructor-earning-details?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const sendWithdrawRequestForInstructorApi = async (value: any) => {
  const { data } = await request.post("/instructor/withdraw-request", value);
  return data;
};

export const checkAdminAmountForWithdrawRequestApi = async (value: any) => {
  const { data } = await request.post("/instructor/withdraw-admin-fee", value);
  return data;
};
