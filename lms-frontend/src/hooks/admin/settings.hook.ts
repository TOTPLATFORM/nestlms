import { errorToast, processResponse } from "@/lib/helper";
import {
  getAboutUsSettingsForAdminApi,
  getBannerSettingsForAdminApi,
  getBraintreeSettingsForAdminApi,
  getChooseUsSettingsForAdminApi,
  getGithubSettingsForAdminApi,
  getGoogleSettingsForAdminApi,
  getHowItWorkSettingsForAdminApi,
  getLiveClassSettingsForAdminApi,
  getPayoutSettingsForAdminApi,
  getPaystackSettingsForAdminApi,
  getPriacyAndTermsSettingsForAdminApi,
  getRazorPaySettingsForAdminApi,
  getSiteSettingsForAdminApi,
  getSmtpSettingsForAdminApi,
  getStripeSettingsForAdminApi,
  sendSmtpTestEmailApi,
  updateAboutUsSettingsForAdminApi,
  updateBannerSettingsForAdminApi,
  updateBraintreeSettingsForAdminApi,
  updateChooseUsSettingsForAdminApi,
  updateGithubSettingsForAdminApi,
  updateGoogleSettingsForAdminApi,
  updateHowItWorksSettingsForAdminApi,
  updateLiveClassSettingsForAdminApi,
  updatePayoutSettingsForAdminApi,
  updatePaystackSettingsForAdminApi,
  updatePrivacyAndTermsSettingsForAdminApi,
  updateRazorPaySettingsForAdminApi,
  updateSiteSettingsForAdminApi,
  updateSmtpSettingsForAdminApi,
  updateStripeSettingsForAdminApi,
} from "@/service/admin/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useGetPayoutSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["payoutSettingsForAdmin"],
    queryFn: () => getPayoutSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdatePayoutSettingsForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      withdraw_percentage: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updatePayoutSettingsForAdminApi(data);
  });

  const handlePayoutSettings = async (data: any) => {
    if (data.withdraw_percentage < 0) {
      errorToast("Minimum value should be greater or Equal than 0");
      return;
    }
    if (data.withdraw_percentage > 100) {
      errorToast("Maximum value should be Less or Equal than 100");
      return;
    }
    try {
      let value = {
        withdraw_percentage: data.withdraw_percentage
          ? Number(data.withdraw_percentage)
          : 0,
      };
      const response = await mutateAsync(value);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handlePayoutSettings,
    isLoading,
  };
};

export const useGetStripeSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["stripeSettingsForAdmin"],
    queryFn: () => getStripeSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateStripeSettingsForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      pm_stripe_client_id_live: "",
      pm_stripe_secret_key_live: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateStripeSettingsForAdminApi(data);
  });

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
    handleSettings,
    isLoading,
  };
};

export const useGetRazorPaySettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["razorPaySettingsForAdmin"],
    queryFn: () => getRazorPaySettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateRazorPaySettingsForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      payment_razorpay_key_id: "",
      payment_razorpay_key_secret: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateRazorPaySettingsForAdminApi(data);
  });

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
    handleSettings,
    isLoading,
  };
};

export const useGetPaystackSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["paystackSettingsForAdmin"],
    queryFn: () => getPaystackSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdatePaystackSettingsForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      payment_paystack_public_key: "",
      payment_paystack_key_secret: "",
      payment_paystack_redirect_url: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updatePaystackSettingsForAdminApi(data);
  });

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
    handleSettings,
    isLoading,
  };
};

export const useGetBraintreeSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["braintreeSettingsForAdmin"],
    queryFn: () => getBraintreeSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateBraintreeSettingsForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      braintree_payment_mode: {},
      braintree_merchant_id: "",
      braintree_public_key: "",
      braintree_private_key: "",
      braintree_tokenization_keys: "",
      braintree_google_merchant_id: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateBraintreeSettingsForAdminApi(data);
  });

  const handleSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        braintree_payment_mode: data?.braintree_payment_mode?.value,
      };
      const response = await mutateAsync(value);
      processResponse(response);
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

export const useGetGithubSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["githubSettingsForAdmin"],
    queryFn: () => getGithubSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateGithubSettingsForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      github_auth_client_id: "",
      github_auth_client_secret: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateGithubSettingsForAdminApi(data);
  });

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
    handleSettings,
    isLoading,
  };
};

export const useGetGoogleSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["googleSettingsForAdmin"],
    queryFn: () => getGoogleSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateGoogleSettingsForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      google_auth_client_id: "",
      google_auth_client_secret: "",
    },
  });
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateGoogleSettingsForAdminApi(data);
  });

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
    handleSettings,
    isLoading,
  };
};

export const useGetBannerSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["bannerSectionData"],
    queryFn: () => getBannerSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateBannerSettingsFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [imageId, setImageId] = useState();
  const [uploadImageUrl, setUploadImageUrl] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return updateBannerSettingsForAdminApi(data);
    }
  );

  const handleSettings = async (data: any, quesId: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      return response;
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
    isLoading,
    isSuccess,
  };
};

export const useGetAboutUsSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["aboutUsSectionData"],
    queryFn: () => getAboutUsSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateAboutUsSettingsFormHandler = () => {
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
      return updateAboutUsSettingsForAdminApi(data);
    }
  );

  const handleSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        landing_about_us_bullet_point: data.landing_about_us_bullet_point
          ?.map((item: any) => item?.list)
          .filter((list: any) => list?.trim() !== "")
          .join(","),
      };
      const response = await mutateAsync(value);
      processResponse(response);
      return response;
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

export const useGetChooseUsSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["chooseUsSectionData"],
    queryFn: () => getChooseUsSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateChooseUsSettingsFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [imageId, setImageId] = useState();
  const [uploadImageUrl, setUploadImageUrl] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return updateChooseUsSettingsForAdminApi(data);
    }
  );

  const handleSettings = async (data: any, quesId: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      return response;
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
    isLoading,
    isSuccess,
  };
};

export const useGetHowItWorksSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["howItWorkSectionData"],
    queryFn: () => getHowItWorkSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateHowItWorksUsSettingsFormHandler = () => {
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
      return updateHowItWorksSettingsForAdminApi(data);
    }
  );

  const handleSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      return response;
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

export const useGetSiteSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["siteSettingsData"],
    queryFn: () => getSiteSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateSiteSettingsFormHandler = () => {
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
      return updateSiteSettingsForAdminApi(data);
    }
  );

  const handleSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        default_country: data?.default_country?.value,
        social_login_google_status: data?.social_login_google_status ? 1 : 0,
        social_login_github_status: data?.social_login_github_status ? 1 : 0,
      };

      const response = await mutateAsync(value);
      processResponse(response);
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

export const useGetSmtpSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["smtpSettingsForAdmin"],
    queryFn: () => getSmtpSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateSmtpSettingsForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateSmtpSettingsForAdminApi(data);
  });

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
    handleSettings,
    isLoading,
  };
};

export const useSendSmtpTestEmail = () => {
  const router = useRouter();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return sendSmtpTestEmailApi(data);
  });

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
    handleSettings,
    isLoading,
  };
};

export const useGetPriacyAndTermsSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["priacyAndTermsSettingsData"],
    queryFn: () => getPriacyAndTermsSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdatePriacyAndTermsSettingsFormHandler = () => {
  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return updatePrivacyAndTermsSettingsForAdminApi(data);
    }
  );

  const handleSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        privacy_policy_status: data?.privacy_policy_status ? 1 : 0,
        terms_condition_status: data?.terms_condition_status ? 1 : 0,
      };

      const response = await mutateAsync(value);
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

export const useGetLiveClassSettingsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["liveClassSettingsForAdmin"],
    queryFn: () => getLiveClassSettingsForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateLiveClassSettingsForAdminFormHandler = () => {
  const router = useRouter();

  const form = useForm<any>();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return updateLiveClassSettingsForAdminApi(data);
  });

  const handleSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        agora_status: data?.agora_status ? 1 : 0,
      };
      const response = await mutateAsync(value);
      processResponse(response);
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
