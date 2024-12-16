import request from "@/lib/request";

export const getAllCouponListsApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-coupon-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const addCouponApi = async (value: any) => {
  const { data } = await request.post("/admin/add-new-coupon", value);
  return data;
};

export const couponDeleteApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-coupon-${id}`);
  return data;
};

export const getCouponDetailsApi = async (id: any) => {
  const { data } = await request.get(`/admin/get-coupon-details-${id}`);
  return data;
};

export const updateCouponApi = async (value: any, id: any) => {
  const { data } = await request.put(`/admin/update-coupon-${id}`, value);
  return data;
};
