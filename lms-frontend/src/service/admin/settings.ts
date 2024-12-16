import request from "@/lib/request";

export const getPayoutSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/get-business-settings-data`);
  return data;
};

export const updatePayoutSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/update-business-settings", value);
  return data;
};

export const getStripeSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin-payment/get-stripe-settings`);
  return data;
};
export const updateStripeSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin-payment/update-stripe-settings",
    value
  );
  return data;
};

export const getRazorPaySettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin-payment/get-razorpay-settings`);
  return data;
};
export const updateRazorPaySettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin-payment/update-razorpay-settings",
    value
  );
  return data;
};

export const getPaystackSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin-payment/get-paystack-settings`);
  return data;
};
export const updatePaystackSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin-payment/update-paystack-settings",
    value
  );
  return data;
};

export const getBraintreeSettingsForAdminApi = async () => {
  const { data } = await request.get(
    `/admin-payment/get-braintree-payment-settings`
  );
  return data;
};
export const updateBraintreeSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin-payment/update-braintree-settings",
    value
  );
  return data;
};

export const getGithubSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/get-github-auth-settings-data`);
  return data;
};
export const updateGithubSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin/update-github-auth-settings",
    value
  );
  return data;
};

export const getGoogleSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/get-google-auth-settings-data`);
  return data;
};
export const updateGoogleSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin/update-google-auth-settings",
    value
  );
  return data;
};

export const getBannerSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/get-landing-main-banner-data`);
  return data;
};

export const updateBannerSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin/update-landing-main-banner-data",
    value
  );
  return data;
};

export const getAboutUsSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/get-landing-about-section-data`);
  return data;
};

export const updateAboutUsSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin/update-landing-about-section-data",
    value
  );
  return data;
};

export const getChooseUsSettingsForAdminApi = async () => {
  const { data } = await request.get(
    `/admin/get-landing-choose-us-section-data`
  );
  return data;
};

export const updateChooseUsSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin/update-landing-choose-us-section-data",
    value
  );
  return data;
};

export const getHowItWorkSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/get-landing-how-it-work-data`);
  return data;
};

export const updateHowItWorksSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post(
    "/admin/update-landing-how-it-work-data",
    value
  );
  return data;
};

export const getSiteSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/general-settings-data`);
  return data;
};

export const updateSiteSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/update-general-settings", value);
  return data;
};

export const getSmtpSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/get-smtp-settings-data`);
  return data;
};

export const updateSmtpSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/update-smtp-settings", value);
  return data;
};

export const sendSmtpTestEmailApi = async (value: any) => {
  const { data } = await request.post("/admin/send-test-mail", value);
  return data;
};

export const updatePrivacyAndTermsSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/update-terms-privacy", value);
  return data;
};

export const getPriacyAndTermsSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/get-terms-privacy-data`);
  return data;
};

export const getLiveClassSettingsForAdminApi = async () => {
  const { data } = await request.get(`/admin/get-agora-settings-data`);
  return data;
};

export const updateLiveClassSettingsForAdminApi = async (value: any) => {
  const { data } = await request.post("/admin/update-agora-settings", value);
  return data;
};
