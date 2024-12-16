import request from "@/lib/request";

export const getAllLogLists = async () => {
  const { data } = await request.get(`/logger/get-log-file-names`);
  return data;
};

export const getAllLogs = async (
  page: any,
  limit: any,
  search: any,
  log_name: any
) => {
  const { data } = await request.get(
    `/logger/details?file_name=${log_name}&limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};



export const logDeleteApi = async (file_name: any) => {
  const { data } = await request.delete(
    `/logger/delete?file_name=${file_name}`
  );
  return data;
};

