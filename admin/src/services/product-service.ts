import { api } from '~/utils';
import type {
   Paginated,
   Product,
   ProductForm,
   ProductSelect,
   QueryParams
} from '~/types';

const productService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<Product>>('/products/details', params),

   getSummary: () => api.get<ProductSelect[]>('/products/summary'),

   getById: (id: string) => api.get<ProductForm>(`/products/${id}/details`),

   upSert: (
      id: string | undefined | null,
      data: ProductForm,
      images?: (string | File)[]
   ) => {
      const formData = new FormData();
      const payload = { ...data };
      const imgs =
         images?.map((i) => (typeof i === 'string' ? i : null)) || undefined;
      if (imgs) {
         payload.images = imgs;
      }
      formData.append('data', JSON.stringify(payload));
      if (images) {
         images.forEach((file) => {
            if (file instanceof File) {
               formData.append('files', file);
            }
         });
      }
      if (id) {
         return api.patch<ProductForm>(`/products/${id}`, formData);
      }
      return api.post<ProductForm>('/products', formData);
   },

   delete: (id: string) => api.delete(`/products/${id}`)
};

export default productService;
