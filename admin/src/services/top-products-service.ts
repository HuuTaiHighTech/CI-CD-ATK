import type {
   Paginated,
   QueryParams,
   TopProduct,
   TopProductForm
} from '~/types';
import { api } from '~/utils';

const topProductsService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<TopProduct>>('/top-products', params),

   getById: (id: string) => api.get<TopProductForm>(`/top-products/${id}`),

   upSert: async (
      id: string | undefined | null,
      data: TopProductForm,
      file?: File | null
   ) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('file', file);
      if (id) {
         return api.patch<TopProductForm>(`/top-products/${id}`, formData);
      }
      return api.post<TopProductForm>('/top-products', formData);
   },

   delete: (id: string) => api.delete(`/top-products/${id}`)
};

export default topProductsService;
