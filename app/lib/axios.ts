import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosInstance,
  type AxiosError,
} from "axios";

/* ================================
   Auth bridge
================================ */

type AuthAdapter = {
  getAccessToken: () => string | null;
  logout?: () => void;
  onForbidden?: () => void;
};

let authAdapter: AuthAdapter | null = null;

/**
 * Bind auth manager once at app startup
 */
export function configureAxiosAuth(adapter: AuthAdapter) {
  // Axios auth adapter already configured. Ignoring re-configuration.
  if (authAdapter) return;
  authAdapter = adapter;
}

/* ================================
   Axios instance (low-level)
================================ */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: false,
});

/* ================================
   Interceptors
================================ */

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authAdapter?.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) authAdapter?.logout?.();
    if (status === 403) authAdapter?.onForbidden?.();

    return Promise.reject(error);
  }
);

/* ================================
   Public API (preferred)
================================ */

export const Axios = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get(url, config),

  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => axiosInstance.post(url, data, config),

  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => axiosInstance.put(url, data, config),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => axiosInstance.patch(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete(url, config),
};

/* ================================
   Escape hatch (explicit)
================================ */

export { axiosInstance };
