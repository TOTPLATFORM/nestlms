import request from "@/lib/request";
import requestFetch from "@/lib/request-fetch";

export const commonSettingsApi = async () => {
  const { data } = await request.get(`/public-api/common-settings`);
  return data;
};
export const getTermsConditionData = async () => {
  const { data } = await request.get(`/public-api/get-terms-condition-data`);
  return data;
};
export const getblogList = async (page: any, limit: any, queryParams: any) => {
  const { data } = await requestFetch(
    `/public/blog-list?limit=${limit}&offset=${page}${
      queryParams ? "&" + queryParams : ""
    }`
  );
  return data;
};
export const getblogDetails = async (slug: string) => {
  const { data } = await requestFetch(`/public/blog-details-${slug}`);
  return data;
};

export const getPrivacyPolicyData = async () => {
  const { data } = await requestFetch(`/public-api/get-privacy-policy-data`);
  return data;
};
export const getInstructors = async () => {
  const { data } = await request.get(`/public-api/get-instructors`);
  return data;
};
export const landingPageData = async () => {
  const { data } = await requestFetch(`/public-api/landing-page-data`);
  return data;
};

export const addSubscribeApi = async (value: any) => {
  const { data } = await request.post("/user/subscribe", value);
  return data;
};

export const getblogCategoryListsForPublic = async () => {
  const { data } = await request.get(`/public/get-category-list`);
  return data;
};

export const sendCommentForUserApi = async (value: any) => {
  const { data } = await request.post("/public/add-blog-comment", value);
  return data;
};

export const getblogCommentListsForPublic = async (id: any) => {
  const { data } = await request.get(`/public/get-blog-comments/${id}`);
  return data;
};
