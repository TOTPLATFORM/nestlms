import { processResponse } from "@/lib/helper";
import {
  addFaqApi,
  faqDeleteApi,
  getAllFaqListsApi,
  getFaqDetailsApi,
  updateFaqApi,
} from "@/service/admin/faq";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const useGetFaqLists = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["faqLists", search, limit, page],
    queryFn: () => getAllFaqListsApi(page, limit, search),
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

export const useAddFaqFormHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      question: "",
      answer: "",
      status: {},
      type: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return addFaqApi(data);
  });

  const handleAddFaq = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
        type: Number(data.type?.value),
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/admin/faq`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddFaq,
    isLoading,
  };
};

export const useDeleteFaqItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return faqDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["faqLists"]);
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

export const useGetFaqDetails = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["FaqDetails", id],
    queryFn: () => getFaqDetails(id),
    enabled: id ? true : false,
  });

  const getFaqDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getFaqDetailsApi(id);
    if (!data.success) {
      toast.error(data.message);
      router.push(`/admin/faq`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateFaqFormHandler = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      id: "",
      question: "",
      answer: "",
      status: {},
      type: {},
    },
  });
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateFaqApi(data.value, data.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["faqLists"]);
      },
    }
  );

  const handleUpdateFaq = async (data: any) => {
    try {
      let value = {
        question: data.question,
        answer: data.answer,
        status: Number(data.status?.value),
        type: Number(data.type?.value),
      };
      const response = await mutateAsync({ value: value, id: data.id });
      processResponse(response);

      if (response.success) {
        router.push(`/admin/faq`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUpdateFaq,
    isLoading,
  };
};
