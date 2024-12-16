import request from "@/lib/request";

export const getAllCategoriesForBlogsApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-blog-category?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const categoryDeleteForBlogsApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-blog-category-${id}`);
  return data;
};

export const addCategoriesForBlogsApi = async (value: any) => {
  const { data } = await request.post("/admin/add-blog-category", value);
  return data;
};

export const getCategoryDetailsForBlogsApi = async (id: any) => {
  const { data } = await request.get(`/admin/blog-category-details-${id}`);
  return data;
};

export const updateCategoriesForBlogsApi = async (value: any, id: any) => {
  const { data } = await request.put(
    `/admin/update-blog-category-${id}`,
    value
  );
  return data;
};

export const getAlltagsForBlogsApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/blog-tag-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const tagDeleteForBlogsApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-blog-tag-${id}`);
  return data;
};

export const addTagForBlogsApi = async (value: any) => {
  const { data } = await request.post("/admin/add-blog-tag", value);
  return data;
};

export const getTagDetailsForBlogsApi = async (id: any) => {
  const { data } = await request.get(`/admin/get-blog-tag-${id}`);
  return data;
};

export const updateTagForBlogsApi = async (value: any, id: any) => {
  const { data } = await request.put(`/admin/update-blog-tag-${id}`, value);
  return data;
};

export const getAllCategoriesForBlogForAdminApi = async () => {
  const { data } = await request.get(`/admin/all-blog-category`);
  return data;
};

export const getAllTagsForBlogForAdminApi = async () => {
  const { data } = await request.get(`/admin/all-blog-tag`);
  return data;
};

export const addBlogForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/create-new-blog", value);
  return data;
};

export const getAllBlogsForAdminApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-blog-list?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const blogDeleteForAdminApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-blog-post-${id}`);
  return data;
};

export const getBlogDetailsForAdminApi = async (id: any) => {
  const { data } = await request.get(`/admin/get-blog-post-details-${id}`);
  return data;
};

export const updateBlogForAdminApi = async (value: any, id: any) => {
  const { data } = await request.put(`/admin/update-blog-post-${id}`, value);
  return data;
};

export const getAllPendingCommentForAdminApi = async (
  page: any,
  limit: any,
  search: any
) => {
  const { data } = await request.get(
    `/admin/get-blog-pending-comments?limit=${limit}&offset=${page}&search=${search}`
  );
  return data;
};

export const changeCommentStatusApi = async (value: any) => {
  const { data } = await request.post(`/admin/approve-blog-comment`, value);
  return data;
};

export const commentDeleteForBlogsAdminApi = async (id: any) => {
  const { data } = await request.delete(`/admin/delete-blog-comment-${id}`);
  return data;
};
