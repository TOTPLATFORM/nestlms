import request from "@/lib/request";

export const getAllFaqListsApi = async (page: any, limit: any, search: any) => {
  const { data } = await request.get(
    `/admin/get-faq-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const addFaqApi = async (value: any) => {
  const { data } = await request.post("/admin/add-new-faq", value);
  return data;
};

export const faqDeleteApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-faq-${id}`);
  return data;
};

export const getFaqDetailsApi = async (id: any) => {
  const { data } = await request.get(`/admin/get-faq-details-${id}`);
  return data;
};

export const updateFaqApi = async (value: any, id: any) => {
  const { data } = await request.put(`/admin/update-faq-${id}`, value);
  return data;
};
