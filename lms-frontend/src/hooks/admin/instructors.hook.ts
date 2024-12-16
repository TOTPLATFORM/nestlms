import { errorToast, processResponse } from "@/lib/helper";
import { updateAllUserStatusForAdminApi } from "@/service/admin/admin";
import {
  assignAnInstructor,
  checkAdminAmountForWithdrawRequestApi,
  getInstructorListsForAdmin,
  getPendingInstructorApplications,
  instructorDashboardInfo,
  instructorEarningsDashboardInfoApi,
  sendWithdrawRequestForInstructorApi,
} from "@/service/admin/instructors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
export const usePendingInstructorApplications = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["getPendingInstructorApplications", search, limit, page],
    queryFn: () => getPendingInstructorApplications(page, limit, search),
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
export const useAssignAnInstructor = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return assignAnInstructor(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getPendingInstructorApplications"]);
      },
    }
  );

  const handleStatusChange = async (user_id: number) => {
    try {
      let value = {
        user_id: user_id,
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
export const useInstructorDashboardInfo = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["instructorDashboardInfo"],
    queryFn: () => instructorDashboardInfo(),
  });

  return {
    data: data?.data,
    isLoading,
  };
};

export const useGetAllInstructorListsForAdmin = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["instructorListsForAdmin", search, limit, page],
    queryFn: () => getInstructorListsForAdmin(page, limit, search),
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

export const useUpdateInstructorStatusForAdmin = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateAllUserStatusForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["instructorListsForAdmin"]);
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

export const useInstructorEarningsDashboardInfo = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useQuery({
    queryKey: ["instructorEarningsDashboardInfo", search, limit, page],
    queryFn: () => instructorEarningsDashboardInfoApi(page, limit, search),
  });

  return {
    data: data?.data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
  };
};

export const useSendWithdrawRequestForInstructor = () => {
  const queryClient = useQueryClient();
  const form = useForm();
  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return sendWithdrawRequestForInstructorApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["instructorEarningsDashboardInfo"]);
      },
    }
  );

  const handleSendWithdrawReq = async (data: any) => {
    if (data?.requested_amount < 0) {
      errorToast("Please enter minimum amount greater than 0");
      return;
    }
    try {
      let value = {
        ...data,
        requested_amount: data?.requested_amount
          ? parseFloat(data?.requested_amount)
          : 0,
      };
      const response = await mutateAsync(value);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleSendWithdrawReq,
    isLoading,
    form,
    isSuccess,
  };
};

export const useCheckAdminAmountForWithdrawRequest = () => {
  const { mutateAsync, isLoading, isSuccess, data } = useMutation(
    (data: any) => {
      return checkAdminAmountForWithdrawRequestApi(data);
    }
  );

  const handleCheckAdminAmountWithdrawReq = async (data: any) => {
    try {
      let value = {
        requested_amount: data?.requested_amount
          ? parseFloat(data?.requested_amount)
          : 0,
      };
      const response = await mutateAsync(value);
      if (!response.success) {
        processResponse(response);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleCheckAdminAmountWithdrawReq,
    isLoading,
    isSuccess,
    data,
  };
};
