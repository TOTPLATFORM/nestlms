import request from "@/lib/request";

export const getAllAdminListsForAdminApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-admin-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};
export const getAdminDashboard = async () => {
  const { data } = await request.get(`/admin/admin-dashboard`);
  return data;
};
export const getAllStudentListsForAdminApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-student-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const createUserForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/create-new-user", value);
  return data;
};

export const updateAllUserStatusForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/status-change-user", value);
  return data;
};

export const getAllWithdrawRequestListsForAdminApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/withdraw-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const changeInstructorWithdrawReqApi = async (value: any) => {
  const { data } = await request.post("/admin/withdraw-status-update", value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getAllSubscriptionListsApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-subscriber-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};
