import type {
   Paginated,
   PinProduct,
   PinProductForm,
   QueryParams
} from '~/types';
import { api } from '~/utils';

const pinProductsService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<PinProduct>>('/pin-products', params),

   getById: (id: string) => api.get<PinProductForm>(`/pin-products/${id}`),

   upSert: async (
      id: string | undefined | null,
      data: PinProductForm,
      file?: File | null
   ) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('file', file);
      if (id) {
         return api.patch<PinProductForm>(`/pin-products/${id}`, formData);
      }
      return api.post<PinProductForm>('/pin-products', formData);
   },

   delete: (id: string) => api.delete(`/pin-products/${id}`)
};

export default pinProductsService;
