import type { AxiosRequestConfig } from 'axios';
import { http } from '~/config';
import type { HttpResponse } from '~/types';

type Params = Record<string, any>;

const api = {
   get: async <T>(
      url: string,
      params?: Params,
      config?: AxiosRequestConfig
   ): Promise<HttpResponse<T>> => {
      const { data } = await http.get<HttpResponse<T>>(url, {
         params,
         ...config
      });
      return data;
   },

   post: async <T>(
      url: string,
      body?: any,
      config?: AxiosRequestConfig
   ): Promise<HttpResponse<T>> => {
      const { data } = await http.post<HttpResponse<T>>(url, body, config);
      return data;
   },

   put: async <T>(
      url: string,
      body?: any,
      config?: AxiosRequestConfig
   ): Promise<HttpResponse<T>> => {
      const { data } = await http.put<HttpResponse<T>>(url, body, config);
      return data;
   },

   patch: async <T>(
      url: string,
      body?: any,
      config?: AxiosRequestConfig
   ): Promise<HttpResponse<T>> => {
      const { data } = await http.patch<HttpResponse<T>>(url, body, config);
      return data;
   },

   delete: async <T>(
      url: string,
      params?: Params,
      config?: AxiosRequestConfig
   ): Promise<HttpResponse<T>> => {
      const { data } = await http.delete<HttpResponse<T>>(url, {
         params,
         ...config
      });
      return data;
   }
};

export default api;
