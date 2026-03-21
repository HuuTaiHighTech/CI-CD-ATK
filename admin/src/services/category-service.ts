import { api } from '~/utils';
import type {
   Category,
   CategoryForm,
   CategorySelect,
   Paginated,
   QueryParams
} from '~/types';

const categoryService = {
   get: (params?: Partial<QueryParams>) =>
      api.get<Paginated<Category>>('/categories/details', params),

   getSummary: (excludeId?: string) =>
      api.get<CategorySelect[]>('/categories/summary', { excludeId }),

   getById: (id: string) => api.get<CategoryForm>(`/categories/${id}/details`),

   upSert: async (
      id: string | undefined | null,
      data: CategoryForm,
      file?: File | null
   ) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (file) formData.append('file', file);
      if (id) {
         return api.patch<CategoryForm>(`/categories/${id}`, formData);
      }
      return api.post<CategoryForm>('/categories', formData);
   },

   delete: (id: string) => api.delete(`/categories/${id}`)
};

export default categoryService;
