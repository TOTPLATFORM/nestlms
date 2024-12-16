import { errorToast, processResponse } from "@/lib/helper";
import {
  addBlogForAdminApi,
  addCategoriesForBlogsApi,
  addTagForBlogsApi,
  blogDeleteForAdminApi,
  categoryDeleteForBlogsApi,
  changeCommentStatusApi,
  commentDeleteForBlogsAdminApi,
  getAllBlogsForAdminApi,
  getAllCategoriesForBlogForAdminApi,
  getAllCategoriesForBlogsApi,
  getAllPendingCommentForAdminApi,
  getAllTagsForBlogForAdminApi,
  getAlltagsForBlogsApi,
  getBlogDetailsForAdminApi,
  getCategoryDetailsForBlogsApi,
  getTagDetailsForBlogsApi,
  tagDeleteForBlogsApi,
  updateBlogForAdminApi,
  updateCategoriesForBlogsApi,
  updateTagForBlogsApi,
} from "@/service/admin/blog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useGetCategoryListsForBlogs = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["categoryListsForBlogs", search, limit, page],
    queryFn: () => getAllCategoriesForBlogsApi(page, limit, search),
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
    page,
  };
};

export const useDeleteCategoryItemForBlogs = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return categoryDeleteForBlogsApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categoryListsForBlogs"]);
      },
    }
  );

  const handleDelete = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDelete,
    isLoading,
  };
};

export const useAddCategoriesFormHandlerForBlogs = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      status: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return addCategoriesForBlogsApi(data);
  });

  const handleAddCategories = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/admin/blogs/categories`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddCategories,
    isLoading,
  };
};

export const useGetCategoryDetailsForBlogs = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["CategoryDetailsForBlogs", id],
    queryFn: () => getCatDetails(id),
    enabled: id ? true : false,
  });

  const getCatDetails = async (id: any) => {
    if (!id) {
      errorToast("Id Not Found");
      return;
    }
    const data = await getCategoryDetailsForBlogsApi(id);
    if (!data.success) {
      errorToast(data.message);
      router.push(`/admin/blogs/categories`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateCategoriesForBlogsFormHandler = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      status: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateCategoriesForBlogsApi(data.value, data.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categoryListsForBlogs"]);
      },
    }
  );

  const handleUpdateCategories = async (data: any) => {
    try {
      let value = {
        name: data?.name,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync({ value: value, id: data.id });
      processResponse(response);

      if (response.success) {
        router.push(`/admin/blogs/categories`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUpdateCategories,
    isLoading,
  };
};

export const useGetTagListsForBlogs = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["tagListsForBlogs", search, limit, page],
    queryFn: () => getAlltagsForBlogsApi(page, limit, search),
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
    page,
  };
};

export const useDeleteTagItemForBlogs = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return tagDeleteForBlogsApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tagListsForBlogs"]);
      },
    }
  );

  const handleDelete = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDelete,
    isLoading,
  };
};

export const useAddTagFormHandlerForBlogs = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      status: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return addTagForBlogsApi(data);
  });

  const handleAddTag = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/admin/blogs/tags`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddTag,
    isLoading,
  };
};

export const useGetTagDetailsForBlogs = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["TagDetailsForBlogs", id],
    queryFn: () => getTagDetails(id),
    enabled: id ? true : false,
  });

  const getTagDetails = async (id: any) => {
    if (!id) {
      errorToast("Id Not Found");
      return;
    }
    const data = await getTagDetailsForBlogsApi(id);
    if (!data.success) {
      errorToast(data.message);
      router.push(`/admin/blogs/tags`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateTagForBlogsFormHandler = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      status: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateTagForBlogsApi(data.value, data.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tagListsForBlogs"]);
      },
    }
  );

  const handleUpdateTag = async (data: any) => {
    try {
      let value = {
        name: data?.name,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync({ value: value, id: data.id });
      processResponse(response);

      if (response.success) {
        router.push(`/admin/blogs/tags`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUpdateTag,
    isLoading,
  };
};

export const useGetAllCategoriesForBlogsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["allCategoriesForBlogs"],
    queryFn: () => getAllCategoriesForBlogForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGetAllTagsForBlogsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["allTagsForBlogs"],
    queryFn: () => getAllTagsForBlogForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useAddBlogFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [imageId, setImageId] = useState();
  const [uploadImageUrl, setUploadImageUrl] = useState<any>();

  const [imageIdForSecond, setImageIdForSecond] = useState();
  const [uploadImageUrlForSecond, setUploadImageUrlForSecond] = useState<any>();

  const [imageIdForThird, setImageIdForThird] = useState();
  const [uploadImageUrlForThird, setUploadImageUrlForThird] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return addBlogForAdminApi(data);
    }
  );

  const handleSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        status: data?.status?.value,
        blog_category_id: data?.blog_category_id?.value,
        tag: data.tag?.map((item: any) => item?.value).join(","),
      };

      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push(`/admin/blogs`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    data,
    handleSettings,
    imageId,
    setImageId,
    uploadImageUrl,
    setUploadImageUrl,
    imageIdForSecond,
    setImageIdForSecond,
    uploadImageUrlForSecond,
    setUploadImageUrlForSecond,
    imageIdForThird,
    setImageIdForThird,
    uploadImageUrlForThird,
    setUploadImageUrlForThird,
    isLoading,
    isSuccess,
  };
};

export const useGetBlogListsForAdmin = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["blogListsForAdmin", search, limit, page],
    queryFn: () => getAllBlogsForAdminApi(page, limit, search),
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
    page,
  };
};

export const useDeleteBlogItemForAdmin = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return blogDeleteForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["blogListsForAdmin"]);
      },
    }
  );

  const handleDelete = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDelete,
    isLoading,
  };
};

export const useGetBlogDetailsForAdmin = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["blogDetailsForAdmin", id],
    queryFn: () => getBlogDetails(id),
    enabled: id ? true : false,
  });

  const getBlogDetails = async (id: any) => {
    if (!id) {
      errorToast("Id Not Found");
      return;
    }
    const data = await getBlogDetailsForAdminApi(id);
    if (!data.success) {
      errorToast(data.message);
      router.push(`/admin/blogs`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateBlogFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [imageId, setImageId] = useState();
  const [uploadImageUrl, setUploadImageUrl] = useState<any>();

  const [imageIdForSecond, setImageIdForSecond] = useState();
  const [uploadImageUrlForSecond, setUploadImageUrlForSecond] = useState<any>();

  const [imageIdForThird, setImageIdForThird] = useState();
  const [uploadImageUrlForThird, setUploadImageUrlForThird] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return updateBlogForAdminApi(data.value, data.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["blogListsForAdmin"]);
      },
    }
  );

  const handleSettings = async (data: any, id: any) => {
    try {
      let value = {
        ...data,
        status: data?.status?.value,
        blog_category_id: data?.blog_category_id?.value,
        tag: data.tag?.map((item: any) => item?.value).join(","),
      };

      const response = await mutateAsync({ value: value, id: id });
      processResponse(response);
      if (response.success) {
        router.push(`/admin/blogs`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    data,
    handleSettings,
    imageId,
    setImageId,
    uploadImageUrl,
    setUploadImageUrl,
    imageIdForSecond,
    setImageIdForSecond,
    uploadImageUrlForSecond,
    setUploadImageUrlForSecond,
    imageIdForThird,
    setImageIdForThird,
    uploadImageUrlForThird,
    setUploadImageUrlForThird,
    isLoading,
    isSuccess,
  };
};

export const useGetAllPendingCommentLists = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["AllPendingCommentLists", search, limit, page],
    queryFn: () => getAllPendingCommentForAdminApi(page, limit, search),
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
    page,
  };
};

export const useChangeCommentStatusFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return changeCommentStatusApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["AllPendingCommentLists"]);
      },
    }
  );

  const handleSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    data,
    handleSettings,

    isLoading,
    isSuccess,
  };
};

export const useDeleteCommentItemForBlogsAdmin = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return commentDeleteForBlogsAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["AllPendingCommentLists"]);
      },
    }
  );

  const handleDelete = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDelete,
    isLoading,
  };
};
