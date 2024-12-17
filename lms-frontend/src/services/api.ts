const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'apisecretkeycheck': API_SECRET || '',
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
