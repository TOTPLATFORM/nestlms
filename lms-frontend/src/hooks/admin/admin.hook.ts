import { ALL_USER_ROLLS } from "@/constant/core";
import { processResponse } from "@/lib/helper";
import {
  changeInstructorWithdrawReqApi,
  createUserForAdminApi,
  getAdminDashboard,
  getAllAdminListsForAdminApi,
  getAllStudentListsForAdminApi,
  getAllSubscriptionListsApi,
  getAllWithdrawRequestListsForAdminApi,
  updateAllUserStatusForAdminApi,
} from "@/service/admin/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useGetAllAdminListsForAdmin = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["allAdminListsForAdmin", search, limit, page],
    queryFn: () => getAllAdminListsForAdminApi(page, limit, search),
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
export const useGetAdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getAdminDashboard"],
    queryFn: () => getAdminDashboard(),
  });

  return {
    data: data?.data,
    isLoading,
  };
};
export const useGetAllStudentListsForAdmin = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["allStudentListsForAdmin", search, limit, page],
    queryFn: () => getAllStudentListsForAdminApi(page, limit, search),
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

export const useCreateUserForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return createUserForAdminApi(data);
  });

  const handleUserSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        gender: data.gender?.value,
        country: data.country?.value,
        status: data.status?.value,
        roles:
          data.roles?.value == ALL_USER_ROLLS.INSTRUCTOR
            ? `${ALL_USER_ROLLS.STUDENT},${ALL_USER_ROLLS.INSTRUCTOR}`
            : `${data.roles?.value}`,
      };
      const response = await mutateAsync(value);
      processResponse(response);
      if (response.success) {
        router.push(
          data.roles?.value == ALL_USER_ROLLS.INSTRUCTOR
            ? "/admin/instructors"
            : "/admin/students"
        );
      }
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

export const useUpdateStudentStatusForAdmin = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateAllUserStatusForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allStudentListsForAdmin"]);
      },
    }
  );

  const handleStatusChange = async (user_id: number, statusType: any) => {
    try {
      let value = {
        user_id: user_id,
        status_type: statusType,
      };
      const response = await mutateAsync(value);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleStatusChange,
    isLoading,
  };
};

export const useUpdateAdminStatusForAdmin = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateAllUserStatusForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allAdminListsForAdmin"]);
      },
    }
  );

  const handleStatusChange = async (user_id: number, statusType: any) => {
    try {
      let value = {
        user_id: user_id,
        status_type: statusType,
      };
      const response = await mutateAsync(value);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleStatusChange,
    isLoading,
  };
};

export const useGetWithdrawRequestLists = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["withdrawRequestLists", search, limit, page],
    queryFn: () => getAllWithdrawRequestListsForAdminApi(page, limit, search),
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

export const useChangeInstructorWithdrawReq = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return changeInstructorWithdrawReqApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["withdrawRequestLists"]);
      },
    }
  );

  const handleChangeInstructorWithdrawReq = async (data: any) => {
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
    handleChangeInstructorWithdrawReq,
    isLoading,
    isSuccess,
  };
};

export const useGetSubscriptionLists = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["subscriptionLists", search, limit, page],
    queryFn: () => getAllSubscriptionListsApi(page, limit, search),
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
