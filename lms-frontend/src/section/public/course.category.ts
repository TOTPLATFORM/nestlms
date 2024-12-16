import request from "@/lib/request";

export const getCourseFilterDataApi = async () => {
  const { data } = await request.get(`/course/course-filter-data`);
  return data;
};

export const getCourseListsForAllApi = async (
  page: any,
  limit: any,
  queryParams: any
) => {
  const { data } = await request.get(
    `/course/course-list?limit=${limit}&offset=${page}${
      queryParams ? "&" + queryParams : ""
    }`
  );
  return data;
};

export const getSearchCourseListsForNavbarApi = async (search: any) => {
  const { data } = await request.get(
    `/course/course-list-by-search?search=${search}`
  );
  return data;
};

export const addOrRemoveFromWishList = async (value: any) => {
  const { data } = await request.post(`/user/add-to-wishlist`, value);
  return data;
};
