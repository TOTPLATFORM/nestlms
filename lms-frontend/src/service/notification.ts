import request from "@/lib/request";

export const getNotificationApi = async (page: any, limit: any, seen = 0) => {
  const { data } = await request.get(
    `/user/my-notification-list?limit=${limit}&offset=${page}&seen=${seen}`
  );
  return data;
};
