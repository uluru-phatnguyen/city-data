import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_URL } from "src/constants";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const request = async <Response = any>(
  options: AxiosRequestConfig
) => {
  const onSuccess = (response: AxiosResponse<Response>) => {
    return response?.data;
  };

  const onError = (error: any) => {
    return Promise.reject(error.response?.data);
  };

  return client({ ...(options || {}), baseURL: API_URL })
    .then(onSuccess)
    .catch(onError);
};
