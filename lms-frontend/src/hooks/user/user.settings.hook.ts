import { errorToast, processResponse } from "@/lib/helper";
import {
  addCourseApi,
  getAllActiveCategoriesForUserApi,
} from "@/service/user/course";
import {
  checkKycVerificationForUserApi,
  createLiveClassForInstructorApi,
  deleteLiveClassItemForInstructorApi,
  endLiveClassForInstructorApi,
  getCourseListsForInstructorLiveClassApi,
  getKycVerificationListsForUserApi,
  getLiveClassListsForInstructorApi,
  getUserDetailsApi,
  getliveClassDetailsForInstructorApi,
  joinLiveClassForStudentApi,
  startLiveClassForInstructorApi,
  updateLiveClassForInstructorApi,
  updateUserSettingsApi,
  verifyKycFromUserApi,
} from "@/service/user/user.settings";

import { setUser } from "@/store/slice/user.slice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const useGetActiveCategoryListsForUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categoryListsForUser"],
    queryFn: () => getAllActiveCategoriesForUserApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGetUserProfileDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data, isLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserDetails(),
  });

  const getUserDetails = async () => {
    const data = await getUserDetailsApi();
    if (!data.success) {
      toast.error(data.message);
      router.push(`/instructor`);
      return;
    }
    dispatch(setUser(data?.data));

    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateUserSettingsFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [imageId, setImageId] = useState();
  const [uploadImageUrl, setUploadImageUrl] = useState();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateUserSettingsApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["userDetails"]);
      },
    }
  );

  const handleUserSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        gender: data.gender?.value,
        country: data.country?.value,
      };
      const response = await mutateAsync(value);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUserSettings,
    uploadImageUrl,
    setUploadImageUrl,
    setImageId,
    imageId,
    isLoading,
  };
};

export const useGetKycVerificationListsForUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["kycVerificationListsForUser"],
    queryFn: () => getKycVerificationListsForUserApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useVerifyKycForUserFormHandler = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [imageId, setImageId] = useState();
  const [uploadImageUrl, setUploadImageUrl] = useState();
  const form = useForm({
    defaultValues: {
      kyc_verification_id: "",
      text: "",
      file_id: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return verifyKycFromUserApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["kycVerificationListsForUser"]);
      },
    }
  );

  const handleSubmitKycForUser = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleSubmitKycForUser,
    isLoading,
    uploadImageUrl,
    setUploadImageUrl,
    imageId,
    setImageId,
  };
};

export const useCheckKycForUserFormHandler = () => {
  const { mutateAsync, isLoading } = useMutation(() => {
    return checkKycVerificationForUserApi();
  });

  const handleCheckKycForUser = async () => {
    try {
      const response = await mutateAsync();
      if (!response?.success) {
        if (response?.data?.length > 0) {
          response?.data?.map((errorMsg: any) => {
            errorToast(errorMsg?.message);
          });
          return false;
        }
        errorToast(response?.message);
        return false;
      }
      return true;
    } catch (error: any) {
      processResponse(error?.response?.data);
      return false;
    }
  };

  return {
    handleCheckKycForUser,
    isLoading,
  };
};

export const useGetCourseListsForInstructorLiveClass = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["courseListsForInstructorLiveClass"],
    queryFn: () => getCourseListsForInstructorLiveClassApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useCreateLiveClassForInstructorFormHandler = () => {
  const router = useRouter();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return createLiveClassForInstructorApi(data);
  });

  const handleSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      if (response?.success) {
        router.push("/instructor/live-class");
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleSettings,
    isLoading,
  };
};

export const useGetLiveClassListsForInstructor = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["liveClassListsForInstructor", search, limit, page],
    queryFn: () => getLiveClassListsForInstructorApi(page, limit, search),
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

export const useDeleteLiveClassItemForInstructor = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return deleteLiveClassItemForInstructorApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["liveClassListsForInstructor"]);
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

export const useGetLiveClassDetailsForInstructor = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["liveClassDetailsForInstructor", id],
    queryFn: () => getLiveClassDetails(id),
    enabled: id ? true : false,
  });

  const getLiveClassDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getliveClassDetailsForInstructorApi(id);
    if (!data.success) {
      toast.error(data.message);
      router.push(`/instructor/live-class`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateLiveClassForInstructorFormHandler = () => {
  const router = useRouter();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateLiveClassForInstructorApi(data);
  });

  const handleSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      if (response?.success) {
        router.push("/instructor/live-class");
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleSettings,
    isLoading,
  };
};

export const useStartLiveClassForInstructorFormHandler = () => {
  const router = useRouter();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return startLiveClassForInstructorApi(data);
  });

  const startLiveClassHandler = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      if (response?.success) {
        router.push(
          `/video-call?class_name=${data?.class_name}&user_token=${response?.data?.token}`
        );
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    startLiveClassHandler,
    isLoading,
  };
};

export const useJoinLiveClassForStudentFormHandler = () => {
  const router = useRouter();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return joinLiveClassForStudentApi(data);
  });

  const joinLiveClassHandler = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      if (response?.success) {
        router.push(
          `/video-call?class_name=${data?.class_name}&user_token=${response?.data?.token}`
        );
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    joinLiveClassHandler,
    isLoading,
  };
};

export const useEndLiveClassForInstructorFormHandler = () => {
  const router = useRouter();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return endLiveClassForInstructorApi(data);
  });

  const endLiveClassHandler = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      if (response?.success) {
        router.push(`/instructor/live-class`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    endLiveClassHandler,
    isLoading,
  };
};
