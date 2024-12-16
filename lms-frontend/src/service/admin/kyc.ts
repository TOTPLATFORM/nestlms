import request from "@/lib/request";
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";

export const getAllkycListsApi = async (page: any, limit: any, search: any) => {
  const { data } = await request.get(
    `/admin/kyc-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const addKycApi = async (value: any) => {
  const { data } = await request.post("/admin/add-new-kyc", value);
  return data;
};

export const kycDeleteApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-kyc-${id}`);
  return data;
};

export const getKycDetailsApi = async (id: any) => {
  const { data } = await request.get(`/admin/kyc-details-${id}`);
  return data;
};

export const updateKycApi = async (value: any, id: any) => {
  const { data } = await request.put(`/admin/update-kyc-${id}`, value);
  return data;
};

export const getAllVerifykycListsApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-user-kyc-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const verifyKycUserForAdminApi = async (value: AnyAsyncThunk) => {
  const { data } = await request.post(`/admin/verify-user-kyc`, value);
  return data;
};
