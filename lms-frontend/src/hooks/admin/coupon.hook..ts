import { dateFormater, processResponse } from "@/lib/helper";
import {
  addCouponApi,
  couponDeleteApi,
  getAllCouponListsApi,
  getCouponDetailsApi,
  updateCouponApi,
} from "@/service/admin/coupon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const useGetCouponLists = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["couponLists", search, limit, page],
    queryFn: () => getAllCouponListsApi(page, limit, search),
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
  };
};

export const useAddCouponFormHandler = () => {
  const router = useRouter();
  const form = useForm<any>({
    defaultValues: {
      title: "",
      code: "",
      status: {},
      discount_type: {},
      uses_type: {},
      discount_amount: 0,
      minimum_purchase: 0,
      uses_limit: 0,
      start_date: new Date(),
      end_date: null,
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return addCouponApi(data);
  });

  const handleAddCoupon = async (data: any) => {
    try {
      let value = {
        ...data,
        status: Number(data.status?.value),
        discount_type: Number(data.discount_type?.value),
        uses_type: Number(data.uses_type?.value),
        start_date: dateFormater(data.start_date),
        end_date: dateFormater(data.end_date),
        discount_amount: Number(data.discount_amount),
        minimum_purchase: Number(data.minimum_purchase),
        uses_limit: Number(data.uses_limit),
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/admin/coupon`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddCoupon,
    isLoading,
  };
};

export const useDeleteCouponItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return couponDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["couponLists"]);
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

export const useGetCouponDetails = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["couponDetails", id],
    queryFn: () => getCouponDetails(id),
    enabled: id ? true : false,
  });

  const getCouponDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getCouponDetailsApi(id);
    if (!data.success) {
      toast.error(data.message);
      router.push(`/admin/coupon`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateCouponFormHandler = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const form = useForm<any>({
    defaultValues: {
      id: "",
      title: "",
      code: "",
      status: {},
      discount_type: {},
      uses_type: {},
      discount_amount: 0,
      minimum_purchase: 0,
      uses_limit: 0,
      start_date: new Date(),
      end_date: null,
    },
  });
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateCouponApi(data.value, data.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["couponLists"]);
      },
    }
  );

  const handleUpdateCoupon = async (data: any) => {
    try {
      let value = {
        title: data.title,
        code: data.code,
        status: Number(data.status?.value),
        discount_type: Number(data.discount_type?.value),
        uses_type: Number(data.uses_type?.value),
        start_date: dateFormater(data.start_date),
        end_date: dateFormater(data.end_date),
        discount_amount: Number(data.discount_amount),
        minimum_purchase: Number(data.minimum_purchase),
        uses_limit: Number(data.uses_limit),
      };
      const response = await mutateAsync({ value: value, id: data.id });
      processResponse(response);

      if (response.success) {
        router.push(`/admin/coupon`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUpdateCoupon,
    isLoading,
  };
};
