import { processResponse } from "@/lib/helper";
import {
  addKycApi,
  getAllVerifykycListsApi,
  getAllkycListsApi,
  getKycDetailsApi,
  kycDeleteApi,
  updateKycApi,
  verifyKycUserForAdminApi,
} from "@/service/admin/kyc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const useGetkycLists = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["kycLists", search, limit, page],
    queryFn: () => getAllkycListsApi(page, limit, search),
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

export const useAddKycFormHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      is_text_required: false,
      is_file_required: false,
      status: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return addKycApi(data);
  });

  const handleAddKyc = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
        is_text_required: data.is_text_required ? 1 : 0,
        is_file_required: data.is_file_required ? 1 : 0,
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/admin/kyc`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddKyc,
    isLoading,
  };
};

export const useDeleteKycItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return kycDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["kycLists"]);
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

export const useGetKycDetails = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["kycDetails", id],
    queryFn: () => getKycDetails(id),
    enabled: id ? true : false,
  });

  const getKycDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getKycDetailsApi(id);
    if (!data.success) {
      toast.error(data.message);
      router.push(`/admin/kyc`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateKycFormHandler = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      is_text_required: false,
      is_file_required: false,
      status: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateKycApi(data.value, data.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["kycLists"]);
      },
    }
  );

  const handleUpdateKyc = async (data: any) => {
    try {
      let value = {
        name: data.name,
        status: Number(data.status?.value),
        is_text_required: data.is_text_required ? 1 : 0,
        is_file_required: data.is_file_required ? 1 : 0,
      };
      const response = await mutateAsync({ value: value, id: data.id });
      processResponse(response);

      if (response.success) {
        router.push(`/admin/kyc`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUpdateKyc,
    isLoading,
  };
};

export const useGetVerifykycLists = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["verifyKycLists", search, limit, page],
    queryFn: () => getAllVerifykycListsApi(page, limit, search),
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

export const useVerifyKycForUserFormHandlerForAdmin = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return verifyKycUserForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["verifyKycLists"]);
      },
    }
  );

  const handleVerifyKyc = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      if (response.success) {
        return true;
      }
      return false;
    } catch (error: any) {
      processResponse(error?.response?.data);
      return false;
    }
  };

  return {
    handleVerifyKyc,
    isLoading,
    isSuccess,
  };
};
