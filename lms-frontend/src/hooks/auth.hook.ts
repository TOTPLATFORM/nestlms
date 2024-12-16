import { processResponse } from "@/lib/helper";
import {
  GetInstructorApplicationStatus,
  GetUserProfile,
  GoogleloginApi,
  UserloginApi,
  becomeAnInstructor,
  forgetPasswordApi,
  loginApi,
  loginGithubApi,
  logoutApi,
  resetPasswordApi,
  userSignUPApi,
  verifyEmailApi,
} from "@/service/auth";
import { IRootState } from "@/store";
import { clearUser, setUser } from "@/store/slice/user.slice";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next-nprogress-bar";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
export const useSignin = () => {
  const router = useRouter();

  const { mutateAsync: mutateGoogle, isLoading: gLoading } = useMutation(
    (data: any) => {
      return GoogleloginApi(data.credential, data.clientId);
    }
  );
  const { mutateAsync: MutateGithub, isLoading: githubLoading } = useMutation(
    (data: any) => {
      return loginGithubApi(data);
    }
  );
  const handleGithubLogin = async (code: string) => {
    try {
      const response: any = await MutateGithub(code);
      processResponse(response);
      if (response.success) {
        router.push("/dashboard");
        Cookies.set("token", response?.data?.accessToken);
        Cookies.set("user", response?.data?.user);
      }
    } catch (error) {
      processResponse(error);
    }
  };
  const handleGoogleLogin = async (credential: string, clientId: string) => {
    try {
      const response: any = await mutateGoogle({ credential, clientId });
      processResponse(response);
      if (response.success) {
        router.push("/dashboard");
        Cookies.set("token", response?.data?.accessToken);
        Cookies.set("user", response?.data?.user);
      }
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    handleGoogleLogin,
    mutateGoogle,
    gLoading,
  };
};
export const useLoginHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return loginApi(data);
  });

  const handleLogin = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);

      if (response.success) {
        Cookies.set("token", response?.data?.accessToken);
        Cookies.set("is_admin", response?.data?.user_roles?.is_admin);
        Cookies.set(
          "is_super_admin",
          response?.data?.user_roles?.is_super_admin
        );
        Cookies.set("is_instructor", response?.data?.user_roles?.is_instructor);
        if (
          response?.data?.user_roles?.is_super_admin ||
          response?.data?.user_roles?.is_admin
        ) {
          router.push(`/admin`);
        } else {
          router.push(`/`);
        }
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleLogin,
    isLoading,
  };
};

export const useUserLoginHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return UserloginApi(data);
  });
  const dispatch = useDispatch();
  const handleLogin = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);

      if (response.success) {
        Cookies.set("token", response?.data?.accessToken);
        Cookies.set("is_instructor", response?.data?.user_roles?.is_instructor);
        Cookies.set("is_admin", response?.data?.user_roles?.is_admin);
        Cookies.set(
          "is_super_admin",
          response?.data?.user_roles?.is_super_admin
        );
        if (response?.data?.user_roles?.is_instructor) {
          dispatch(setUser(response?.data));
          router.push(`/instructor`);
        } else {
          router.push(`/`);
        }
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleLogin,
    isLoading,
  };
};

export const useProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: IRootState) => state.userSlice);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm();
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    retry: 0,
    queryKey: ["user"],
    queryFn: () => GetUserProfile(),
    onSuccess: (data) => {
      if (data.success === true) {
        dispatch(setUser(data.data));
        if (data?.data?.user_roles?.is_instructor === true) {
          Cookies.set("is_instructor", "true");
        }
      }
    },
    onError: () => {
      router.push("/login");
    },
    enabled: !!Cookies.get("token"),
  });
  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn]);

  return {
    isLoading: isProfileLoading,
    user: userProfile?.data,
    control,
    setValue,
    errors,
    watch,
    register,
    handleSubmit,
  };
};

export const useBecomeAnInstructor = () => {
  const { mutateAsync, isLoading } = useMutation(() => {
    return becomeAnInstructor();
  });
  const queryClient = useQueryClient();
  const apply = async () => {
    try {
      const response = await mutateAsync();
      processResponse(response);
      queryClient.invalidateQueries(["GetInstructorApplicationStatus"]);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    apply,
    isLoading,
  };
};
export const useGetInstructorApplicationStatus = () => {
  const { data, isLoading, refetch } = useQuery({
    retry: 0,
    queryKey: ["GetInstructorApplicationStatus"],
    queryFn: () => GetInstructorApplicationStatus(),
  });

  return {
    isLoading,
    data: data?.data,
    refetch,
  };
};
export const useUserSignUpHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      user_name: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return userSignUPApi(data);
  });
  const dispatch = useDispatch();
  const handleSignUp = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      if (response.success) {
        router.push(`/verify-email?email=${data?.email}`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleSignUp,
    isLoading,
  };
};

export const useUserVerifyEmailHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      code: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return verifyEmailApi(data);
  });
  const dispatch = useDispatch();
  const handleVerifyEmail = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);

      if (response.success) {
        router.push(`/login`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleVerifyEmail,
    isLoading,
  };
};

export const useUserForgetPassHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return forgetPasswordApi(data);
  });
  const dispatch = useDispatch();
  const handleForgetPassEmail = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);

      if (response.success) {
        router.push(`/reset-password?email=${data.email}`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleForgetPassEmail,
    isLoading,
  };
};

export const useUserResetPassHandler = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return resetPasswordApi(data);
  });
  const dispatch = useDispatch();
  const handleResetPassEmail = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);

      if (response.success) {
        router.push(`/login`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleResetPassEmail,
    isLoading,
  };
};
export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cookies = Cookies.get("token");

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return logoutApi(data);
    },
    {
      onSuccess: () => {
        dispatch(clearUser());
        Cookies.remove("token");
        Cookies.remove("admin");
        Cookies.remove("is_super_admin");
        Cookies.remove("is_instructor");
        router.push("/login");
      },
    }
  );
  const logout = async () => {
    try {
      const refreshToken = cookies;
      await mutateAsync({ refreshToken: refreshToken });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return {
    logout,
    isLoading,
  };
};
