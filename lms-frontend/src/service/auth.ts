import request from "@/lib/request";

export const loginApi = async (value: any) => {
  const { data } = await request.post("/auth/admin/login", value);
  return data;
};
export const UserloginApi = async (value: any) => {
  const { data } = await request.post("/auth/login", value);
  return data;
};
export const loginGithubApi = async (code: string) => {
  const { data } = await request.get(`/auth/github-login?code=${code}`);
  return data;
};
export const GoogleloginApi = async (credential: string, clientId: string) => {
  const { data } = await request.post("/auth/google-login", {
    credential: credential,
    clientId: clientId,
  });
  return data;
};
export const logoutApi = async (value: any) => {
  const { data } = await request.post("/auth/logout", value);
  return data;
};
export const GetUserProfile = async () => {
  const { data } = await request.get("/user/profile");
  return data;
};

export const userSignUPApi = async (value: any) => {
  const { data } = await request.post("/auth/signup", value);
  return data;
};
export const becomeAnInstructor = async () => {
  const { data } = await request.post("/user/become-an-instructor");
  return data;
};
export const GetInstructorApplicationStatus = async () => {
  const { data } = await request.get("/user/get-instructor-application-status");
  return data;
};
export const verifyEmailApi = async (value: any) => {
  const { data } = await request.post("/auth/verify-email", value);
  return data;
};

export const forgetPasswordApi = async (value: any) => {
  const { data } = await request.post("/auth/forgot-password", value);
  return data;
};

export const resetPasswordApi = async (value: any) => {
  const { data } = await request.post("/auth/reset-password", value);
  return data;
};
