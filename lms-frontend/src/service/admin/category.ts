import request from "@/lib/request";

export const getAllCategoriesApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-all-category?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const addCategoriesApi = async (value: any) => {
  const { data } = await request.post("/admin/create-category", value);
  return data;
};

export const categoryDeleteApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-category/${id}`);
  return data;
};

export const getCategoryDetailsApi = async (id: any) => {
  const { data } = await request.get(`/admin/get-category-details/${id}`);
  return data;
};

export const updateCategoriesApi = async (value: any) => {
  const { data } = await request.patch("/admin/update-category", value);
  return data;
};

export const getAllActiveCategoriesApi = async () => {
  const { data } = await request.get(`/admin/get-all-active-category`);
  return data;
};

export const getAllSubCategoriesApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-all-sub-category?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const addSubCategoriesApi = async (value: any) => {
  const { data } = await request.post("/admin/create-sub-category", value);
  return data;
};

export const subCategoryDeleteApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-sub-category/${id}`);
  return data;
};

export const getSubCategoryDetailsApi = async (id: any) => {
  const { data } = await request.get(`/admin/get-sub-category-details/${id}`);
  return data;
};

export const updateSubCategoriesApi = async (value: any) => {
  const { data } = await request.patch("/admin/update-sub-category", value);
  return data;
};
