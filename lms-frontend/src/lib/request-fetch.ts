import Cookie from "js-cookie";

interface RequestOptions {
  headers?: Record<string, string>;
  method?: string;
  body?: string | FormData;
}

const requestFetch = async (
  baseURL: string,
  { headers, ...customConfig }: RequestOptions = {}
) => {
  const token = Cookie.get("token");

  const config: RequestInit = {
    method: customConfig.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      apisecretkeycheck: process.env.NEXT_PUBLIC_API_SECRET || "",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    cache: "no-store",
    ...customConfig,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${baseURL}`,
      config
    );

    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw data;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export function apiRequest(base: string, query = null) {
  const url = query === null ? base : `${base}${query}`;
  return requestFetch(url);
}

export default requestFetch;
