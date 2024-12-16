import { processResponse } from "@/lib/helper";
import {
  addCategoriesApi,
  getAllCategoriesApi,
  categoryDeleteApi,
  getCategoryDetailsApi,
  updateCategoriesApi,
  addSubCategoriesApi,
  getAllSubCategoriesApi,
  subCategoryDeleteApi,
  getSubCategoryDetailsApi,
  updateSubCategoriesApi,
  getAllActiveCategoriesApi,
} from "@/service/admin/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const useGetCategoryLists = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["categoryLists", search, limit, page],
    queryFn: () => getAllCategoriesApi(page, limit, search),
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

export const useDeleteCategoryItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return categoryDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categoryLists"]);
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

export const useAddCategoriesFormHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      logo: "",
      status: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return addCategoriesApi(data);
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
        router.push(`/admin/categories`);
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

export const useGetCategoryDetails = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["CategoryDetails", id],
    queryFn: () => getCatDetails(id),
    enabled: id ? true : false,
  });

  const getCatDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getCategoryDetailsApi(id);
    if (!data.success) {
      toast.error(data.message);
      router.push(`/admin/categories`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateCategoriesFormHandler = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      logo: "",
      status: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateCategoriesApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categoryLists"]);
      },
    }
  );

  const handleUpdateCategories = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/admin/categories`);
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

export const useGetActiveCategoryLists = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categoryLists"],
    queryFn: () => getAllActiveCategoriesApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGetSubCategoryLists = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["subCategoryLists", search, limit, page],
    queryFn: () => getAllSubCategoriesApi(page, limit, search),
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

export const useAddSubCategoriesFormHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      logo: "",
      status: {},
      category_id: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return addSubCategoriesApi(data);
  });

  const handleAddSubCategories = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
        category_id: Number(data.category_id?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/admin/sub-categories`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddSubCategories,
    isLoading,
  };
};

export const useDeleteSubCategoryItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return subCategoryDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["subCategoryLists"]);
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

export const useUpdateSubCategoriesFormHandler = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      logo: "",
      status: {},
      category_id: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateSubCategoriesApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["subCategoryLists"]);
      },
    }
  );

  const handleUpdateSubCategories = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
        category_id: Number(data.category_id?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/admin/sub-categories`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUpdateSubCategories,
    isLoading,
  };
};

export const useGetSubCategoryDetails = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["SubCategoryDetails", id],
    queryFn: () => getSubCatDetails(id),
    enabled: id ? true : false,
  });

  const getSubCatDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getSubCategoryDetailsApi(id);
    if (!data.success) {
      toast.error(data.message);
      router.push(`/admin/sub-categories`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};
