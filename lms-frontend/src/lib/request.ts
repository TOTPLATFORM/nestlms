import axios from "axios";
import Cookie from "js-cookie";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    apisecretkeycheck: process.env.NEXT_PUBLIC_API_SECRET,
  },
});

request.interceptors.request.use((config) => {
  const token = Cookie.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function apiRequest(base: any, query = null) {
  if (query === null) {
    return request(base);
  } else {
    return axios.get(base + query);
  }
}

export default request;
