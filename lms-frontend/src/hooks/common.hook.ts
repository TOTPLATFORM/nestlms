import { processResponse } from "@/lib/helper";
import {
  commonSettingsApi,
  getInstructors,
  getblogCategoryListsForPublic,
  getblogCommentListsForPublic,
  getblogList,
  sendCommentForUserApi,
} from "@/service/common";
import { setSettings } from "@/store/slice/common.slice";
import { setLoading } from "@/store/slice/user.slice";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
export const useInstructors = () => {
  const dispatch = useDispatch();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getInstructors"],
    queryFn: () => getInstructors(),
  });

  return {
    isLoading,
    data,
    refetch,
  };
};
export const useCommonSettings = () => {
  const dispatch = useDispatch();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["commonSettings"],
    queryFn: () => commonSettingsApi(),
  });
  useEffect(() => {
    dispatch(setLoading(true));
    if (data?.data) {
      dispatch(setSettings(data?.data));
    }
    dispatch(setLoading(false));
  }, [data, isLoading]);
  return {
    isLoading,
    data,
    refetch,
  };
};
export const useGetblogList = () => {
  const [page, setPage] = useState<any>(1);
  const [limit, setLimit] = useState(9);
  const [queryParams, setQueryParams] = useState<any>("");
  const { data, isLoading } = useQuery({
    queryKey: ["courseListsForPublic", limit, page, queryParams],
    queryFn: () => getblogList(page, limit, queryParams),
  });

  return {
    data,
    isLoading,
    setPage,
    setLimit,
    limit,
    setQueryParams,
  };
};

export const useGetblogCategoryList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["blogCategoryListsForPublic"],
    queryFn: () => getblogCategoryListsForPublic(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGetCommentForUser = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["commentForUser"],
    queryFn: () => getblogCommentListsForPublic(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useSendCommentForUserFormHandler = () => {
  const form = useForm();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return sendCommentForUserApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["commentForUser"]);
      },
    }
  );

  const handleUserSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUserSettings,

    isLoading,
  };
};
