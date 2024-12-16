import request from "@/lib/request";

export const addToCart = async (value: any) => {
  const { data } = await request.post(`/enroll/add-to-cart`, value);
  return data;
};
export const removeFromCart = async (value: any) => {
  const { data } = await request.delete(`/enroll/remove-from-cart/${value}`);
  return data;
};

export const myCartDetails = async () => {
  const { data } = await request.get(`/enroll/my-cart-details`);
  return data;
};
export const validateCoupon = async (value: any) => {
  const { data } = await request.post(`/enroll/validate-coupon`, value);
  return data;
};
